import * as dotenv from 'dotenv'
dotenv.config()
import Fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify'
import  fastifyTelegram from './plugin/fastify-telegram'
import dbConnector from './plugin/db-connector'

const fastify: FastifyInstance = Fastify({logger: true})

if (process.env.DB_USER && process.env.PASSWORD && process.env.ROOT_HOST) {
    fastify.register(dbConnector)
}

let token : string | undefined = process.env.TELEGRAMM_TOKEN;

(token) ? fastify.register(fastifyTelegram) : console.error('add env var TELEGRAMM_TOKEN!');

const start = async () => {
    try {
        await fastify.listen(3000)

    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

start()