import newEntityCreator from '../helpers/entity-creator'
import { Birthday } from "../entity/Birthday";
import { FastifyORMInterface, birthDayInterface } from '../interface/typeOrmPlugin'

async function saveBirthDay(fastify: FastifyORMInterface, birthDay: birthDayInterface) {
    let newBirthday = new Birthday();
    newBirthday = newEntityCreator(newBirthday, birthDay)
    let resp = await fastify.orm.manager.save(newBirthday);
    return (resp) ? resp.name : false     
}

export default saveBirthDay