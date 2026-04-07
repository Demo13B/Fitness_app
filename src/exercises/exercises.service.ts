import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Exercise } from "./entities/exercise.entity";
import { Repository } from "typeorm";
import { MuscleGroup } from "./entities/muscle_group.entity";
import { ExerciseDTO } from "./dto/exercise.dto";
import { ExerciseMuscle } from "./entities/exercise_muscle.entity";


@Injectable()
export class ExercisesService {
    constructor(
        @InjectRepository(Exercise) private exerciseRepository: Repository<Exercise>,
        @InjectRepository(MuscleGroup) private muscleRepository: Repository<MuscleGroup>,
        @InjectRepository(ExerciseMuscle) private exerciseMuscleRepository: Repository<ExerciseMuscle>
    ) { }

    readAll() {
        return this.exerciseRepository.find({
            relations: {
                muscle_groups: {
                    muscle: true
                }
            },
            order: {
                id: 'ASC'
            }
        });
    }

    readMuscles() {
        return this.muscleRepository.find({
            order: {
                id: 'ASC'
            }
        });
    }

    async create(exercise: ExerciseDTO) {
        const newExercise = this.exerciseRepository.create({
            name: exercise.name,
            description: exercise.description,
            muscle_groups: []
        });

        for (const muscleGroup of exercise.muscleGroups) {
            const muscle = await this.muscleRepository.findOneBy({ id: muscleGroup.muscle_id });
            if (!muscle)
                throw new HttpException('Muscle group does not exist', HttpStatus.BAD_REQUEST);

            const newRecord = this.exerciseMuscleRepository.create({
                muscle: muscle,
                coefficient: muscleGroup.coefficient
            })
            newExercise.muscle_groups.push(newRecord);
        }

        return this.exerciseRepository.save(newExercise);
    }

    async update(exercise_id: number, new_data: ExerciseDTO) {
        const exercise = await this.exerciseRepository.findOne({
            where: { id: exercise_id },
            relations: {
                muscle_groups: {
                    muscle: true
                }
            }
        })

        if (!exercise)
            throw new HttpException('Exercise not found', HttpStatus.NOT_FOUND);

        exercise.name = new_data.name;
        exercise.description = new_data.description;
        this.exerciseMuscleRepository.delete({ exercise_id: exercise_id });
        exercise.muscle_groups = [];

        for (const muscleGroup of new_data.muscleGroups) {
            const muscle = await this.muscleRepository.findOneBy({ id: muscleGroup.muscle_id });
            if (!muscle)
                throw new HttpException('Muscle group does not exist', HttpStatus.BAD_REQUEST);

            const newRecord = this.exerciseMuscleRepository.create({
                muscle: muscle,
                coefficient: muscleGroup.coefficient
            })
            exercise.muscle_groups.push(newRecord);
        }

        return this.exerciseRepository.save(exercise);
    }

    async delete(exercise_id: number) {
        return this.exerciseRepository.delete({ id: exercise_id });
    }
}