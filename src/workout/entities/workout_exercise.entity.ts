import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Workout } from "./workout.entity";
import { Exercise } from "src/exercises/entities/exercise.entity";

@Entity()
export class WorkoutExercise {
    @PrimaryGeneratedColumn('identity')
    id!: number;

    @Column({ type: 'float', nullable: false })
    weight!: number;

    @Column({ nullable: false })
    sets!: number;

    @Column({ nullable: false })
    reps!: number;

    @ManyToOne(() => Workout, (workout) => workout.workout_exercises, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'workout_id' })
    workout!: Workout;

    @ManyToOne(() => Exercise, (ex) => ex.workout_exercises)
    @JoinColumn({ name: 'exercise_id' })
    exercise!: Exercise;
}