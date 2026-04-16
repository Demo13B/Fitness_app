import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Workout } from "./entities/workout.entity";
import { Repository } from "typeorm";
import { WorkoutInputDTO } from "./dto/workout.dto";
import { User } from "src/users/entities/users.entity";
import { WorkoutExercise } from "./entities/workout_exercise.entity";
import { Exercise } from "src/exercises/entities/exercise.entity";

@Injectable()
export class WorkoutService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Exercise) private exerciseRepository: Repository<Exercise>,
        @InjectRepository(Workout) private workoutRepository: Repository<Workout>,
        @InjectRepository(WorkoutExercise) private workoutExRepository: Repository<WorkoutExercise>
    ) { }

    readWorkouts(user_id: number) {
        return this.workoutRepository.find({
            where: { user: { id: user_id } },
            relations: {
                workout_exercises: {
                    exercise: true
                }
            },
            order: { date: 'DESC' }
        });
    }

    async addWorkout(user_id: number, workout_data: WorkoutInputDTO) {
        const user = await this.userRepository.findOneBy({ id: user_id });
        if (!user)
            throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);

        if (workout_data.exercises.length === 0)
            throw new HttpException('No exercises provided', HttpStatus.BAD_REQUEST);

        const array: WorkoutExercise[] = [];

        for (const exercise of workout_data.exercises) {
            const new_exercise = await this.exerciseRepository.findOneBy({ id: exercise.exercise_id });
            if (!new_exercise)
                throw new HttpException('Exercise does not exist', HttpStatus.BAD_REQUEST);

            const wex = this.workoutExRepository.create({
                weight: exercise.weight,
                reps: exercise.reps,
                sets: exercise.sets,
                exercise: new_exercise
            });

            array.push(wex);
        }

        const workout = this.workoutRepository.create({
            user,
            workout_exercises: array,
            date: new Date()
        });

        return this, this.workoutRepository.save(workout);
    }
}