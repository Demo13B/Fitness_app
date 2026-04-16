import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { WorkoutService } from "./workout.service";
import { WorkoutInputDTO } from "./dto/workout.dto";

@Controller('workout')
export class WorkoutController {
    constructor(
        private readonly workoutService: WorkoutService
    ) { }

    @Get(':user_id')
    getWorkouts(@Param('user_id') user_id: number) {
        return this.workoutService.readWorkouts(user_id);
    }

    @UsePipes(ValidationPipe)
    @Post(':user_id')
    postWorkout(@Param('user_id') user_id: number, @Body() body: WorkoutInputDTO) {
        return this.workoutService.addWorkout(user_id, body);
    }
}