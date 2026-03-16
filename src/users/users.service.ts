import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./users.entity";
import { Repository } from "typeorm";
import { UserDTO } from "./users.dto";
import { HasherService } from "src/hasher/hasher.service";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private hasherService: HasherService
    ) { }

    readAll() {
        return this.userRepository.find({ relations: ['profile'] });
    }

    async create(user: UserDTO) {
        const existing = await this.userRepository.findOneBy({ username: user.username });
        if (existing) {
            throw new BadRequestException('Username already taken');
        }

        const hash = await this.hasherService.getHash(user.password);
        const newUser = this.userRepository.create({
            username: user.username,
            password_hash: hash,
            registered_at: new Date(),
            email: user.email
        });
        return this.userRepository.save(newUser);
    }

    delete(user_id: number) {
        return this.userRepository.delete({ id: user_id })
    }
}