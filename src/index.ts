import * as dotenv from 'dotenv'
dotenv.config()
import Fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify'
// import  fastifyTelegram from './plugin/fastify-telegram'
import {FastifyBotControllerInterface} from './interface/botControllerPlugin'
import dbConnector from './plugin/db-connector'
import {TelegramMessage, TelegramResponseBody, TelegramResultArray} from "./interface/telegramPlugin";
import telegramFetch from "./services/telegram-fetch";
import botController from "./plugin/bot-controller";

const fastify: FastifyBotControllerInterface = Fastify({logger: true})

if (process.env.DB_USER && process.env.PASSWORD && process.env.ROOT_HOST) {
    fastify.register(dbConnector)
}

// let token : string | undefined = process.env.TELEGRAM_TOKEN;

// (token) ? fastify.register(fastifyTelegram) : console.error('add env var TELEGRAM_TOKEN!');

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
        params: {timeout: 10, offset: 0}
    }

    let requestIterator = async (options) => {
        let resp : TelegramResponseBody;
        let offset: number;
        try {
            resp = await telegramFetch(options)
            if (resp.ok && resp.result && resp.result.length) {
                await fastify.bot(resp.result)
            }
        } catch (err) {
            console.error(err);
        }
        let result : TelegramResultArray = resp.result;
        console.log("result", result)
        let lastMessage : TelegramMessage = (result.length) ? result.pop() : { update_id: options.params.offset }
        offset = lastMessage.update_id
        console.log('offset', offset)
        reqOptions.params.offset = offset
        console.log(reqOptions.params)
        return await requestIterator(reqOptions)
    }
    await requestIterator(reqOptions)
}

start()