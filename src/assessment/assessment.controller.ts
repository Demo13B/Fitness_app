import { Body, Controller, Param, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { AssessmentService } from "./assessment.service";
import { AssessmentInputDTO } from "./dto/assessment_input.dto";

@Controller('assessment')
export class AssessmentController {
    constructor(
        private readonly assessmentService: AssessmentService
    ) { }

    @UsePipes(ValidationPipe)
    @Post(':user_id')
    postLog(@Param('user_id') user_id: number, @Body() body: AssessmentInputDTO) {
        return this.assessmentService.addLog(user_id, body);
    }
}