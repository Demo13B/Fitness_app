import { Controller, Post, Body, HttpException, HttpStatus, UsePipes, ValidationPipe, HttpCode, Res, Get, Param } from "@nestjs/common";
import { UserDTO } from "src/users/users.dto";
import { AuthService } from "./auth.service";
import { ApiBadRequestResponse, ApiCreatedResponse } from "@nestjs/swagger";
import { LoginDTO } from "./auth.dto";
import type { Response } from "express";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @UsePipes(ValidationPipe)
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ApiCreatedResponse({ description: 'Created user data' })
    @ApiBadRequestResponse({ description: 'Validation errors or admin role' })
    registerUser(@Body() body: UserDTO) {
        if (body.role === 'admin')
            throw new HttpException("Can't register admin", HttpStatus.BAD_REQUEST);

        return this.authService.create(body);
    }

    @UsePipes(ValidationPipe)
    @Post('login')
    @HttpCode(HttpStatus.CREATED)
    async login(@Body() body: LoginDTO, @Res({ passthrough: true }) res: Response) {
        const tokens = await this.authService.login(body);
        res.cookie('access_token', tokens.access_token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: true
        });
        res.cookie('refresh_token', tokens.refresh_token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: true
        });

        return tokens;
    }

    @UsePipes(ValidationPipe)
    @Get('logout/:id')
    logout(@Param('id') user_id: number, @Res({ passthrough: true }) res: Response) {
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        this.authService.logout(user_id);
    }
}