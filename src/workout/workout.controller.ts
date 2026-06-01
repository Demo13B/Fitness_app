import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { WorkoutService } from "./workout.service";
import { WorkoutInputDTO } from "./dto/workout.dto";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiQuery, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { AuthGuard } from "src/guards/auth.guard";
import { AccessGuard } from "src/guards/access.guard";
import { AdminGuard } from "src/guards/admin.guard";

@Controller('workout')
export class WorkoutController {
    constructor(
        private readonly workoutService: WorkoutService
    ) { }

    @UseGuards(AuthGuard, AccessGuard)
    @Get(':user_id')
    @ApiOkResponse({ description: 'List of workout in descending order by date' })
    @ApiUnauthorizedResponse({ description: 'Authorization failed' })
    @ApiForbiddenResponse({ description: 'Access rights mismatch' })
    getWorkouts(@Param('user_id') user_id: number) {
        return this.workoutService.readWorkouts(user_id);
    }

    @UseGuards(AuthGuard, AccessGuard)
    @UsePipes(ValidationPipe)
    @Post(':user_id')
    @ApiCreatedResponse({ description: 'Added workout data' })
    @ApiBadRequestResponse({ description: 'Validation errors' })
    @ApiUnauthorizedResponse({ description: 'Authorization failed' })
    @ApiForbiddenResponse({ description: 'Access rights mismatch' })
    @ApiNotFoundResponse({ description: 'User not found' })
    postWorkout(@Param('user_id') user_id: number, @Body() body: WorkoutInputDTO) {
        return this.workoutService.addWorkout(user_id, body);
    }

    @UseGuards(AuthGuard, AccessGuard)
    @Get('balance/:user_id')
    @ApiQuery({ name: 'date', required: false })
    @ApiOkResponse({ description: 'Analytics on muscle group balance' })
    @ApiUnauthorizedResponse({ description: 'Authorization failed' })
    @ApiForbiddenResponse({ description: 'Access rights mismatch' })
    @ApiNotFoundResponse({ description: 'User or workout not found' })
    getWorkoutBalance(@Param('user_id') user_id: number, @Query('date') date: Date) {
        return this.workoutService.calculateBalance(user_id, date);
    }

    @UseGuards(AuthGuard, AdminGuard)
    @Delete(':workout_id')
    @ApiOkResponse({ description: 'Operation result' })
    @ApiUnauthorizedResponse({ description: 'Authorization failed' })
    @ApiForbiddenResponse({ description: 'Access rights mismatch' })
    async deleteWorkout(@Param('workout_id') workout_id: number) {
        const res = await this.workoutService.delete(workout_id);
        return { deleted: res.affected };
    }
}