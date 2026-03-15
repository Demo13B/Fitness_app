import { Body, Controller, Get, HttpCode, HttpStatus, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserDTO } from "./users.dto";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse } from "@nestjs/swagger";
import { User } from "./users.entity";

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get()
    @ApiOkResponse({ description: 'A list of all users' })
    getAll() {
        return this.usersService.readAll();
    }

    @UsePipes(ValidationPipe)
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiCreatedResponse({ description: 'Created user data' })
    @ApiBadRequestResponse({ description: 'Validation errors or username already exists' })
    postUser(@Body() body: UserDTO) {
        return this.usersService.create(body);
    }
}