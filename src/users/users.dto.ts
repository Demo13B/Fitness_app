import { IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator";

export class UserDTO {
    @IsString()
    @MinLength(5)
    @MaxLength(20)
    username!: string;

    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0
    })
    password!: string;
}