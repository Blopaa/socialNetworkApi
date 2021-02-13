import { Post } from "src/post/entities/post.entity";
import { Profile } from "src/profile/entities/profile.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    message: string

    @ManyToOne(() => Post, post => post.comment)
    @JoinColumn()
    post: Post

    @ManyToOne(() => Profile, profile => profile.comment)
    @JoinColumn()
    profile: Profile
}
