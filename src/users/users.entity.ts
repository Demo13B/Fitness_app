import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: false, unique: true })
    username!: string;

    @Column({ nullable: false })
    password_hash!: string;

    @Column({ type: 'timestamp' })
    registered_at!: Date;

    @OneToOne(() => Profile)
    @JoinColumn()
    profile!: Profile;
}

@Entity({ name: 'profiles' })
export class Profile {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ nullable: false })
    gender!: string;

    @Column({ nullable: false })
    height!: string;

    @Column({ nullable: false })
    weight!: string;

    @Column({ type: 'timestamp', nullable: false })
    birth_date!: Date

    @Column({ type: 'text', nullable: false })
    medical_record!: string
}