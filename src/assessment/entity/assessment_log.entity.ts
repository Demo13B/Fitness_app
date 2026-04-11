import { User } from "src/users/entities/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'assessment_logs' })
export class AssessmentLog {
    @PrimaryGeneratedColumn('identity')
    id!: number;

    @Column({ type: 'float', nullable: false })
    bmi!: number;

    @Column({ type: 'float', nullable: false })
    vo2_max!: number;

    @Column({ type: 'float', nullable: false })
    rm1!: number;

    @Column({ type: 'float', nullable: false })
    body_score!: number;

    @Column({ type: 'float', nullable: false })
    cardio_score!: number;

    @Column({ type: 'float', nullable: false })
    strength_score!: number;

    @Column({ type: 'float', nullable: false })
    total_score!: number;

    @Column({ type: 'timestamp', nullable: false })
    logged_at!: Date;

    @ManyToOne(() => User, (user) => user.assessment_logs, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'user_id' })
    user!: User;
}