import fastifyPlugin from "fastify-plugin";
import { FastifyORMInterface } from '../interface/typeOrmPlugin'
import { TelegramResultArray }from '../interface/telegramPlugin'
import { Birthday } from "../entity/Birthday";
import { User } from "../entity/User";
import telegramFetch from "../helpers/telegram-fetch";
import saveUser from "../model/user"
import saveBirthDay from "../model/birthday"

async function botControllerPlugin(fastify: FastifyORMInterface, options: TelegramResultArray, done: any) {

    let botController = async (body: TelegramResultArray) => {
        
        const userRepository = await fastify.orm.getRepository(User);
        const birthdayRepository = await fastify.orm.getRepository(Birthday);

        for (const item of body) {       
            
            if (!item.message || !item.message.text) continue
            let telegramUser = item.message.from
            let user = null;
            try {
                user = await userRepository.findOne({telegramId: telegramUser.id});
                if (!user) {
                    user = await saveUser(fastify, telegramUser)
                }
            } catch {
                continue
            }

            
            let massage = item.message.text.split(' ')
            let route = massage.shift()

            if (route === '/start') {
                let params = {
                    chat_id: user.telegramId,
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
                let resp = await saveBirthDay(fastify, birthday)
        
                if (resp) {
                    let params = {
                        chat_id: user.telegramId,
                        text: `Birthday ${resp} successfully saved!`
                    }
                    await telegramFetch({method: "sendMessage", params})  
                }
            }

            if (route === '/get') {
                if (massage[0] === 'all') {                 
                    const { birthdays } = await userRepository.findOne(user.id, {relations: ["birthdays"]});
                    let params = {
                        chat_id: user.telegramId,
                        text: (birthdays.map(el => `${el.id} ${el.name} ${el.day}.${el.month}`)).join('\n')
                    }
                    await telegramFetch({method: "sendMessage", params})
                }
            }

            if (route === '/delete') {
                if (massage[0] && Number(massage[0]).constructor === Number) {
                    try {
                        birthdayRepository.delete(Number(massage[0]))
                        let params = {
                            chat_id: user.telegramId,
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