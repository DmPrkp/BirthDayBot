import * as dotenv from 'dotenv'
dotenv.config()
import Fastify from 'fastify'
import {FastifyBotControllerInterface} from './interface/botControllerPlugin'
import dbConnector from './plugin/db-connector'
import requestIterator from "./service/requestIterator";
import birthDaySearcher from "./service/birthDaysSearcher";
import botController from "./plugin/bot-controller";

const fastify: FastifyBotControllerInterface = Fastify({logger: true})

if (process.env.DB_USER && process.env.PASSWORD && process.env.ROOT_HOST) {
    fastify.register(dbConnector)
    fastify.register(botController)

    const start = async () => {

        try {
            await fastify.listen(3000)

        } catch (err) {
            fastify.log.error(err)
            process.exit(1)
        }

        let reqOptions = {
            method: 'getUpdates',
            params: {timeout: 15, offset: 1}
        }
        requestIterator(reqOptions, fastify)
        birthDaySearcher(fastify)
        setInterval(() => birthDaySearcher(fastify), 1000 * 60 * 60 * 24)
    }

    start()
}