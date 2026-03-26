import { BadRequestException, HttpException, Injectable, NotFoundException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/users.entity";
import { Repository } from "typeorm";
import { ProfileDTO, UserDTO, UserPatchDTO, UserPatchSelfDTO } from "./users.dto";
import { HasherService } from "src/hasher/hasher.service";
import { Profile } from "./entities/profiles.entity";
import { DeleteResult } from "typeorm/browser";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Profile) private profileRepository: Repository<Profile>,
        private readonly hasherService: HasherService
    ) { }

    readAll() {
        return this.userRepository.find({ relations: ['profile'] });
    }

    readById(user_id: number) {
        const user = this.userRepository.findOne({
            where: { id: user_id },
            relations: {
                profile: true
            }
        });
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
            username: user.username,
            role: user.role,
            password_hash: hash,
            registered_at: new Date(),
            email: user.email
        });
        return this.userRepository.save(newUser);
    }

    async createProfile(user_id: number, profile: ProfileDTO) {
        const user = await this.userRepository.findOne({
            where: { id: user_id },
            relations: ['profile']
        });
        if (!user) {
            throw new NotFoundException('No such user exists');
        }
        if (user.profile) {
            throw new BadRequestException('User already has a profile');
        }

        const newProfile = this.profileRepository.create(profile);
        user.profile = newProfile;

        return this.userRepository.save(user);
    }

    async update(user_id: number, new_data: UserPatchDTO) {
        const user = await this.userRepository.findOneBy({ id: user_id });
        if (!user)
            throw new HttpException('No such user exists', HttpStatus.NOT_FOUND);

        user.email = new_data.email;
        user.password_hash = await this.hasherService.getHash(new_data.password);
        user.role = new_data.role;

        return this.userRepository.save(user);
    }

    async updateSelf(user_id: number, new_data: UserPatchSelfDTO) {
        const user = await this.userRepository.findOneBy({ id: user_id });
        if (!user)
            throw new HttpException('No such user exists', HttpStatus.NOT_FOUND);

        user.email = new_data.email;
        user.password_hash = await this.hasherService.getHash(new_data.password);

        return this.userRepository.save(user);
    }

    async updateProfile(user_id: number, new_data: ProfileDTO) {
        const user = await this.userRepository.findOne({
            where: { id: user_id },
            relations: {
                profile: true
            }
        })

        if (!user)
            throw new HttpException('No such user exists', HttpStatus.NOT_FOUND);

        if (!user.profile) {
            user.profile = this.profileRepository.create(new_data);
        } else {
            const id = user.profile.id;
            user.profile = { id, ...new_data };
        }

        return this.userRepository.save(user);
    }

    async delete(user_id: number) {
        const user = await this.userRepository.findOne({
            where: { id: user_id },
            relations: {
                profile: true
            }
        })

        if (!user) {
            return { affected: 0 }
        }

        let result: Promise<DeleteResult>;
        if (user.profile) {
            const profile_id = user.profile.id;
            user.profile = null;
            result = this.userRepository.delete({ id: user_id });
            await this.profileRepository.delete({ id: profile_id });
        } else {
            result = this.userRepository.delete({ id: user_id });
        }

        return result;
    }
}