import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Patch, Post, Put, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ProfileDTO, UserDTO, UserPatchDTO } from "./users.dto";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse } from "@nestjs/swagger";
import { AuthGuard } from "src/guards/auth.guard";
import { AdminGuard } from "src/guards/admin.guard";
import type { RequestWithUser } from "src/interfaces/request.interface";

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @UseGuards(AuthGuard, AdminGuard)
    @Get()
    @ApiOkResponse({ description: 'A list of all users' })
    getAll() {
        return this.usersService.readAll();
    }

    @UseGuards(AuthGuard)
    @Get('me')
    getMe(@Req() req: RequestWithUser) {
        return this.usersService.readById(req.user.user_id);
    }

    @UseGuards(AuthGuard, AdminGuard)
    @Get(':id')
    async getById(@Param('id') id: number) {
        const user = await this.usersService.readById(id);
        if (!user)
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        return user;
    }

    @UseGuards(AuthGuard, AdminGuard)
    @UsePipes(ValidationPipe)
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiCreatedResponse({ description: 'Created user data' })
    @ApiBadRequestResponse({ description: 'Validation errors or username already exists' })
    postUser(@Body() body: UserDTO) {
        return this.usersService.create(body);
    }

    @UseGuards(AuthGuard, AdminGuard)
    @UsePipes(ValidationPipe)
    @Post(':id/profile')
    @HttpCode(HttpStatus.CREATED)
    @ApiOkResponse({ description: 'Created profile data' })
    @ApiNotFoundResponse({ description: 'User does not exist' })
    @ApiBadRequestResponse({ description: 'Validation errors or user already has profile' })
    postProfile(
        @Param('id') user_id: number,
        @Body() body: ProfileDTO
    ) {
        return this.usersService.createProfile(user_id, body);
    }

    @UseGuards(AuthGuard, AdminGuard)
    @UsePipes(ValidationPipe)
    @Patch(':id')
    patchUser(@Param('id') id: number, @Body() body: UserPatchDTO) {
        return this.usersService.update(id, body);
    }

    @UseGuards(AuthGuard, AdminGuard)
    @UsePipes(ValidationPipe)
    @Put(':id/profile')
    putProfile(
        @Param('id') user_id: number,
        @Body() body: ProfileDTO
    ) {
        return this.usersService.updateProfile(user_id, body);
    }

    @UseGuards(AuthGuard, AdminGuard)
    @Delete(':id')
    @ApiOkResponse({ description: 'Operation result' })
    async deleteUser(@Param('id') id: number) {
        const result = await this.usersService.delete(id);
        return { deleted: result.affected }
    }

}