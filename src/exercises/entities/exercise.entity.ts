import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ExerciseMuscle } from "./exercise_muscle.entity";

@Entity({ name: 'exercises' })
export class Exercise {
    @PrimaryGeneratedColumn('identity')
    id!: number;

    @Column({ nullable: false, unique: true })
    name!: string;

    @Column({ nullable: false })
    description!: string;

    @OneToMany(() => ExerciseMuscle, em => em.exercise, {
        cascade: true
    })
    muscle_groups!: ExerciseMuscle[];
}