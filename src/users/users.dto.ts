import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator";

export class UserDTO {
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
}
