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

    @OneToMany(() => Post, post => post.post)
    comment: Post[]

    @ManyToMany(() => Profile, profile => profile.profile_likes)
    profile_likes: Profile[]

    @ManyToOne(() => Post, post => post.comment)
    post: Post
}
