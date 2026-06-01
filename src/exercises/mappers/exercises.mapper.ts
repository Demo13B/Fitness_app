import { Injectable } from "@nestjs/common";
import { Exercise } from "../entities/exercise.entity";

@Injectable()
export class ExerciseMapper {
    toResponse(ex: Exercise) {
        return {
            id: ex.id,
            name: ex.name,
            description: ex.description,

            muscle_groups: ex.muscle_groups.map(mg => ({
                muscle: mg.muscle.name,
                coefficient: mg.coefficient
            }))
        }
    }
}