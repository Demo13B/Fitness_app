import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService
    ) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();

        const access_token = req.cookies.access_token;
        if (!access_token)
            throw new HttpException('No token provided', HttpStatus.UNAUTHORIZED);

        try {
            const payload = this.jwtService.verify(access_token);
            req.user = payload;
            return true;
        } catch {
            throw new HttpException('Token is invalid. Please use refresh.', HttpStatus.UNAUTHORIZED);
        }
    }
}