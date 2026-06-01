import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Exercise } from "./exercise.entity";
import { MuscleGroup } from "./muscle_group.entity";

@Entity({ name: 'exercise_muscle' })
export class ExerciseMuscle {
    @PrimaryColumn()
    exercise_id!: number;

    @PrimaryColumn()
    muscle_id!: number;

    @ManyToOne(() => Exercise, ex => ex.muscle_groups, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'exercise_id' })
    exercise!: Exercise;

    @ManyToOne(() => MuscleGroup, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'muscle_id' })
    muscle!: MuscleGroup;

    @Column({ nullable: false, type: 'float' })
    coefficient!: number;
}