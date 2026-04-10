import { User } from "src/users/entities/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'assessment_logs' })
export class AssessmentLog {
    @PrimaryGeneratedColumn('identity')
    id!: number;

    @Column({ type: 'float', nullable: false })
    body_score!: number;

    @Column({ type: 'float', nullable: false })
    cardio_score!: number;

    @Column({ type: 'float', nullable: false })
    strength_score!: number;

    @Column({ type: 'float', nullable: false })
    total_score!: number;

    @ManyToOne(() => User, (user) => user.assessment_logs)
    @JoinColumn({ name: 'user_id' })
    user!: User;
}