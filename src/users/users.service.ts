import { BadRequestException, HttpException, Injectable, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/users.entity";
import { Repository } from "typeorm";
import { UserDTO, UserPatchDTO, UserPatchSelfDTO } from "./dto/users.dto";
import { HasherService } from "src/hasher/hasher.service";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private readonly hasherService: HasherService
    ) { }

    readAll() {
        return this.userRepository.find();
    }

    readById(user_id: number) {
        const user = this.userRepository.findOneBy({ id: user_id });
        return user;
    }

    readByUsername(username: string) {
        const user = this.userRepository.findOneBy({ username: username });
        return user;
    }

    async create(user: UserDTO) {
        const existing = await this.userRepository.findOneBy({ username: user.username });
        if (existing) {
            throw new BadRequestException('Username already taken');
        }

        const hash = await this.hasherService.getHash(user.password);
        const newUser = this.userRepository.create({
            password_hash: hash,
            registered_at: new Date(),
            ...user
        });
        return this.userRepository.save(newUser);
    }

    async update(user_id: number, new_data: UserPatchDTO) {
        const user = await this.userRepository.findOneBy({ id: user_id });
        if (!user)
            throw new HttpException('No such user exists', HttpStatus.NOT_FOUND);

        if (new_data.email)
            user.email = new_data.email;
        if (new_data.password)
            user.password_hash = await this.hasherService.getHash(new_data.password);
        if (new_data.gender)
            user.gender = new_data.gender
        if (new_data.height)
            user.height = new_data.height
        if (new_data.weight)
            user.weight = new_data.weight
        if (new_data.medical_record)
            user.medical_record = new_data.medical_record
        if (new_data.role)
            user.role = new_data.role;

        return this.userRepository.save(user);
    }

    async updateSelf(user_id: number, new_data: UserPatchSelfDTO) {
        const user = await this.userRepository.findOneBy({ id: user_id });
        if (!user)
            throw new HttpException('No such user exists', HttpStatus.NOT_FOUND);

        if (new_data.email)
            user.email = new_data.email;
        if (new_data.password)
            user.password_hash = await this.hasherService.getHash(new_data.password);
        if (new_data.gender)
            user.gender = new_data.gender
        if (new_data.height)
            user.height = new_data.height
        if (new_data.weight)
            user.weight = new_data.weight
        if (new_data.medical_record)
            user.medical_record = new_data.medical_record

        return this.userRepository.save(user);
    }

    delete(user_id: number) {
        const result = this.userRepository.delete({ id: user_id });
        return result;
    }
}