import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                host: config.get<string>('DB_HOST', 'localhost'),
                port: config.get<number>('DB_PORT', 5432),
                username: config.get<string>('DB_USER', 'admin'),
                password: config.get<string>('DB_PASSWORD', 'password'),
                database: config.get<string>('DB_NAME', 'db'),
                autoLoadEntities: true,
                synchronize: false
            })
        })
    ]
})
export class DatabaseModule { }