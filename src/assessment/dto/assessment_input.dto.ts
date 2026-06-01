import { ApiProperty } from "@nestjs/swagger";
import { isNumber, IsNumber, IsOptional, Max, Min } from "class-validator";

export class AssessmentInputDTO {
    @ApiProperty({
        default: 175
    })
    @IsNumber()
    @Min(100)
    @Max(300)
    @IsOptional()
    height?: number;

    @ApiProperty({
        default: 75
    })
    @IsNumber()
    @Min(40)
    @Max(300)
    @IsOptional()
    weight?: number;

    @ApiProperty({
        default: 2000
    })
    @IsNumber()
    @Min(500)
    @Max(4000)
    cooper_distance!: number;

    @ApiProperty({
        default: 50
    })
    @IsNumber()
    @Min(10)
    @Max(500)
    bench_weight!: number;

    @ApiProperty({
        default: 6
    })
    @IsNumber()
    @Min(1)
    @Max(12)
    bench_reps!: number;

    @ApiProperty({
        default: 50
    })
    @IsNumber()
    @Min(10)
    @Max(500)
    deadlift_weight!: number;

    @ApiProperty({
        default: 6
    })
    @IsNumber()
    @Min(1)
    @Max(12)
    deadlift_reps!: number;

    @ApiProperty({
        default: 50
    })
    @IsNumber()
    @Min(10)
    @Max(500)
    squat_weight!: number;

    @ApiProperty({
        default: 6
    })
    @IsNumber()
    @Min(1)
    @Max(12)
    squat_reps!: number;
}