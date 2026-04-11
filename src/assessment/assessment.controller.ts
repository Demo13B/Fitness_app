import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from "@nestjs/common";
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

    @Get(':user_id')
    getLastLog(@Param('user_id') user_id: number) {
        return this.assessmentService.readByUserId(user_id);
    }

    @Get('trend/:user_id')
    getTrendLog(@Param('user_id') user_id: number) {
        return this.assessmentService.readLastTwo(user_id);
    }

    @Get('overall/:user_id')
    getOverallLog(@Param('user_id') user_id: number) {
        return this.assessmentService.readOverall(user_id);
    }
}