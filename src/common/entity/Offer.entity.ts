import {BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {SiteEntity} from "./Site.entity";
import {UserEntity} from "./User.entity";

@Entity()
export class OfferEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    text: string;

    // @ManyToOne(type => SiteEntity, {nullable: true})
    // site: SiteEntity;

    @ManyToOne(type => UserEntity)
    user: UserEntity;

    @Column("int", { nullable: true })
    userId: number | null;

    @CreateDateColumn()
    create: Date;
}
