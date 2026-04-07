import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'muscle_groups' })
export class MuscleGroup {
    @PrimaryGeneratedColumn('identity')
    id!: number;

    @Column({ nullable: false, unique: true })
    name!: string;
}