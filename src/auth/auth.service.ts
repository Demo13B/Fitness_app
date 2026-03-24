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

        const hashed = await this.hasherService.getHash(refresh_token);
        await this.redisService.set(`refresh:${user.id}`, hashed, 7 * 24 * 60 * 60);

        return { access_token, refresh_token };
    }

    async refresh(refresh_token: string) {
        const payload = this.jwtService.verify(refresh_token);
        const redisState = await this.redisService.get(`refresh:${payload.user_id}`);

        if (!redisState)
            throw new HttpException('Refresh token expired', HttpStatus.UNAUTHORIZED);

        const confirm = await this.hasherService.compareHash(refresh_token, redisState);

        if (!confirm)
            throw new HttpException('Refresh token is invalid', HttpStatus.UNAUTHORIZED);

        const new_payload = {
            user_id: payload.user_id,
            role: payload.role
        }

        const new_access_token = this.jwtService.sign(new_payload, { expiresIn: '15m' });
        const new_refresh_token = this.jwtService.sign(new_payload, { expiresIn: '7d' });

        const hashed = await this.hasherService.getHash(new_refresh_token);
        await this.redisService.set(`refresh:${payload.user_id}`, hashed, 7 * 24 * 60 * 60);

        return { new_access_token, new_refresh_token };
    }

    logout(access_token: string) {
        const payload = this.jwtService.verify(access_token);
        return this.redisService.delete(`refresh:${payload.user_id}`);
    }
}