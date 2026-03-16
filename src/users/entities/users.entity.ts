import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profiles.entity";

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn('identity')
    id!: number;

    @Column({ nullable: false, unique: true })
    username!: string;

    @Column({ nullable: false })
    password_hash!: string;

    @Column({ nullable: false })
    email!: string;

    @Column({ type: 'timestamp' })
    registered_at!: Date;

    @OneToOne(() => Profile, { cascade: true })
    @JoinColumn({ name: 'profile_id' })
    profile!: Profile | null;
}