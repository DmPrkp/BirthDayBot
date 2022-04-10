import { FastifyORMInterface } from "../interface/typeOrmPlugin";
import telegramFetch from "../helpers/telegram-fetch";
import { Birthday } from "../entity/Birthday";

let birthDaysSearcher = async (fastify : FastifyORMInterface) => {
    const birthdayRepository = await fastify.orm.getRepository(Birthday)
    let today = new Date(),
        day = today.getDate(),
        month = today.getMonth() + 1;

    if (month === 1 && day === 1) {
        let birthdays = await birthdayRepository.find()
        birthdays.map(birthday => {
            birthday.status = "not congratulate"
            return birthday
        })
        await birthdayRepository.save(birthdays)
    }

    let birthdays = await birthdayRepository
        .createQueryBuilder('birthday')
        .leftJoinAndSelect('birthday.user', 'user')
        .where(`day = ${day}`)
        .andWhere('status = "not congratulate"')
        .andWhere(`month = ${month}`)
        .getMany()

    if (birthdays.length) {

        let users = {}
        for (const birthday of birthdays) {
            let prevIterationBirthdays = users[birthday.user.id]
                ? users[birthday.user.id].birthdays
                : []
            let prevIterationBirthdayObjects = users[birthday.user.id]
                ? users[birthday.user.id].birthdayObjects
                : []

            users[birthday.user.id] = {
                telegramId: birthday.user.telegramId,
                language_code: birthday.user.language_code,
                birthdayObjects: [...prevIterationBirthdayObjects, birthday],
                birthdays: [...prevIterationBirthdays, birthday.name]
            }
        }

        for (const user in users) {
            let { birthdayObjects } = users[user]
            let text = users[user].birthdays.join('\n')
            text = (users[user].language_code === 'ru')
                ? 'Сегодня День Рожденье: \n' + text
                : 'Today birthday of: \n' + text
            let params = {
                chat_id: users[user].telegramId,
                text
            }
            let resp = await telegramFetch({method: "sendMessage", params})
                .then(resp => resp && resp.ok )
                .catch(err => console.error(err))

            if (resp) {
                for (let birthday of birthdayObjects) {
                    let notifiedBirthday = {
                        ...birthday,
                        status: 'congratulated'
                    }
                    birthdayRepository.save(notifiedBirthday)
                }
            }

        }

    }

}

export default birthDaysSearcher