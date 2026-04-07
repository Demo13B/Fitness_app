import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsStrongPassword, MaxLength, MinLength, IsIn, IsNumber, IsDateString, Min, Max } from "class-validator";

export class LoginDTO {
    @ApiProperty({
        default: 'test_user'
    })
    @IsString()
    @MinLength(5)
    @MaxLength(20)
    username!: string;

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
}

export class RegisterDTO {
    @ApiProperty({
        default: 'test_user'
    })
    @IsString()
    @MinLength(5)
    @MaxLength(20)
    username!: string;

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