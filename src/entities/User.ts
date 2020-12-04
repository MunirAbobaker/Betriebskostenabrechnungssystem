
import {Field, ObjectType} from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity } from "typeorm";

@ObjectType()
@Entity()
export class User extends BaseEntity { // inherit to have easy cmd like find();
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
    @Column({unique: true})
    username!: string;

    @Field()
    @Column({unique: true})
    email!: string;

    @Field()
    @Column()
    address: string;

   
    @Column()
    password: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;
}
