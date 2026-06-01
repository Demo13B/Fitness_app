import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();

        if (!req.user.role || req.user.role !== 'admin')
            throw new HttpException('This action is only available for admin', HttpStatus.FORBIDDEN);

        return true;
    }
}