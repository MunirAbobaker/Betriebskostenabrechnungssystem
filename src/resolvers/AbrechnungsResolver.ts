import { MyContext } from "src/types";
import {Resolver, Query, Ctx, Arg, Mutation, Float} from "type-graphql";
import { Abrechnung } from "../entities/Abrechnung";
import { getConnection } from "typeorm";
import { InputType, Field } from "type-graphql";


function monthDiff(d1: Date, d2: Date) {
    console.log(d1, d2)
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months + 1;
}

@InputType() 
export class AbrechnungType {


    @Field()
    UserId:  string;

    @Field(()=> Float)
    monatliche_Abschlag:  number;

    @Field(()=> Float)
    Wohnflaeche:  number;

    @Field(() => String)
    Start_Data:  Date;

    @Field(() => String)
    End_Data:  Date;

}



@Resolver()
export class AbrechnungsResolver {

    @Query(() => Abrechnung)
    async getAbrechnung(
        @Ctx() { }: MyContext 
    ) {
        const abrechnung = await getConnection()
        .createQueryBuilder()
        .select("Abrechnung")
        .from(Abrechnung, "Abrechnung")
        .getOne();
        console.log(abrechnung) 
        return abrechnung;
    }

    @Query(() => [Abrechnung])
    async getAbrechnungen(
        @Ctx() { }: MyContext 
    ) {
        const abrechnung = await getConnection()
        .createQueryBuilder()
        .select("Abrechnung")
        .from(Abrechnung, "Abrechnung")
        .getMany();
        console.log(abrechnung) 
        return abrechnung;
    }

    @Mutation(() => Abrechnung)
    async createAbrechnung(
        @Arg('options') options: AbrechnungType,
        @Ctx() {} : MyContext
    ): Promise<Abrechnung> {
       
           let heizkosten;
           const startDate = new Date(options.Start_Data);
           const endDate = new Date(options.End_Data)
        
           const monatsanzahl = monthDiff(startDate, endDate);
            try{
               const results = await getConnection()
                    .createQueryBuilder()
                    .insert()
                    .into(Abrechnung)
                    .values({
                        AbrechnungsId: "555",
                        UserId: options.UserId,
                        monatliche_Abschlag: options.monatliche_Abschlag,
                        Abrechnungszeitraum: monatsanzahl,
                        Wohnflaeche: options.Wohnflaeche,
                        Start_Data: startDate,
                        End_Data: endDate
                    })
                    .returning('*')
                    .execute();
                    heizkosten = results.raw[0];
                    console.log(heizkosten)
            } catch(err) {
            
                 console.log(err);
            }
           
        return heizkosten; 
    }

    @Mutation(() => Boolean)
    async updateAbrechnung(
        @Arg('options') options: AbrechnungType,
        @Ctx() {} : MyContext
    ) {
           const startDate = new Date(options.Start_Data);
           const endDate = new Date(options.End_Data)
        
           const monatsanzahl = monthDiff(startDate, endDate);
       
            try{
                await getConnection()
                    .createQueryBuilder()
                    .update(Abrechnung)
                    .set({
                        UserId: options.UserId,
                        monatliche_Abschlag: options.monatliche_Abschlag,
                        Abrechnungszeitraum:  monatsanzahl,
                        Wohnflaeche: options.Wohnflaeche,
                        Start_Data: startDate,
                        End_Data: endDate
                    })
                    .where("id = :id", { id: 1 })
                    .execute();
            } catch(err) {
              console.log(err);
              return false;          
            }
           
        return true;
    }
}
