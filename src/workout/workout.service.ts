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

    async calculateLastBalance(user_id: number, date_raw: Date) {
        const user = await this.userRepository.findOne({
            where: { id: user_id },
            relations: {
                workouts: {
                    workout_exercises: {
                        exercise: {
                            muscle_groups: {
                                muscle: true
                            }
                        }
                    }
                }
            },
            order: {
                workouts: {
                    date: 'DESC'
                }
            }
        });

        if (!user)
            throw new HttpException('No such user', HttpStatus.NOT_FOUND);

        let workout: Workout;
        const date = new Date(date_raw);
        if (!date_raw) {
            workout = user.workouts[0];
        } else {
            workout = user.workouts.filter((value) => {
                return value.date.getFullYear() === date.getFullYear() &&
                    value.date.getMonth() === date.getMonth() &&
                    value.date.getDate() === date.getDate()
            })[0];
            if (!workout)
                throw new HttpException('No training on that date', HttpStatus.NOT_FOUND);
        }

        const load: Record<string, number> = {};

        for (let exercise of workout.workout_exercises) {
            for (let mg of exercise.exercise.muscle_groups) {
                if (!load[mg.muscle.name])
                    load[mg.muscle.name] = 0;

                load[mg.muscle.name] += exercise.sets * mg.coefficient;
            }
        }

        const total_load = Object.values(load).reduce((acc, value) => acc + value, 0);
        const size = Object.keys(load).length;
        const denom = total_load / size;

        const imb_index = Object.entries(load).map(([muscle, value]) => {
            return {
                muscle: muscle,
                imbalance: value / denom - 1
            };
        });

        return imb_index;
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

    delete(workout_id: number) {
        return this.workoutRepository.delete({ id: workout_id });
    }
}