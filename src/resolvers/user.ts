import { User } from "../entities/User";
import { MyContext } from "../types";
import {Resolver, Mutation, InputType, Field, Arg, Ctx, ObjectType, Query} from "type-graphql";
import argon2 from 'argon2';
import { getConnection } from "typeorm";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import { RegisterInput } from "./RegisterInput";
import { validateregister } from "../utils/validateRegister";
import { sendEmail } from "../utils/sendEmail";
import {v4} from 'uuid';

@InputType() // for arguments
class UsernamePasswordInput {
  
    @Field( () => String )
    email: string;

    @Field( () => String)
    password: string;
}

@ObjectType()
class FieldError {
    @Field()
    field: string;

    @Field()
    message: string;
}

@ObjectType() // for mutations
class UserResponse {
    @Field(() => [FieldError], { nullable: true}) // cuz optional, we have to explicit write a type
    errors?: FieldError[]
     
    @Field(() => User, { nullable: true})
    user?: User
}

@Resolver()
export class UserResolver {

   @Mutation(() => UserResponse)
   async changePassword(
       @Arg('token') token: string, 
       @Arg('newPassword') newPassword: string,
       @Ctx() {redis, req}: MyContext
   ) :Promise<UserResponse>  {
    if (newPassword.length <= 3) {
        return {
            errors: [ 
                {
                   field: 'newPassword',
                   message: "length must be greater than 3!", 
                },
            ]
        };
    }
      const key = FORGET_PASSWORD_PREFIX + token;
      const userId = await redis.get(key);
      if(!userId) { // token has 3 days live-time
        return {
            errors: [ 
                {
                   field: 'token',
                   message: "token expired", 
                },
            ]
        };
      }
      const paresedUserId = parseInt(userId);
      const user = await User.findOne(paresedUserId );
      if(!user ) {
        return {
            errors: [ 
                {
                   field: 'token',
                   message: "user no longer exist", 
                },
            ]
        };
      }

      await User.update(
          {id: paresedUserId}, 
          { password:  await argon2.hash(newPassword) },
          );

      redis.del(key); // only use  token one time
      // log in after change password
      req.session.userId = user.id;

      return {user}
   }

    @Mutation(() => Boolean)
    async forgotPassword( 
        @Arg('email') email: string,
        @Ctx() {redis}: MyContext
        ) {
            const user = await User.findOne({where: {email: email}});
            if(!user) {
                // email not in db
                return true;
            }
            const token = v4();
            await redis.set(FORGET_PASSWORD_PREFIX + token, user.id, 'ex', 1000 * 60 *60 * 24 *3 ); //save token for 3 days
            await sendEmail(
                email,
                `<a href="http://localhost:3000/change-password/${token}">reset password</a>`
                );
            return true;
      
    }

    @Query(() => User, { nullable: true })
     me(@Ctx() {req }: MyContext) {
      console.log(req.session)
    // you are not logged in
    if (!req.session.userId) {
      return null;
    }
    return User.findOne(req.session.userId);
  }

    @Mutation(() => UserResponse)
    async register(
        @Arg('options', () => RegisterInput) options: RegisterInput,
        @Ctx() {req} : MyContext
    ): Promise<UserResponse> {
       const errors = validateregister(options);
       if(errors) {
           return { errors};
       }

        const hashedPassword = await argon2.hash(options.password);
        let user;
    
            try{
                //User.create({vales}).save();
               const results = await getConnection()
                    .createQueryBuilder()
                    .insert()
                    .into(User)
                    .values({
                        firstName: options.firstName,
                        lastName: options.lastName,
                        username: options.username,
                        password: hashedPassword,
                        email: options.email,
                        address: options.address
                    })
                    .returning('*')
                    .execute();
                    user = results.raw[0];
            } catch(err) {
                console.log("err ", err);
                if(err.code === '23505') {
                    return{
                        errors: [{
                           field: 'username',
                           message: "duplicate username", 
                        }],
                    };
                }
                 
            }
        req.session!.userId = user.id
        return {user};
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('options', () => UsernamePasswordInput) options: UsernamePasswordInput,
        @Ctx() { req} : MyContext
    ): Promise<UserResponse> {
        const user = await User.findOne( {where : {email: options.email}});

        if(!user) {
            return {
                errors: [{
                   field: 'email',
                   message: "email doesn't exist", 
                }],
            };
        }

        const valid = argon2.verify(user.password, options.password);
        if(!valid) {
            return {
                errors: [{
                   field: 'password',
                   message: "password is incorrect", 
                }],
            };
        }
    
        req.session!.userId = user.id
        console.log(req.session)
        return {
            user,
        };
    }

    @Mutation(() => Boolean)
    logout( @Ctx() { req , res }: MyContext ) {
       return new Promise((resolve) => req.session.destroy((err: any) => { // destroy session
        res.clearCookie(COOKIE_NAME); // destroy cookie
           if(err) {
               console.log(err);
               resolve(false);
               return;
           }
           resolve(true);
       }))
    }
}
