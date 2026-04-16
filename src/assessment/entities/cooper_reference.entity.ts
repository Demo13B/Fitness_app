import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CooperReference {
    @PrimaryGeneratedColumn('identity')
    id!: number;

    @Column()
    gender!: string;

    @Column()
    min_age!: number;

    @Column()
    max_age!: number;

    @Column({ type: 'float' })
    vo2_min!: number;

    @Column({ type: 'float' })
    vo2_max!: number;
}