import { FastifyORMInterface } from "../interface/typeOrmPlugin";
import telegramFetch from "../helpers/telegram-fetch";
import { Birthday } from "../entity/Birthday";
import { User } from "../entity/User";

let birthDaysSearcher = async (fastify : FastifyORMInterface) => {
    const birthdayRepository = await fastify.orm.getRepository(Birthday)
    let today = new Date(),
        day = today.getDate(),
        month = today.getMonth();

   // let birthdays = await birthdayRepository
   //     .find({ relations: ['user'] })

    let birthdays = await birthdayRepository
        .createQueryBuilder('birthday')
        .leftJoinAndSelect('birthday.user', 'user')
        .where(`day = ${day}`)
        .andWhere(`month = ${month}`)
        .getMany()

    if (birthdays.length) {

        let names = [];
        let { user } = birthdays[0]

        for (const birthday of birthdays) {
            let { name } = birthday
            names.push(name)
        }
        let text = names.join('\n')
        text = (user.language_code === 'ru')
            ? 'Сегодня День Рожденье: \n' + text
            : 'Today birthday of: \n' + text
        let params = {
            chat_id: user.telegramId,
            text
        }
        await telegramFetch({method: "sendMessage", params})
    }

    // console.log(day, month)
}

export default birthDaysSearcher