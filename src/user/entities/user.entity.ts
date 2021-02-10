import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: false})
    username: string;

    @Column({nullable: false, unique: true})
    email: string

    @Column({nullable: false})
    password: string

}
