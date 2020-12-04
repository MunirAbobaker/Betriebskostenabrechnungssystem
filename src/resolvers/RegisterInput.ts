import { InputType, Field } from "type-graphql";


@InputType() // for arguments
export class RegisterInput {

    @Field(() => String)
    firstName: string;

    @Field(() => String)
    lastName: string;

    @Field(() => String)
    username: string;

    @Field(() => String)
    password: string;

    @Field(() => String)
    email: string;

    @Field(() => String)
    address: string;
}
