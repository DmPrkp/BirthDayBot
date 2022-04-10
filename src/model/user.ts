import newEntityCreator from '../helpers/entity-creator'
import { User } from "../entity/User";
import { FastifyORMInterface } from '../interface/typeOrmPlugin'
import { FromObject }from '../interface/telegramPlugin'

async function saveUser(fastify: FastifyORMInterface, user: FromObject) {
    let newUser = new User();
    newUser = newEntityCreator(newUser, user)
    await fastify.orm.manager.save(newUser);
    return newUser
}

export default saveUser