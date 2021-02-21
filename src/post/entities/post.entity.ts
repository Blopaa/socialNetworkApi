import { Comment } from "src/comments/entities/comment.entity";
import { BaseEntity } from "src/entity/BaseEntity";
import { Profile } from "src/profile/entities/profile.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Post extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    message: string

    @ManyToOne(() => Profile, profile => profile.post)
    @JoinColumn()
    profile: Profile

    @OneToMany(() => Comment, comment => comment.post)
    comment: Comment[]

    @ManyToMany(() => Profile, profile => profile.profile_likes)
    profile_likes: Profile[]
}
