import { Body, Controller, Get, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ExercisesService } from "./exercises.service";
import { AuthGuard } from "src/guards/auth.guard";
import { ExerciseDTO } from "./dto/exercise.dto";
import { ExerciseMapper } from "./mappers/exercises.mapper";

@Controller('exercises')
export class ExercisesController {
    constructor(
        private readonly exercisesService: ExercisesService,
        private readonly exerciseMapper: ExerciseMapper
    ) { }

    @UseGuards(AuthGuard)
    @Get()
    async getAll() {
        const exercises = await this.exercisesService.readAll();
        return exercises.map(ex => this.exerciseMapper.toResponse(ex));
    }

    @UseGuards(AuthGuard)
    @Get('/muscles')
    getMuscles() {
        return this.exercisesService.readMuscles();
    }

    @UsePipes(ValidationPipe)
    @Post()
    async postExercise(@Body() body: ExerciseDTO) {
        const ex = await this.exercisesService.create(body);
        return this.exerciseMapper.toResponse(ex);
    }
}