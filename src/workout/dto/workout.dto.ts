import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNumber, Max, Min, ValidateNested } from "class-validator";

export class WorkoutExerciseDTO {
    @ApiProperty({
        default: 1
    })
    @IsNumber()
    exercise_id!: number;

    @ApiProperty({
        default: 20
    })
    @IsNumber()
    @Min(0)
    @Max(1000)
    weight!: number;

    @ApiProperty({
        default: 3
    })
    @IsNumber()
    @Min(0)
    @Max(10)
    sets!: number;

    @ApiProperty({
        default: 10
    })
    @IsNumber()
    @Min(0)
    @Max(100)
    reps!: number;
}

export class WorkoutInputDTO {
    @ApiProperty({
        type: WorkoutExerciseDTO,
        isArray: true
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => WorkoutExerciseDTO)
    exercises!: WorkoutExerciseDTO[];
}