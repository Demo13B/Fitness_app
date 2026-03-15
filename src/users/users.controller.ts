import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserDTO } from "./users.dto";

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get()
    getAll() {
        return this.usersService.readAll();
    }

    @UsePipes(ValidationPipe)
    @Post()
    postUser(@Body() body: UserDTO) {
        return this.usersService.create(body);
    }
}