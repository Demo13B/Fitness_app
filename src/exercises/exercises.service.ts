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
            }
        });
    }

    readMuscles() {
        return this.muscleRepository.find();
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
}