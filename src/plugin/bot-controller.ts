import fastifyPlugin from "fastify-plugin";
import { FastifyORMInterface } from '../interface/typeOrmPlugin'
import { Birthday } from "../entity/Birthday";
import { User } from "../entity/User";

async function botController(fastify: FastifyORMInterface, options: object, done: any) {
    let botController = async (body) => {
        const userRepository = await fastify.orm.getRepository(User);
        // const users = await userRepository.find({ relations: ["birthdays"] });
        const users = await userRepository.find({ id: 1 });
        console.log("Loaded users: ", JSON.stringify(users));
        return JSON.stringify(users)
    }
    fastify.decorate("botController", botController)
    done()
}

export default fastifyPlugin(botController, {
    fastify: '>=1.0.0',
    name: 'fastify-bot-controller'
})