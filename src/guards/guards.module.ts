import { Module } from "@nestjs/common";
import { JwtSharedModule } from "src/jwt/jwt.module";
import { AuthGuard } from "./auth.guard";
import { RefreshGuard } from "./refresh.guard";
import { AdminGuard } from "./admin.guard";

@Module({
    imports: [JwtSharedModule],
    providers: [AuthGuard, RefreshGuard, AdminGuard],
    exports: [JwtSharedModule, AuthGuard, RefreshGuard, AdminGuard]
})
export class GuardsModule { }