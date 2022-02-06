import * as dotenv from 'dotenv'
dotenv.config()
import Fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify'
import  fastifyTelegram from './plugin/fastify-telegram'
import { Birthday } from "./entity/Birthday";
import { User } from "./entity/User";
import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";
import dbConnector from './plugin/db-connector'
const dbSettings : MysqlConnectionOptions = {
    type: "mysql",
    host: process.env.ROOT_HOST,
    port: Number(process.env.PORT),
    username: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    synchronize: true,
    logging: false,
    entities: [
        __dirname + "/entity/*.ts"
    ],
}

const server: any = Fastify({logger: true})

let token : string | undefined = process.env.TELEGRAMM_TOKEN;

(token) ? server.register(fastifyTelegram, {token}) : console.error('add env var TELEGRAMM_TOKEN!');
// if (process.env.USER && process.env.PASSWORD && process.env.ROOT_HOST) {   
//     server.register(dbConnector, dbSettings)
// }

const start = async () => {
    try {
        await server.listen(3000)

    } catch (err) {
        server.log.error(err)
        process.exit(1)
    }
}

start()