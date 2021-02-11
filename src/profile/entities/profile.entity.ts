import User from "src/user/entities/user.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Profile {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: false, unique: true})
    nickname: string;

    @Column({nullable: true})
    description: string;

    @OneToOne(() => User, user => user.profile)
    user: User
}
