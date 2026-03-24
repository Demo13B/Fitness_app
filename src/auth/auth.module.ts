import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UsersModule } from "src/users/users.module";
import { RedisModule } from "src/redis/redis.module";
import { JwtModule } from "@nestjs/jwt";
import { HasherModule } from "src/hasher/hasher.module";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "./guards/auth.guard";
import { RefreshGuard } from "./guards/refresh.guard";

@Module({
    imports: [
        UsersModule,
        RedisModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get('JWT_SECRET', 'secret')
            })
        }),
        HasherModule
    ],
    controllers: [AuthController],
    providers: [AuthService, AuthGuard, RefreshGuard],
    exports: [AuthGuard, RefreshGuard]
})
export class AuthModule { }