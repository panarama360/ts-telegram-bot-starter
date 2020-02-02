import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Tree,
    TreeChildren,
    TreeParent
} from "typeorm";

@Entity()
@Tree("closure-table")
export class CategoryEntity extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @TreeChildren()
    children: CategoryEntity[];

    @TreeParent()
    parent: CategoryEntity;

    @Column("int", { nullable: true })
    parentId: number | null;

    @Column({default: true})
    show: boolean;
}
