
import {Field, Float, ObjectType} from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity } from "typeorm";

@ObjectType()
@Entity()
export class Heizkostenabrechnung extends BaseEntity { 
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
    @Column({nullable: true})
    Abrechnung_Id!: string;

    @Field()
    @Column({nullable: true})
    Kostenkonzept: string;

    @Field(() => Float)
    @Column({type: "float"})
    Verteilschluessel_Einheit:  number;

    @Field(() => Float)
    @Column({type: "float"})
    Verteilschluessel:  number;

    @Field(() => Float)
    @Column({type: "money", nullable: true})
    Kosten_pro_Einheit:  number;

    @Field(() => Float)
    @Column({type: "money", nullable: true})
    Betrag_in_Euro:  number;

    @Field(() => Float)
    @Column({type: "money", nullable: true})
    Gesamt_in_Euro:  number;

}
