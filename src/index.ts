// import "reflect-metadata";
import {createConnection} from "typeorm";
import {User} from "./entity/User";
// import Fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify'
// import { Server, IncomingMessage, ServerResponse } from 'http'

const PGHOST_DB = process.env.PGHOST_DB


// const server: FastifyInstance = Fastify({})

// const opts: RouteShorthandOptions = {
//     schema: {
//         response: {
//             200: {
//                 type: 'object',
//                 properties: {
//                     pong: {
//                         type: 'string'
//                     }
//                 }
//             }
//         }
//     }
// }

// server.get('/ping', opts, async (request, reply) => {
//     return { pong: 'it worked!' }
// })

// const start = async () => {
//     try {
//         await server.listen(3000, "0.0.0.0")

//         // const address = server.server.address()
//         // const port = typeof address === 'string' ? address : address?.port

//     } catch (err) {
//         server.log.error(err)
//         process.exit(1)
//     }
// }
// start()

const connection = createConnection({
    type: "postgres",
    host: PGHOST_DB,
    port: 5432,
    username: "postgres",
    password: "bot",
    database: "bot",
    synchronize: true,
    logging: false,
    entities: [
        __dirname + "/entity/*.ts"
    ],
});

connection
    .then(async connection => {

        console.log("Inserting a new user into the database...");
        const user = new User();
        console.log('user', user)
        user.firstName = "Timber";
        user.lastName = "Saw";
        user.age = 25;
        await connection.manager.save(user);
        console.log("Saved a new user with id: " + user.id);

        console.log("Loading users from the database...");
        const users = await connection.manager.find(User);
        console.log("Loaded users: ", users);

        console.log("Here you can setup and run express/koa/any other framework.");

    }).catch(error => console.log('createConnection', error));