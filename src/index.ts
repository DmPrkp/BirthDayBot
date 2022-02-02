import * as dotenv from 'dotenv'
dotenv.config()
import Fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'
import  fastifyTelegram from './plugin/fastify-telegram'
const TelegramBot = require('node-telegram-bot-api');


const server: FastifyInstance = Fastify({})

let token = process.env.TELEGRAMM_TOKEN
if (token) {
    server.register(fastifyTelegram, {token})
}

const start = async () => {
    try {
        await server.listen(3000)
    } catch (err) {
        server.log.error(err)
        process.exit(1)
    }
}

start()

// const bot = new TelegramBot(token, {polling: true});
//
// bot.on('message', (msg) => {
//
//     bot.sendMessage(msg.chat.id,"Hello user");
//
// });