import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEmail, IsIn, IsNumber, IsOptional, IsString, IsStrongPassword, Max, MaxLength, Min, MinLength } from "class-validator";

export class UserDTO {
    @ApiProperty({
        default: 'test_user'
    })
    @IsString()
    @MinLength(5)
    @MaxLength(20)
    username!: string;

    @ApiProperty({
        default: 'admin'
    })
    @IsIn(['user', 'admin'])
    role!: string;

    @ApiProperty({
        default: 'Password1'
    })
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0
    })
    password!: string;

    @ApiProperty({
        default: 'example@email.com'
    })
    @IsEmail()
    email!: string;

    @ApiProperty({
        default: 'male'
    })
    @IsIn(['male', 'female'])
    gender!: string

    @ApiProperty({
        default: 175
    })
    @IsNumber()
    @Min(100)
    @Max(300)
    height!: number;

    @ApiProperty({
        default: 75
    })
    @IsNumber()
    @Min(40)
    @Max(300)
    weight!: number;

    @ApiProperty({
        default: new Date
    })
    @IsDateString()
    birth_date!: Date

    @ApiProperty({
        default: 'Medical data'
    })
    @IsString()
    medical_record!: string;
}

export class UserPatchSelfDTO {
    @ApiProperty({
        default: 'Password1'
    })
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0
    })
    @IsOptional()
    password?: string;

    @ApiProperty({
        default: 'example@email.com'
    })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({
        default: 'male'
    })
    @IsIn(['male', 'female'])
    @IsOptional()
    gender?: string

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
        default: 'Medical data'
    })
    @IsString()
    @IsOptional()
    medical_record?: string;
}

export class UserPatchDTO extends UserPatchSelfDTO {
    @ApiProperty({
        default: 'admin'
    })
    @IsIn(['user', 'admin'])
    @IsOptional()
    role?: string;
}