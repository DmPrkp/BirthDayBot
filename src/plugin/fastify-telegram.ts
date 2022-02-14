import fastifyPlugin from "fastify-plugin";
import { FastifyBotControllerInterface } from "../interface/botControllerPlugin"
import { TelegramResponseBody, TelegramResultArray, TelegramMessage } from '../interface/telegramPlugin'
import botController from "./bot-controller"
import telegramFetch from "../services/telegram-fetch"

async function telegramPoolingConnection(fastify: FastifyBotControllerInterface) {

    await fastify.register(botController)

    let reqOptions = {
        method: 'getUpdates',
        params: {timeout: 10, offset: 883704889}
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
        let lastMessage : TelegramMessage = (result) ? result.pop() : { update_id: options.params.offset }
        offset = lastMessage.update_id
        reqOptions.params.offset = offset + 1
        console.log(reqOptions.params)
        return await requestIterator(reqOptions)
    }
    await requestIterator(reqOptions)

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