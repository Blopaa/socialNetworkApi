import { Comment } from "src/comments/entities/comment.entity";
import { Profile } from "src/profile/entities/profile.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    message: string

    @ManyToOne(() => Profile, profile => profile.post)
    @JoinColumn()
    profile: Profile

    @OneToMany(() => Comment, comment => comment.post)
    comment: Comment[]
}
