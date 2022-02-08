import { FastifyInstance } from 'fastify'
import {TelegeramResponseBody, TelegeramResultArray} from './telegramPlugin'

export interface FastifyBotControllerInterface extends FastifyInstance {
    botController?: (body:TelegeramResultArray)=>{};
}