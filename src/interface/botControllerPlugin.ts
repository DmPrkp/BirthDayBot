import { TelegramResultArray } from './telegramPlugin'
import {FastifyORMInterface} from './typeOrmPlugin'

export interface FastifyBotControllerInterface extends FastifyORMInterface {
    bot?: (body:TelegramResultArray)=>{};
}