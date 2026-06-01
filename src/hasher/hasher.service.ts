import { Injectable } from "@nestjs/common";
import { genSalt, hash, compare } from "bcrypt";

@Injectable()
export class HasherService {
    async getHash(password: string): Promise<string> {
        const salt = await genSalt();
        const hashed = hash(password, salt);
        return hashed;
    }

    async compareHash(password: string, hashed: string): Promise<boolean> {
        const result = compare(password, hashed);
        return result;
    }
}