import fastifyPlugin from "fastify-plugin";
import { FastifyBotControllerInterface } from "../interface/botControllerPlugin"
import botController from "./bot-controller"
import telegramFetch from "../services/telegram-fetch"

async function telegramPoolingConnection(fastify: FastifyBotControllerInterface) {

    fastify.register(botController)

    let reqOptions = {
        method: 'getUpdates',
        params: {timeout: 10, offset: 883704873}
    }

    let requestIterator = async (options) => {
        try {
            let resp : any = await telegramFetch(options)
            if (resp.ok) {
                let last_id = resp.offset
                if (resp.result.length) {
                    // console.log('telegram.message.from', body.result[0].message.from);
                    await fastify.botController(resp.result)
                    last_id = resp.result.pop().update_id
                }              
                // return reqestIterator(requestOptions, {...reqParams, offset: ++last_id})                
            }
        } catch (err) {
            console.error(err);             
        }
    }
    requestIterator(reqOptions)
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