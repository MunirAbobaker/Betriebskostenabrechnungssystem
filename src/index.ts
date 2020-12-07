import "reflect-metadata"
import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import {buildSchema} from 'type-graphql';
import {HelloResolver} from './resolvers/hello';
import {UserResolver} from './resolvers/user';
import {HeizungResolver} from './resolvers/Heizkostenabrechnung';
import { AbrechnungsResolver} from './resolvers/AbrechnungsResolver'
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import {COOKIE_NAME, __prod__} from "./constants";
import cors from 'cors';
import {createConnection} from 'typeorm';
import { User } from "./entities/User";
import { Heizkostenabrechnung } from "./entities/Heizkostenabrechnung";
import { Einzelabrechnung } from "./entities/Einzelabrechnung";
import { Abrechnung } from "./entities/Abrechnung";
import { BewohnerBetriebskosten } from "./entities/BewohnerBetriebskosten";




const main = async () => {
   const connection = await createConnection({
        type: 'postgres',
        database: 'BetriebskostenabrechnungssystemDB',
        username: 'postgres',
        password: 'M1988t1983#',
        logging: true,
        synchronize: true, // without  migration
        entities: [User, Heizkostenabrechnung, Einzelabrechnung, BewohnerBetriebskosten, Abrechnung]
    });

    const app = express();
    app.use(
        cors({
            origin: "http://localhost:3000",
            credentials: true,
        })
    )
   
    const RedisStore = connectRedis(session);
    const redis = new Redis();

    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({
                client: redis,
                disableTouch: true, // so we have the session for ever not have seted tie
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
                httpOnly: true,
                sameSite: 'lax',
                secure: __prod__,
            },
            // @ts-ignore
            saveUninitialized: false , 
            secret: "secretkey",
            resave: false, 
        })
    )

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
                resolvers: [HelloResolver , UserResolver, HeizungResolver, AbrechnungsResolver],
                validate: false,
            }),
        context: ({req, res}) => ({ req, res, connection, redis}),
    });

    apolloServer.applyMiddleware({
        app,
        cors:  false,// {origin: "http://localhost:3000"} , 
    });

    
    app.listen(4000, () => {
        console.log("server started on local host:4000");
    });
}

main().catch(err => {
    console.log(err)
})
