
import {Field, Float, ObjectType} from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity } from "typeorm";

@ObjectType()
@Entity()
export class Abrechnung extends BaseEntity { 
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn( )
    updatedAt: Date;

    //TODO:
    @Field()
    @Column()
    AbrechnungsId: string;  //insetead of id as a  PrimaryGeneratedColumn

    @Field()
    @Column()
    UserId:  string;

    @Field(()=> Float)
    @Column({type: "float"})
    monatliche_Abschlag:  number;

    @Field()
    @Column({type: "int"})
    Abrechnungszeitraum:  number;

    @Field(()=> Float)
    @Column({type: "float"})
    Wohnflaeche:  number;

    @Field(() => String)
    @Column({type: "date"})
    Start_Data:  Date;

    @Field(() => String)
    @Column({type: "date"})
    End_Data:  Date;

}
