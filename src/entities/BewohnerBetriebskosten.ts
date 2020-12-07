
import {Field, ObjectType} from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity } from "typeorm";

@ObjectType()
@Entity()
export class BewohnerBetriebskosten extends BaseEntity { 
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn( )
    updatedAt: Date;

    @Field()
    @Column()
    AbrechnungsId: string;

    @Field()
    @Column()
    Position:  string;

    @Field()
    @Column({type: "float"})
    Betrag:  number;
}
