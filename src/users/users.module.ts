import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Profile, User } from "./users.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { HasherService } from "src/hasher/hasher.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Profile]),
    ],
    controllers: [UsersController],
    providers: [UsersService, HasherService]
})
export class UsersModule { }