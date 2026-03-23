import { Controller, Post, Body, HttpException, HttpStatus, UsePipes, ValidationPipe, HttpCode } from "@nestjs/common";
import { UserDTO } from "src/users/users.dto";
import { AuthService } from "./auth.service";
import { ApiBadRequestResponse, ApiCreatedResponse } from "@nestjs/swagger";

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
}