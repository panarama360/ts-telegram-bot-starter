import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {CategoryEntity} from "./Category.entity";
import {Textarea} from "admin-bro-typeorm/lib/decorators/Textarea";
import {UseAsTitle} from "admin-bro-typeorm";

@Entity()
export class SiteEntity extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Textarea()
    @Column('text')
    text: string;

    @ManyToOne(type => CategoryEntity, {eager: true})
    category: CategoryEntity

    @Column("int", { nullable: true })
    public categoryId: number | null;

    @Column({default: true})
    show: boolean;

    @Column({type: "json", default: []})
    buttons: {url: string, text: string}[]
}
