import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Exercise } from "./entities/exercise.entity";
import { MuscleGroup } from "./entities/muscle_group.entity";
import { ExerciseMuscle } from "./entities/exercise_muscle.entity";
import { ExercisesController } from "./exercises.controller";
import { ExercisesService } from "./exercises.service";
import { GuardsModule } from "src/guards/guards.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Exercise, MuscleGroup, ExerciseMuscle]),
        GuardsModule
    ],
    controllers: [ExercisesController],
    providers: [ExercisesService]
})
export class ExercisesModule { }