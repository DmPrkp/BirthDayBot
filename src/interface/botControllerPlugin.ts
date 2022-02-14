import { FastifyInstance } from 'fastify'
import { TelegramResultArray } from './telegramPlugin'

export interface FastifyBotControllerInterface extends FastifyInstance {
    bot?: (body:TelegramResultArray)=>{};
}