import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn('identity')
    id!: number;

    @Column({ nullable: false, unique: true })
    username!: string;

    @Column({ nullable: false })
    role!: string;

    @Column({ nullable: false })
    password_hash!: string;

    @Column({ nullable: false })
    email!: string;

    @Column({ type: 'timestamp' })
    registered_at!: Date;

    @Column({ nullable: false })
    gender!: string;

    @Column({ nullable: false })
    height!: number;

    @Column({ nullable: false })
    weight!: number;

    @Column({ type: 'timestamp', nullable: false })
    birth_date!: Date

    @Column({ type: 'text', nullable: false })
    medical_record!: string
}