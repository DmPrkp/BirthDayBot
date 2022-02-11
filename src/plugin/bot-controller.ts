import fastifyPlugin from "fastify-plugin";
import { FastifyORMInterface } from '../interface/typeOrmPlugin'
import { TelegeramResultArray, FromObject }from '../interface/telegramPlugin'
import { Birthday } from "../entity/Birthday";
import { User } from "../entity/User";
import telegramFetch from "../services/telegram-fetch";
import {monitorEventLoopDelay} from "perf_hooks";

async function saveUser(fastify: FastifyORMInterface, user: FromObject) {
    let newUser = new User();
    for (const key of Object.keys(user)) {
        (key === 'id') ? newUser.telegramId = user[key] : newUser[key] = user[key];
    }
    await fastify.orm.manager.save(newUser);
    return newUser
}

async function botController(fastify: FastifyORMInterface, options: object, done: any) {
    let botController = async (body: TelegeramResultArray) => {

        const userRepository = await fastify.orm.getRepository(User);

        for (const item of body) {
            let telegramUser = item.message.from
            const user = await userRepository.findOne({telegramId: telegramUser.id});
            if (!user) {
                telegramUser = await saveUser(fastify, telegramUser)
            }
            // const dbUser = await userRepository.find();
            // console.log("Loaded users: ", JSON.stringify(dbUser));
            let massage = item.message.text.split(' ')
            let route = massage.shift()

            if (route === '/start') {
                let params = {
                    chat_id: 1062015030,
                    text: 'initial options'
                }
                await telegramFetch({method: "sendMessage", params})
            }
            if (route === '/set') {

            }
            if (route === '/get') {
                if (massage[0] === 'all') {
                    const users = await userRepository.find({ relations: ["birthdays"] });
                }
                if (massage[0] && Number(massage[0]).constructor === Number) {
                    console.log('get 1')
                }
            }
            if (route === '/set') {
                console.log(route, massage)
            }
            if (route === '/delete') {
                console.log(route, massage)
            }
        }






    }
    fastify.decorate("botController", botController)
    done()
}

export default fastifyPlugin(botController, {
    fastify: '>=1.0.0',
    name: 'fastify-bot-controller'
})