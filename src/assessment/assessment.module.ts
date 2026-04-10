import { Module } from "@nestjs/common";
import { AssessmentController } from "./assessment.controller";
import { AssessmentService } from "./assessment.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AssessmentLog } from "./entity/assessment_log.entity";

@Module({
    imports: [TypeOrmModule.forFeature([AssessmentLog])],
    controllers: [AssessmentController],
    providers: [AssessmentService]
})
export class AssessmentModule { }