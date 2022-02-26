import fastifyPlugin from "fastify-plugin";
import { FastifyORMInterface, birthDayInterface } from '../interface/typeOrmPlugin'
import { TelegramResultArray, FromObject }from '../interface/telegramPlugin'
import { Birthday } from "../entity/Birthday";
import { User } from "../entity/User";
import telegramFetch from "../services/telegram-fetch";

function newEntityCreator(entity, val) {
    for (const key of Object.keys(val)) {
        (key === 'id') ? entity.telegramId = val[key] : entity[key] = val[key];
    }
    return entity
}

async function saveUser(fastify: FastifyORMInterface, user: FromObject) {
    let newUser = new User();
    newUser = newEntityCreator(newUser, user)
    await fastify.orm.manager.save(newUser);
    return newUser
}

async function saveBirthDay(fastify: FastifyORMInterface, birthDay: birthDayInterface) {
    let newBirthday = new Birthday();
    newBirthday = newEntityCreator(newBirthday, birthDay)
    await fastify.orm.manager.save(newBirthday);
}

async function botControllerPlugin(fastify: FastifyORMInterface, options: TelegramResultArray, done: any) {

    let botController = async (body: TelegramResultArray) => {
        
        const userRepository = await fastify.orm.getRepository(User);
        const birthdayRepository = await fastify.orm.getRepository(Birthday);

        for (const item of body) {
            let telegramUser = item.message.from
            const user = await userRepository.findOne({telegramId: telegramUser.id});
            if (!user) {
                telegramUser = await saveUser(fastify, telegramUser)
            }
            console.log(item)
            let massage = item.message.text.split(' ')
            let route = massage.shift()

            if (route === '/start') {
                let params = {
                    chat_id: 1062015030,
                    text: 'initial options'
                }
                await telegramFetch({method: "sendMessage", params})
            }

            if (route === '/set' && massage) {
                let [day, month] = massage.pop().split('.')
                let birthday = {
                    user,
                    day: Number(day),
                    month: Number(month),
                    name: massage.join(' '),
                    status: 'not congratulate'
                }
                await saveBirthDay(fastify, birthday)
            }

            if (route === '/get') {
                if (massage[0] === 'all') {                 
                    const { birthdays } = await userRepository.findOne(user.id, {relations: ["birthdays"]});
                    let params = {
                        chat_id: 1062015030,
                        text: (birthdays.map(el => `${el.id} ${el.name} ${el.day}.${el.month}`)).join('\n')
                    }
                    await telegramFetch({method: "sendMessage", params})
                }
                if (massage[0] && Number(massage[0]).constructor === Number) {
                    console.log('get 1')
                }
            }

            if (route === '/delete') {
                if (massage[0] && Number(massage[0]).constructor === Number) {
                    try {
                        birthdayRepository.delete(Number(massage[0]))
                        let params = {
                            chat_id: 1062015030,
                            text: `item ${massage[0]} is deleted`
                        }
                        await telegramFetch({method: "sendMessage", params})  
                    } catch(e) {console.error(e)}
             
                }
            }
        }
     }
    fastify.decorate("bot", botController)
    done()
}

export default fastifyPlugin(botControllerPlugin, {
    fastify: '>=1.0.0',
    name: 'fastify-bot-controller'
})