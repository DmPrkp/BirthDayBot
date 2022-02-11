import fastifyPlugin from "fastify-plugin";
import { FastifyORMInterface } from '../interface/typeOrmPlugin'
import { TelegeramResultArray, FromObject }from '../interface/telegramPlugin'
import { Birthday } from "../entity/Birthday";
import { User } from "../entity/User";

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
            console.log(item.message)
            console.log(item)
            let telegramUser = item.message.from
            const user = await userRepository.findOne({telegramId: telegramUser.id});

            if (!user) {
                telegramUser = await saveUser(fastify, telegramUser)
            }
            const dbUser = await userRepository.find();
            console.log("Loaded users: ", JSON.stringify(dbUser));
            let massage = item.message.text

            console.log(massage.split(' '));
        }


        // const users = await userRepository.find({ relations: ["birthdays"] });





    }
    fastify.decorate("botController", botController)
    done()
}

export default fastifyPlugin(botController, {
    fastify: '>=1.0.0',
    name: 'fastify-bot-controller'
})