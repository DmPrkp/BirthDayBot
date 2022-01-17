
import { Birthday } from "./entity/Birthday";
import { User } from "./entity/User";
import Fastify, { RouteShorthandOptions } from 'fastify'
import { FastifyORMInterface } from './interface/typeOrmPlugin'
import { resolve } from 'path';
// import { bootstrap } from 'fastify-decorators';
import dbConnector from './plugin/db-connector'
const PGHOST_DB: string = process.env.PGHOST_DB || 'localhost'
const dbSettings = {
    type: "postgres",
    host: PGHOST_DB,
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


const server: FastifyORMInterface = Fastify({
    logger: true
})
server.register(dbConnector, dbSettings)
server.register(require('fastify-autoroutes'), {dir: '../routes'})


// server.register(bootstrap, {
//     directory: resolve(__dirname, `controller`),
//     mask: /\.controller\./,
//   });

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

// server.get('/', opts, async (request, reply) => {
    
//     const birthday = new Birthday();
//         birthday.day = '11.07'
//         birthday.name = 'test'
//         birthday.status = 'not notified' 
//         await server.orm.manager.save(birthday);   

//     const user = new User();   
//         user.name = "Timber";
//         user.telegramId = 25;
//         user.birthdays = [birthday]
//         await server.orm.manager.save(user);
    
//     if (server) {
//         const userRepository = await server.orm.getRepository(User);
//         const users = await userRepository.find({ relations: ["birthdays"] }); 
//         console.log("Loaded users: ", JSON.stringify(users));
//         return JSON.stringify(users)   
//     }
// })

// server.get('/ping', opts, async (request, reply) => {        
//    return { pong: 'it worked!' }
// })

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