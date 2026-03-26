import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ProfileDTO, UserDTO } from "./users.dto";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse } from "@nestjs/swagger";
import { AuthGuard } from "src/guards/auth.guard";
import { AdminGuard } from "src/guards/admin.guard";

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @UseGuards(AuthGuard, AdminGuard)
    @Get()
    @ApiOkResponse({ description: 'A list of all users' })
    getAll() {
        return this.usersService.readAll();
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
    @Delete(':id')
    @ApiOkResponse({ description: 'Operation result' })
    async deleteUser(@Param('id') id: number) {
        const result = await this.usersService.delete(id);
        return { deleted: result.affected }
    }

}