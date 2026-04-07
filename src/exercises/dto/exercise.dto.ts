import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString, Max, MaxLength, Min, MinLength, ValidateNested } from "class-validator";

export class ExerciseMuscleDTO {
    @ApiProperty({
        default: 1
    })
    @IsNumber()
    muscle_id!: number;

    @ApiProperty({
        default: 0.5
    })
    @IsNumber()
    @Min(0)
    @Max(1)
    coefficient!: number;
}

export class ExerciseDTO {
    @ApiProperty({
        default: 'Test Exercise'
    })
    @IsString()
    @MinLength(5)
    @MaxLength(255)
    name!: string;

    @ApiProperty({
        default: 'Exercise description.'
    })
    @IsString()
    @MinLength(5)
    @MaxLength(255)
    description!: string;

    @ApiProperty({
        type: ExerciseMuscleDTO,
        isArray: true
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ExerciseMuscleDTO)
    muscleGroups!: ExerciseMuscleDTO[];
}