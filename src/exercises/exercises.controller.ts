import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ExercisesService } from "./exercises.service";
import { AuthGuard } from "src/guards/auth.guard";
import { ExerciseDTO } from "./dto/exercise.dto";
import { ExerciseMapper } from "./mappers/exercises.mapper";
import { AdminGuard } from "src/guards/admin.guard";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiUnauthorizedResponse } from "@nestjs/swagger";

@Controller('exercises')
export class ExercisesController {
    constructor(
        private readonly exercisesService: ExercisesService,
        private readonly exerciseMapper: ExerciseMapper
    ) { }

    @UseGuards(AuthGuard)
    @Get()
    @ApiOkResponse({ description: 'Exercise list' })
    @ApiUnauthorizedResponse({ description: 'Authorization failed' })
    async getAll() {
        const exercises = await this.exercisesService.readAll();
        return exercises.map(ex => this.exerciseMapper.toResponse(ex));
    }

    @UseGuards(AuthGuard)
    @Get('/muscles')
    @ApiOkResponse({ description: 'Muscle groups list' })
    @ApiUnauthorizedResponse({ description: 'Authorization failed' })
    getMuscles() {
        return this.exercisesService.readMuscles();
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    @ApiOkResponse({ description: 'Exercise with requested id' })
    @ApiUnauthorizedResponse({ description: 'Authorization failed' })
    @ApiNotFoundResponse({ description: 'No exercise with such id' })
    async getById(@Param('id') id: number) {
        const ex = await this.exercisesService.readById(id);
        if (!ex)
            throw new HttpException('Exercise not found', HttpStatus.NOT_FOUND);
        return this.exerciseMapper.toResponse(ex);
    }

    @UseGuards(AuthGuard, AdminGuard)
    @UsePipes(ValidationPipe)
    @Post()
    @ApiCreatedResponse({ description: 'Created exercise data' })
    @ApiBadRequestResponse({ description: 'Validation error description' })
    @ApiUnauthorizedResponse({ description: 'Authorization failed' })
    @ApiForbiddenResponse({ description: 'Access rights mismatch' })
    @ApiNotFoundResponse({ description: 'Muscle group id mismatch' })
    async postExercise(@Body() body: ExerciseDTO) {
        const ex = await this.exercisesService.create(body);
        return this.exerciseMapper.toResponse(ex);
    }

    @UseGuards(AuthGuard, AdminGuard)
    @UsePipes(ValidationPipe)
    @Put(':id')
    @ApiOkResponse({ description: 'Updated user info' })
    @ApiBadRequestResponse({ description: 'Validation error description' })
    @ApiUnauthorizedResponse({ description: 'Authorization failed' })
    @ApiForbiddenResponse({ description: 'Access rights mismatch' })
    @ApiNotFoundResponse({ description: 'No such exercise or muscle group id mismatch' })
    async putExercise(@Param('id') exercise_id: number, @Body() body: ExerciseDTO) {
        const ex = await this.exercisesService.update(exercise_id, body);
        return this.exerciseMapper.toResponse(ex);
    }

    @UseGuards(AuthGuard, AdminGuard)
    @Delete(':id')
    @ApiOkResponse({ description: 'Deleted exercises count' })
    @ApiUnauthorizedResponse({ description: 'Authorization failed' })
    @ApiForbiddenResponse({ description: 'Access rights mismatch' })
    async deleteExercise(@Param('id') exercise_id: number) {
        const result = await this.exercisesService.delete(exercise_id);
        return { deleted: result.affected };
    }
}