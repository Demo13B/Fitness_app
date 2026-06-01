import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

@Injectable()
export class RedisService {
    private readonly client: Redis;

    constructor(private readonly config: ConfigService) {
        this.client = new Redis({
            host: config.get('REDIS_HOST', 'localhost'),
            port: config.get<number>('REDIS_PORT', 6379),
            password: config.get('REDIS_PASSWORD', '')
        });

        this.client.on('error', () => { });
        console.log(`Connected to Redis at: ${config.get('REDIS_HOST', 'localhost')}`);
    }

    async set(key: string, value: string, ttl: number) {
        return this.client.set(key, value, 'EX', ttl);
    }

    async get(key: string) {
        const value = await this.client.get(key);
        return value;
    }

    async delete(key: string) {
        return this.client.del(key);
    }
}