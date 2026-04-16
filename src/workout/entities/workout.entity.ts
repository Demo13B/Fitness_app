import { User } from "src/users/entities/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { WorkoutExercise } from "./workout_exercise.entity";

@Entity({ name: 'workouts' })
export class Workout {
    @PrimaryGeneratedColumn('identity')
    id!: number;

    @Column()
    date!: Date;

    @ManyToOne(() => User, (user) => user.workouts, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @OneToMany(() => WorkoutExercise, (wex) => wex.workout, { cascade: true })
    workout_exercises!: WorkoutExercise[]
}