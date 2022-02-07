import { FastifyInstance } from 'fastify'
import {TelegeramResponseBody} from './telegramPlugin'

export interface FastifyBotControllerInterface extends FastifyInstance {
    botController?: (body:TelegeramResponseBody)=>{};
}