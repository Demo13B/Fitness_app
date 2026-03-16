import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/users.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { HasherService } from "src/hasher/hasher.service";
import { Profile } from "./entities/profiles.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Profile]),
    ],
    controllers: [UsersController],
    providers: [UsersService, HasherService]
})
export class UsersModule { }