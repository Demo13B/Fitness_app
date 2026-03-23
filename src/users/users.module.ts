import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/users.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { Profile } from "./entities/profiles.entity";
import { HasherModule } from "src/hasher/hasher.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Profile]),
        HasherModule
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService]
})
export class UsersModule { }