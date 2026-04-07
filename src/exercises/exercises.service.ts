import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Exercise } from "./entities/exercise.entity";
import { Repository } from "typeorm";
import { MuscleGroup } from "./entities/muscle_group.entity";


@Injectable()
export class ExercisesService {
    constructor(
        @InjectRepository(Exercise) private exerciseRepository: Repository<Exercise>,
        @InjectRepository(MuscleGroup) private muscleRepository: Repository<MuscleGroup>
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
}