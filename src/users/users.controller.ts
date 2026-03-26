import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Patch, Post, Put, Req, Res, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ProfileDTO, UserDTO, UserPatchDTO, UserPatchSelfDTO } from "./users.dto";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { AuthGuard } from "src/guards/auth.guard";
import { AdminGuard } from "src/guards/admin.guard";
import type { RequestWithUser } from "src/interfaces/request.interface";
import type { Response } from "express";

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @UseGuards(AuthGuard, AdminGuard)
    @Get()
    @ApiOkResponse({ description: 'A list of all users' })
    @ApiUnauthorizedResponse({ description: 'Authorization failed' })
    @ApiForbiddenResponse({ description: 'Access rights mismatch' })
    getAll() {
        return this.usersService.readAll();
    }

    @UseGuards(AuthGuard)
    @Get('self')
    @ApiOkResponse({ description: 'Self user data' })
    @ApiUnauthorizedResponse({ description: 'Authorization failed' })
    getMe(@Req() req: RequestWithUser) {
        return this.usersService.readById(req.user.user_id);
    }

    @UseGuards(AuthGuard, AdminGuard)
    @Get(':id')
    @ApiOkResponse({ description: 'Requested user data' })
    @ApiUnauthorizedResponse({ description: 'Authorization failed' })
    @ApiForbiddenResponse({ description: 'Access rights mismatch' })
    async getById(@Param('id') id: number) {
        const user = await this.usersService.readById(id);
        if (!user)
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        return user;
    }

    @UseGuards(AuthGuard, AdminGuard)
    @UsePipes(ValidationPipe)
    @Post()
    @ApiCreatedResponse({ description: 'Created user data' })
    @ApiBadRequestResponse({ description: 'Validation errors or username already exists' })
    @ApiUnauthorizedResponse({ description: 'Authorization failed' })
    @ApiForbiddenResponse({ description: 'Access rights mismatch' })
    postUser(@Body() body: UserDTO) {
        return this.usersService.create(body);
    }

    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    @Post('self/profile')
    @ApiCreatedResponse({ description: 'Self updated user data' })
    @ApiBadRequestResponse({ description: 'Validation errors or profile already exists' })
    @ApiUnauthorizedResponse({ description: 'Authorization failed' })
    postSelfProfile(
        @Req() req: RequestWithUser,
        @Body() body: ProfileDTO
    ) {
        return this.usersService.createProfile(req.user.user_id, body);
    }

    @UseGuards(AuthGuard, AdminGuard)
    @UsePipes(ValidationPipe)
    @Post(':id/profile')
    @ApiOkResponse({ description: 'Created profile data' })
    @ApiNotFoundResponse({ description: 'User does not exist' })
    @ApiUnauthorizedResponse({ description: 'Authorization failed' })
    @ApiForbiddenResponse({ description: 'Access rights mismatch' })
    @ApiBadRequestResponse({ description: 'Validation errors or user already has profile' })
    postProfile(
        @Param('id') user_id: number,
        @Body() body: ProfileDTO
    ) {
        return this.usersService.createProfile(user_id, body);
    }

    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    @Patch('self')
    @ApiOkResponse({ description: 'Patched self user data' })
    @ApiBadRequestResponse({ description: 'Validation failed' })
    @ApiUnauthorizedResponse({ description: 'Authorization failed' })
    patchSelf(
        @Req() req: RequestWithUser,
        @Body() body: UserPatchSelfDTO
    ) {
        return this.usersService.updateSelf(req.user.user_id, body);
    }

    @UseGuards(AuthGuard, AdminGuard)
    @UsePipes(ValidationPipe)
    @Patch(':id')
    @ApiOkResponse({ description: 'Patched requested user data' })
    @ApiBadRequestResponse({ description: 'Validation failed' })
    @ApiUnauthorizedResponse({ description: 'Authorization failed' })
    @ApiForbiddenResponse({ description: 'Access rights mismatch' })
    @ApiNotFoundResponse({ description: 'User not found' })
    patchUser(@Param('id') id: number, @Body() body: UserPatchDTO) {
        return this.usersService.update(id, body);
    }

    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    @Put('self/profile')
    @ApiOkResponse({ description: 'Seld updated user data' })
    @ApiBadRequestResponse({ description: 'Validation failed' })
    @ApiUnauthorizedResponse({ description: 'Authorization failed' })
    @ApiForbiddenResponse({ description: 'Access rights mismatch' })
    putSelfProfile(
        @Req() req: RequestWithUser,
        @Body() body: ProfileDTO
    ) {
        return this.usersService.updateProfile(req.user.user_id, body);
    }

    @UseGuards(AuthGuard, AdminGuard)
    @UsePipes(ValidationPipe)
    @Put(':id/profile')
    @ApiOkResponse({ description: 'Updated requested user data' })
    @ApiNotFoundResponse({ description: 'User does not exist' })
    @ApiUnauthorizedResponse({ description: 'Authorization failed' })
    @ApiForbiddenResponse({ description: 'Access rights mismatch' })
    @ApiBadRequestResponse({ description: 'Validation errors' })
    putProfile(
        @Param('id') user_id: number,
        @Body() body: ProfileDTO
    ) {
        return this.usersService.updateProfile(user_id, body);
    }

    @UseGuards(AuthGuard)
    @Delete('self')
    @ApiOkResponse({ description: 'Operation result' })
    @ApiUnauthorizedResponse({ description: 'Authorization failed' })
    async deleteSelf(
        @Req() req: RequestWithUser,
        @Res({ passthrough: true }) res: Response
    ) {
        const result = this.usersService.delete(req.user.user_id);
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        return { deleted: (await result).affected }
    }

    @UseGuards(AuthGuard, AdminGuard)
    @Delete(':id')
    @ApiOkResponse({ description: 'Operation result' })
    @ApiUnauthorizedResponse({ description: 'Authorization failed' })
    @ApiForbiddenResponse({ description: 'Access rights mismatch' })
    async deleteUser(@Param('id') id: number) {
        const result = await this.usersService.delete(id);
        return { deleted: result.affected }
    }

}