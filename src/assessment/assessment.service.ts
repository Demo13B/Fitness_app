import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AssessmentInputDTO } from "./dto/assessment_input.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { AssessmentLog } from "./entity/assessment_log.entity";
import { LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";
import { User } from "src/users/entities/users.entity";
import { CooperReference } from "./entity/cooper_reference.entity";

@Injectable()
export class AssessmentService {
    constructor(
        @InjectRepository(AssessmentLog) private assessmentRepository: Repository<AssessmentLog>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(CooperReference) private cooperRepository: Repository<CooperReference>
    ) { }

    private getAge(birth_date: Date): number {
        const now = new Date();

        let age = now.getFullYear() - birth_date.getFullYear();

        if (
            now.getMonth() > birth_date.getMonth() ||
            (
                now.getMonth() === birth_date.getMonth() &&
                now.getDate() >= birth_date.getDate()
            )
        ) {
            age--;
        }

        return age;
    }

    private calculateBMI(height: number, weight: number): number {
        return weight / (height / 100) ** 2;
    }

    private calculateVO2(d12: number): number {
        return (d12 - 504.9) / 44.73;
    }

    private calculate1RM(weight: number, reps: number): number {
        return weight + (1 + reps / 30);
    }

    private clamp(value: number, min: number, max: number) {
        if (value < min) {
            return min;
        } else if (value > max) {
            return max;
        } else {
            return value;
        }
    }

    private bodyScore(bmi: number, bmi_i: number, bmi_t: number) {
        return 1 - Math.abs(bmi - bmi_i) / bmi_t
    }

    private async cardioScore(vo2: number, gender: string, age: number) {
        const cooper_ref = await this.cooperRepository.findOne({
            where: {
                gender: gender,
                min_age: LessThanOrEqual(age),
                max_age: MoreThanOrEqual(age)
            }
        });

        if (!cooper_ref)
            throw new HttpException('The cooper reference not found', HttpStatus.NOT_FOUND);

        const vo2_max = cooper_ref.vo2_max;
        const vo2_min = cooper_ref.vo2_min;

        return this.clamp((vo2 - vo2_min) / (vo2_max - vo2_min), 0, 1);
    }

    private strengthScore(rm1: number, bodyweight: number, gender: string) {
        const si = rm1 / bodyweight;

        let si_ref = 1;
        if (gender === 'male') {
            si_ref = 1.5;
        } else if (gender === 'female') {
            si_ref = 1.1;
        }

        return this.clamp(si / si_ref, 0, 1);
    }

    async addLog(user_id: number, assessment: AssessmentInputDTO) {
        let user = await this.userRepository.findOneBy({ id: user_id });
        if (!user)
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);

        if (assessment.height)
            user.height = assessment.height;

        if (assessment.weight)
            user.weight = assessment.weight;

        if (assessment.height || assessment.weight)
            await this.userRepository.save(user);

        const bmi = this.calculateBMI(user.height, user.weight);
        const vo2_max = this.calculateVO2(assessment.cooper_distance);
        const bench_1RM = this.calculate1RM(assessment.bench_weight, assessment.bench_reps);
        const deadlift_1RM = this.calculate1RM(assessment.deadlift_weight, assessment.deadlift_reps);
        const squat_1RM = this.calculate1RM(assessment.squat_weight, assessment.squat_reps);
        const rm1 = 1 / 3 * bench_1RM + 1 / 3 * deadlift_1RM + 1 / 3 * squat_1RM;

        const age = this.getAge(user.birth_date);

        const body_score = this.bodyScore(bmi, 22, 10);
        const cardio_score = await this.cardioScore(vo2_max, user.gender, age);
        const strength_score = this.strengthScore(rm1, user.weight, user.gender);

        const total_score = (body_score + cardio_score + strength_score) / 3 * 100;

        const assessment_log = this.assessmentRepository.create({
            bmi,
            vo2_max,
            rm1,
            body_score,
            cardio_score,
            strength_score,
            total_score,
            logged_at: new Date(),
            user
        })

        return this.assessmentRepository.save(assessment_log);
    }

    async readByUserId(user_id: number) {
        const user = await this.userRepository.findOne({
            where: { id: user_id },
            relations: {
                assessment_logs: true
            },
            order: {
                assessment_logs: {
                    logged_at: 'DESC'
                }
            }
        });

        if (!user)
            throw new HttpException('No such user', HttpStatus.NOT_FOUND);

        return user.assessment_logs[0];
    }

    async readLastTwo(user_id: number) {
        const user = await this.userRepository.findOne({
            where: { id: user_id },
            relations: {
                assessment_logs: true
            },
            order: {
                assessment_logs: {
                    logged_at: 'DESC'
                }
            }
        });

        if (!user)
            throw new HttpException('No such user', HttpStatus.NOT_FOUND);

        const logs = user.assessment_logs.slice(0, 2);

        const body_change = (logs[0].body_score - logs[1].body_score) / logs[1].body_score * 100;
        const cardio_change = (logs[0].cardio_score - logs[1].cardio_score) / logs[1].cardio_score * 100;
        const strength_change = (logs[0].strength_score - logs[1].strength_score) / logs[1].strength_score * 100;
        const total_change = (logs[0].total_score - logs[1].total_score) / logs[1].total_score * 100;

        const trendResults = {
            body_change,
            cardio_change,
            strength_change,
            total_change,
            date: logs[0].logged_at
        }

        return trendResults;
    }

    async readOverall(user_id: number) {
        const user = await this.userRepository.findOne({
            where: { id: user_id },
            relations: {
                assessment_logs: true
            },
            order: {
                assessment_logs: {
                    logged_at: 'DESC'
                }
            }
        });

        if (!user)
            throw new HttpException('No such user', HttpStatus.NOT_FOUND);

        const logs: AssessmentLog[] = [];
        logs.push(user.assessment_logs[0]);
        logs.push(user.assessment_logs[user.assessment_logs.length - 1]);

        const body_change = (logs[0].body_score - logs[1].body_score) / logs[1].body_score * 100;
        const cardio_change = (logs[0].cardio_score - logs[1].cardio_score) / logs[1].cardio_score * 100;
        const strength_change = (logs[0].strength_score - logs[1].strength_score) / logs[1].strength_score * 100;
        const total_change = (logs[0].total_score - logs[1].total_score) / logs[1].total_score * 100;

        const trendResults = {
            body_change,
            cardio_change,
            strength_change,
            total_change,
            date: logs[0].logged_at
        }

        return trendResults;
    }
}