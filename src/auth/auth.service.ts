import { Injectable } from "@nestjs/common";
import { UserDTO } from "src/users/users.dto";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService) { }

    create(user: UserDTO) {
        return this.usersService.create(user);
    }
}