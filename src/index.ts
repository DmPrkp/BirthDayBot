
import { Birthday } from "./entity/Birthday";
import { User } from "./entity/User";
import Fastify, { RouteShorthandOptions } from 'fastify'
import { FastifyORMInterface } from './interface/typeOrmPlugin'
import { resolve } from 'path';
import * as https from "https";
// import * as TelegramBot from 'node-telegram-bot-api'
import dbConnector from './plugin/db-connector'
// import { bootstrap } from 'fastify-decorators';

let token = '1823718690:AAHVu1ZMQWvXFC182G_e7K55yv7WjVpEgpQ'
// const bot = new TelegramBot(token, {polling: true});
// bot.onText(/\/echo (.+)/, (msg, match) => {
//     const chatId = msg.chat.id;
//     const resp = match[1];
//     bot.sendMessage(chatId, resp);
// });
// bot.on('message', (msg) => {
//     const chatId = msg.chat.id;
//     bot.sendMessage(chatId, 'test');
// });

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
// server.register(require('fastify-autoroutes'), {dir: '../routes'})


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



const start = async () => {
    try {
        await server.listen(3000, "0.0.0.0")
        // const address = server.server.address()
        // const port = typeof address === 'string' ? address : address?.port
    } catch (err) {
        server.log.error(err)
        process.exit(1)
    }

    let requestOptions = {
        host: 'api.telegram.org',
        path: '/bot'+token+'/getUpdates',
        port: 443,
        method: 'POST'
    }

    try {
        let req = await https.request(requestOptions, res => {
            res.setEncoding('utf8');
            let data
            res.on('data', d => data = d )
            return data
        })
        req.on('error', error => {
            console.error(error)
        })

        req.end()
    } catch (err) {
        console.error(err)
        throw err
    }




}
start()

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