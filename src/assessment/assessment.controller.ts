import { Body, Controller, Delete, Get, Param, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { AssessmentService } from "./assessment.service";
import { AssessmentInputDTO } from "./dto/assessment_input.dto";
import { AuthGuard } from "src/guards/auth.guard";
import { AccessGuard } from "src/guards/access.guard";
import { AdminGuard } from "src/guards/admin.guard";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiUnauthorizedResponse } from "@nestjs/swagger";

@Controller('assessment')
export class AssessmentController {
    constructor(
        private readonly assessmentService: AssessmentService
    ) { }

    @UseGuards(AuthGuard, AccessGuard)
    @UsePipes(ValidationPipe)
    @Post(':user_id')
    @ApiCreatedResponse({ description: 'Assessment results' })
    @ApiBadRequestResponse({ description: 'Validation error description' })
    @ApiUnauthorizedResponse({ description: 'Authorization failed' })
    @ApiForbiddenResponse({ description: 'Access rights mismatch' })
    @ApiNotFoundResponse({ description: 'No such user' })
    postLog(@Param('user_id') user_id: number, @Body() body: AssessmentInputDTO) {
        return this.assessmentService.addLog(user_id, body);
    }

    @UseGuards(AuthGuard, AccessGuard)
    @Get(':user_id')
    @ApiOkResponse({ description: 'Last assessment result for user with user_id' })
    @ApiUnauthorizedResponse({ description: 'Authorization failed' })
    @ApiForbiddenResponse({ description: 'Access rights mismatch' })
    @ApiNotFoundResponse({ description: 'No such user' })
    getLastLog(@Param('user_id') user_id: number) {
        return this.assessmentService.readByUserId(user_id);
    }

    @UseGuards(AuthGuard, AccessGuard)
    @Get('trend/:user_id')
    @ApiOkResponse({ description: 'Trend comparison for user with user_id' })
    @ApiUnauthorizedResponse({ description: 'Authorization failed' })
    @ApiForbiddenResponse({ description: 'Access rights mismatch' })
    @ApiNotFoundResponse({ description: 'No such user' })
    getTrendLog(@Param('user_id') user_id: number) {
        return this.assessmentService.readLastTwo(user_id);
    }

    @UseGuards(AuthGuard, AccessGuard)
    @Get('overall/:user_id')
    @ApiOkResponse({ description: 'Overall progrssion for user with user_id' })
    @ApiUnauthorizedResponse({ description: 'Authorization failed' })
    @ApiForbiddenResponse({ description: 'Access rights mismatch' })
    @ApiNotFoundResponse({ description: 'No such user' })
    getOverallLog(@Param('user_id') user_id: number) {
        return this.assessmentService.readOverall(user_id);
    }

    @UseGuards(AuthGuard, AdminGuard)
    @Delete(':assessment_id')
    @ApiOkResponse({ description: 'Deleted assessment logs count' })
    @ApiUnauthorizedResponse({ description: 'Authorization failed' })
    @ApiForbiddenResponse({ description: 'Access rights mismatch' })
    async deleteAssessment(@Param('assessment_id') assessment_id: number) {
        const result = await this.assessmentService.delete(assessment_id);
        return { deleted: result.affected }
    }
}