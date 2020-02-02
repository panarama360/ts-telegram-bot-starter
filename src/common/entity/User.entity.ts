import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {UseAsTitle} from "admin-bro-typeorm";

@Entity()
export class UserEntity extends BaseEntity{


    constructor(obj: Partial<UserEntity> = {}) {
        super();
        Object.assign(this, obj);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    chatId: number;

    @Column()
    isBot: boolean;

    @Column()
    firstName: string;

    @Column({nullable: true})
    username: string;

    @Column({nullable: true})
    lastName: string;

    @Column({nullable: true})
    languageCode: string;

    @Column({type: "json", default: {}})
    session: any = {};

    @UpdateDateColumn()
    created: Date;

    @ManyToOne(type => UserEntity, {nullable: true})
    parentRef: UserEntity;

    @Column("int", { nullable: true })
    parentRefId: number | null;

    @UseAsTitle()
    public toString(): string
    {
        return `${this.firstName}`;
    }

}
