import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class RefreshGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService
    ) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();

        const refresh_token = req.cookies.refresh_token;
        if (!refresh_token)
            throw new HttpException('No refresh token provided', HttpStatus.UNAUTHORIZED);

        try {
            const payload = this.jwtService.verify(refresh_token);
            req.user = payload;
            return true;
        } catch {
            throw new HttpException('Refresh token expired', HttpStatus.UNAUTHORIZED);
        }
    }
}