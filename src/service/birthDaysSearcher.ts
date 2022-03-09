import { FastifyORMInterface } from "../interface/typeOrmPlugin";
import telegramFetch from "../helpers/telegram-fetch";
import { Birthday } from "../entity/Birthday";
import { User } from "../entity/User";

let birthDaysSearcher = async (fastify : FastifyORMInterface) => {
    const birthdayRepository = await fastify.orm.getRepository(Birthday)
    let today = new Date(),
        day = today.getDate(),
        month = today.getMonth() + 1;

   // let birthdays = await birthdayRepository
   //     .find({ relations: ['user'] })

    let birthdays = await birthdayRepository
        .createQueryBuilder('birthday')
        .leftJoinAndSelect('birthday.user', 'user')
        .where(`day = ${day}`)
        .andWhere(`month = ${month}`)
        .getMany()

    if (birthdays.length) {

        let users = {}
        for (const birthday of birthdays) {
            let prevIterationBirthdays = users[birthday.user.id] ? users[birthday.user.id].birthdays : []
            users[birthday.user.id] = {
                telegramId: birthday.user.telegramId,
                language_code: birthday.user.language_code,
                birthdays: [...prevIterationBirthdays, birthday.name]
            }
        }

        for (const user in users) {
            let text = users[user].birthdays.join('\n')
            text = (users[user].language_code === 'ru')
                ? 'Сегодня День Рожденье: \n' + text
                : 'Today birthday of: \n' + text
            let params = {
                chat_id: users[user].telegramId,
                text
            }
            await telegramFetch({method: "sendMessage", params})
        }

        // let item = {
        //     id: birthdays[0].id,
        //     birthdays: [birthdays[0].name]
        // }

        // for (const birthday of birthdays) {
        //     let { name, user } = birthday
        //
        //     if (user.id === item.id ) {
        //         names.push(name)
        //     } else {

        //     }
        // }

    }

}

export default birthDaysSearcher