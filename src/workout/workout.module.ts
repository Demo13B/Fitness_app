import { Module } from "@nestjs/common";
import { WorkoutController } from "./workout.controller";
import { WorkoutService } from "./workout.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Workout } from "./entities/workout.entity";
import { WorkoutExercise } from "./entities/workout_exercise.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Workout, WorkoutExercise])],
    controllers: [WorkoutController],
    providers: [WorkoutService]
})
export class WorkoutModule { }