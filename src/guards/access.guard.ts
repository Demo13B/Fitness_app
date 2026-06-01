import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class AccessGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        if (request.user.role === 'admin' || request.user.user_id === Number(request.params.user_id))
            return true;

        throw new HttpException('Access rights mismatch', HttpStatus.FORBIDDEN)
    }
}