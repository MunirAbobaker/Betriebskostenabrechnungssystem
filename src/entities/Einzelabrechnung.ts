
import {Field, Float, ObjectType} from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity } from "typeorm";

@ObjectType()
@Entity()
export class Einzelabrechnung extends BaseEntity { 
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
    Abrechnungsposition:  string;

    @Field()
    @Column()
    verteilt_nach:  string;

    @Field(()=> Float)
    @Column({type: "float"})
    Gesamte_Einheit:  number;

    @Field(()=> Float)
    @Column({type: "float"})
    Einheit_Anteil:  number;

    @Field(()=> Float)
    @Column({type: "float"})
    Einheit:  number;

    @Field(()=> Float)
    @Column({type: "float"})
    Gesamte_Kosten:  number;

    @Field(()=> Float)
    @Column({type: "float"})
    Kosten_Anteil:  number;

    @Field(()=> Float)
    @Column({type: "float"})
    Umlagekosten:  number;

    @Field(()=> Float)
    @Column({type: "float"})
    Nichtumlagekosten:  number;

}
