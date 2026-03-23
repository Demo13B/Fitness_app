import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UserDTO } from "src/users/users.dto";
import { UsersService } from "src/users/users.service";
import { LoginDTO } from "./auth.dto";
import { RedisService } from "src/redis/redis.service";
import { JwtService } from "@nestjs/jwt";
import { HasherService } from "src/hasher/hasher.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly redisService: RedisService,
        private readonly jwtService: JwtService,
        private readonly hasherService: HasherService
    ) { }

    create(user: UserDTO) {
        return this.usersService.create(user);
    }

    async login(credentials: LoginDTO) {
        const user = await this.usersService.readByUsername(credentials.username);
        if (!user)
            throw new HttpException('No such user', HttpStatus.UNAUTHORIZED);

        const success = await this.hasherService.compareHash(credentials.password, user.password_hash);
        if (!success)
            throw new HttpException('Wrong password', HttpStatus.UNAUTHORIZED);

        const payload = {
            user_id: user.id,
            role: user.role
        }

        const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
        const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

        await this.redisService.set(`refresh:${user.id}`, refresh_token, 7 * 24 * 60 * 60);

        return { access_token, refresh_token };
    }
}