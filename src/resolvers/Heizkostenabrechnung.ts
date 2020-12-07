import { MyContext } from "src/types";
import {Resolver, Query, Ctx, Arg, Mutation, Float} from "type-graphql";
import { Heizkostenabrechnung } from "../entities/Heizkostenabrechnung";
import { getConnection } from "typeorm";
import { InputType, Field } from "type-graphql";


@InputType() 
export class HeizkostenType {

    @Field(() => String)
    Kostenkonzept: string;

    @Field(() => Float)
    Verteilschluessel:  number;

    @Field(() => Float)
    Kosten_pro_Einheit:  number;

}



@Resolver()
export class HeizungResolver {

    @Query(() => Heizkostenabrechnung)
    async getHeizkosten(
        @Ctx() { }: MyContext 
    ) {
        const kosten = await getConnection()
        .createQueryBuilder()
        .select("Heizkostenabrechnung")
        .from(Heizkostenabrechnung, "Heizkostenabrechnung")
        .getOne(); 
        return kosten;
    }

    @Mutation(() => Heizkostenabrechnung)
    async createHeizkosten(
        @Arg('options') options: HeizkostenType,
        @Ctx() {} : MyContext
    ): Promise<Heizkostenabrechnung> {
       
       let heizkosten;
       const BetragInEuro = options.Verteilschluessel * options.Kosten_pro_Einheit;
    
            try{
               const results = await getConnection()
                    .createQueryBuilder()
                    .insert()
                    .into(Heizkostenabrechnung)
                    .values({
                        Abrechnung_Id: "testUser2021",
                        Kostenkonzept: options. Kostenkonzept,
                        Verteilschluessel: options.Verteilschluessel, 
                        Kosten_pro_Einheit: options.Kosten_pro_Einheit, // 4-	Wie hoch sind die Grundkosten pro Einheit?
                        Betrag_in_Euro: BetragInEuro ,
                        Verteilschluessel_Einheit: 0, // m2, m3
                        Gesamt_in_Euro: 0.0,

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
    async updateHeizkosten(
        @Arg('options') options: HeizkostenType,
        @Ctx() {} : MyContext
    ) {
       
            try{
                await getConnection()
                    .createQueryBuilder()
                    .update(Heizkostenabrechnung)
                    .set({
                        Kostenkonzept: options. Kostenkonzept,
                        Verteilschluessel: options.Verteilschluessel,
                        Kosten_pro_Einheit:  options.Kosten_pro_Einheit,
                        Betrag_in_Euro: options.Kosten_pro_Einheit *  options.Kosten_pro_Einheit,
                        Gesamt_in_Euro: 4
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
