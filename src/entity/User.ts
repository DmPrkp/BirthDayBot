import {Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn} from "typeorm";
import { Birthday } from "./Birthday";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    telegramId: number;

    @OneToMany(() => Birthday, birthday => birthday.user, {
        cascade: true,
    })
    birthdays: Birthday[];

}
