
import { Post } from "src/post/entities/post.entity";
import User from "src/user/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

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

    @ManyToMany(() => User, user => user.user_follow)
    user_follow: User[]

    @OneToMany(() => Post, post => post.profile)
    post: Post[]

    @ManyToMany(() => Post, post => post.profile_likes)
    @JoinTable({
        name: 'profile_likes'
    })
    profile_likes: Post[]
}
