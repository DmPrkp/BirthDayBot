import fastifyPlugin from "fastify-plugin";
import { FastifyInstance, FastifyPluginCallback } from 'fastify'
import { TelegeramResponseBody, TelegramOptions } from "../interface/telegramPlugin"
import { FastifyBotControllerInterface } from "../interface/botControllerPlugin"
import botController from "./bot-controller"
import * as fetch from "../helper"

async function telegramPoolingConnection(fastify: FastifyBotControllerInterface, options: TelegramOptions) {

    fastify.register(botController)

    let { token } = options

    let reqParams = {timeout: 10, offset: 883704870}
    
    let requestOptions = {
        hostname: `api.telegram.org`,
        method: 'POST',
        port: 443,
        path: `/bot${token}/getUpdates`,
        // path: `/bot${token}/getFile`,
        // path: `/file/bot${token}/documents/file_0.png`,
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Length': reqParams.length
        }
    }


    let requestIterator = async (options, payload) => {
        try {
            let resp : any = await fetch(options, payload)
            let body : TelegeramResponseBody = JSON.parse(resp)
            if (body.ok) {
                let last_id = payload.offset
                if (body.result.length) {
                    console.log(body.result[0].message.from);
                    await fastify.botController(body)
                    last_id = body.result.pop().update_id 
                }              
                // return reqestIterator(requestOptions, {...reqParams, offset: ++last_id})                
            }
        } catch (err) {
            console.error(err);             
        }
    }
    requestIterator(requestOptions, reqParams)
}



// const birthday = new Birthday();
// birthday.day = '07-11'
// birthday.name = 'test'
// birthday.status = 'not notified'
// await server.orm.manager.save(birthday);

// const user = new User();
// user.name = "Timber";
// user.telegramId = 25;
// user.birthdays = [birthday]
// await server.orm.manager.save(user);

// if (server) {
// const userRepository = await server.orm.getRepository(User);
// const users = await userRepository.find({ relations: ["birthdays"] });
// console.log("Loaded users: ", JSON.stringify(users));
// return JSON.stringify(users)
// }

export default fastifyPlugin(telegramPoolingConnection, {
    fastify: '>= 1.0.0',
    name: 'fastify-telegram'
})