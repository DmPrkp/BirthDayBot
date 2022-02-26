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

// console.log('process.env', process.env.DB_USER, process.env.PASSWORD, process.env.ROOT_HOST);
if (process.env.DB_USER && process.env.PASSWORD && process.env.ROOT_HOST) {

    fastify.register(dbConnector)
}
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
        params: {timeout: 5, offset: 1}
    }

    let requestIterator = async (options) => {
        let resp : TelegramResponseBody;   
        try {
            resp = await telegramFetch(options)
            if (resp.ok && resp.result && resp.result.length) {
                await fastify.bot(resp.result)
            }
        } catch (err) {
            console.error(err);
        } 
        
        let { result } = resp;
        let lastMessage : TelegramMessage 
        if (result && result.length) {         
           lastMessage = result.pop()  
           lastMessage.update_id = lastMessage.update_id + 1
        } else {
            lastMessage = { update_id: options.params.offset } 
        }        
        reqOptions.params.offset = lastMessage.update_id   
        return await requestIterator(reqOptions)
    }
    await requestIterator(reqOptions)
}

start()