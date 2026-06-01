import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UsersModule } from "src/users/users.module";
import { RedisModule } from "src/redis/redis.module";
import { HasherModule } from "src/hasher/hasher.module";
import { JwtSharedModule } from "src/jwt/jwt.module";
import { GuardsModule } from "src/guards/guards.module";

@Module({
    imports: [
        UsersModule,
        RedisModule,
        HasherModule,
        JwtSharedModule,
        GuardsModule
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule { }