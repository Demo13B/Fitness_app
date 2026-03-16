import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./users.entity";

@Entity({ name: 'profiles' })
export class Profile {
    @PrimaryGeneratedColumn('identity')
    id!: number

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