
import { Birthday } from "./entity/Birthday";
import { User } from "./entity/User";
import Fastify, { RouteShorthandOptions } from 'fastify'
import {FastifyORMInterface} from './interface/typeOrmPlugin'
import { resolve } from 'path';
// import { Server, IncomingMessage, ServerResponse } from 'http'
import { bootstrap } from 'fastify-decorators';
import dbConnector from './db-connector'
const dbSettings = {
    type: "postgres",
    host: process.env.PGHOST_DB,
    port: 5432,
    username: "postgres",
    password: "bot",
    database: "bot2",
    synchronize: true,
    logging: false,
    entities: [
        __dirname + "/entity/*.ts"
    ],
}


const server: FastifyORMInterface = Fastify({logger: true})
server.register(dbConnector, dbSettings)
server.register(bootstrap, {
    // Specify directory with our controllers
    directory: resolve(__dirname, `controller`),
  
    // Specify mask to match only our controllers
    mask: /\.controller\./,
  });

const opts: RouteShorthandOptions = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    pong: {
                        type: 'string'
                    }
                }
            }
        }
    }
}

server.get('/', opts, async (request, reply) => {    
    if (server) {
        const userRepository = await server.orm.getRepository(User);
        const users = await userRepository.find({ relations: ["birthdays"] }); 
        console.log("Loaded users: ", JSON.stringify(users));
        return JSON.stringify(users)   
    }
})

server.get('/ping', opts, async (request, reply) => {        
   return { pong: 'it worked!' }
})

const start = async () => {
    try {
        await server.listen(3000, "0.0.0.0")

        // const address = server.server.address()

        // const port = typeof address === 'string' ? address : address?.port

    } catch (err) {
        server.log.error(err)
        process.exit(1)
    }
}
start()


// dbConnector
//     .then(async connection => {

//         const birthday = new Birthday();
//         birthday.day = '11.07'
//         birthday.name = 'test'
//         // birthday.user = user
//         await connection.manager.save(birthday);
//         console.log('birthday', birthday)

//         const user = new User();   
//         user.name = "Timber";
//         user.telegramId = 25;
//         user.birthdays = [birthday]
//         console.log('user', user)
//         await connection.manager.save(user);

//         console.log("Loading users from the database...");
//         const birthdayRepository = await connection.getRepository(Birthday);
//         const birthdays = await birthdayRepository.find();   
//         console.log("Loaded birthdays: ", birthdays);

//         const userRepository = await connection.getRepository(User);
//         const users = await userRepository.find({ relations: ["birthdays"] });   
//         console.log("Loaded users: ", users[0].birthdays);

//     }).catch(error => console.log('createConnection', error));