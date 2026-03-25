import { Controller, Post, Body, HttpException, HttpStatus, UsePipes, ValidationPipe, Res, Req, UseGuards } from "@nestjs/common";
import { UserDTO } from "src/users/users.dto";
import { AuthService } from "./auth.service";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { LoginDTO, RegisterDTO } from "./auth.dto";
import type { Request, Response } from "express";
import { RefreshGuard } from "./guards/refresh.guard";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @UsePipes(ValidationPipe)
    @Post('register')
    @ApiCreatedResponse({ description: 'Created user data' })
    @ApiBadRequestResponse({ description: 'Validation errors or admin role' })
    registerUser(@Body() body: RegisterDTO) {
        return this.authService.create(body);
    }

    @UsePipes(ValidationPipe)
    @Post('login')
    @ApiCreatedResponse({ description: 'Acceess and refresh tokens' })
    @ApiUnauthorizedResponse({ description: 'Provided credentials are incorrect' })
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

    @UseGuards(RefreshGuard)
    @Post('refresh')
    @ApiCreatedResponse({ description: 'Renewed tokens' })
    @ApiUnauthorizedResponse({ description: 'Refresh token not provided or invalidated' })
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const tokens = await this.authService.refresh(req.cookies.refresh_token);
        res.cookie('access_token', tokens.new_access_token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: true
        });
        res.cookie('refresh_token', tokens.new_refresh_token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: true
        });

        return tokens;
    }

    @Post('logout')
    logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        if (!req.cookies.refresh_token)
            return;

        this.authService.logout(req.cookies.refresh_token);
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
    }
}