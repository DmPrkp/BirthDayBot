import {Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn} from 'typeorm';
import { Birthday } from "./Birthday";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column()
    language_code: string;

    @Column()
    telegramId: number;

    @OneToMany(() => Birthday, birthday => birthday.user, {
        cascade: true,
    })
    birthdays: Birthday[];

}
