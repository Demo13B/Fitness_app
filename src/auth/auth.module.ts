import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UsersModule } from "src/users/users.module";
import { RedisModule } from "src/redis/redis.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [UsersModule, RedisModule, JwtModule],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule { }