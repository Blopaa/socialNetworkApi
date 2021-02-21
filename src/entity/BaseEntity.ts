import { CreateDateColumn } from "typeorm";

export class BaseEntity {
    @CreateDateColumn({type: "timestamp"})
    createdAt: Date;
}