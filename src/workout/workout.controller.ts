import { Body, Controller, Delete, Get, Param, Post, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { WorkoutService } from "./workout.service";
import { WorkoutInputDTO } from "./dto/workout.dto";
import { ApiQuery } from "@nestjs/swagger";

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

    @Get('balance/:user_id')
    @ApiQuery({ name: 'date', required: false })
    getWorkoutBalance(@Param('user_id') user_id: number, @Query('date') date: Date) {
        return this.workoutService.calculateLastBalance(user_id, date);
    }

    @Delete(':workout_id')
    async deleteWorkout(@Param('workout_id') workout_id: number) {
        const res = await this.workoutService.delete(workout_id);
        return { deleted: res.affected };
    }
}