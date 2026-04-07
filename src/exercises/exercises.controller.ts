import { Controller, Get, UseGuards } from "@nestjs/common";
import { ExercisesService } from "./exercises.service";
import { AuthGuard } from "src/guards/auth.guard";

@Controller('exercises')
export class ExercisesController {
    constructor(private readonly exercisesService: ExercisesService) { }

    @UseGuards(AuthGuard)
    @Get()
    getAll() {
        return this.exercisesService.readAll();
    }

    @UseGuards(AuthGuard)
    @Get('/muscles')
    getMuscles() {
        return this.exercisesService.readMuscles();
    }
}