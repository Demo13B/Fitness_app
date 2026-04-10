import { Module } from "@nestjs/common";
import { AssessmentController } from "./assessment.controller";
import { AssessmentService } from "./assessment.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AssessmentLog } from "./entity/assessment_log.entity";
import { User } from "src/users/entities/users.entity";
import { CooperReference } from "./entity/cooper_reference.entity";

@Module({
    imports: [TypeOrmModule.forFeature([AssessmentLog, User, CooperReference])],
    controllers: [AssessmentController],
    providers: [AssessmentService]
})
export class AssessmentModule { }