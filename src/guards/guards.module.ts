import { Module } from "@nestjs/common";
import { JwtSharedModule } from "src/jwt/jwt.module";
import { AuthGuard } from "./auth.guard";
import { RefreshGuard } from "./refresh.guard";

@Module({
    imports: [JwtSharedModule],
    providers: [AuthGuard, RefreshGuard],
    exports: [JwtSharedModule, AuthGuard, RefreshGuard]
})
export class GuardsModule { }