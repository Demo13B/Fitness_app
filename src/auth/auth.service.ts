import { Injectable } from "@nestjs/common";
import { UserDTO } from "src/users/users.dto";
import { UsersService } from "src/users/users.service";
import { LoginDTO } from "./auth.dto";
import { RedisService } from "src/redis/redis.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly redisService: RedisService,
        private readonly JwtService: JwtService
    ) { }

    create(user: UserDTO) {
        return this.usersService.create(user);
    }

    login(credentials: LoginDTO) {
    }
}