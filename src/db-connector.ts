import fastifyPlugin from 'fastify-plugin'
import { createConnection, Connection, ConnectionOptions } from "typeorm";
// import { FastifyInstance, RouteShorthandOptions, FastifyPluginCallback } from 'fastify'
import { FastifyORMInterface } from './interfaces/typeOrmPlugin'

// type ORM 

async function typeormConnector (fastify: FastifyORMInterface, options) {
    console.log(options);    
    try {
        let connection = await createConnection(options ? options : undefined)
        fastify
            .decorate('orm', connection)
            .addHook('onClose', async (instance: FastifyORMInterface, done) => {
                await instance.orm.close()
                done()
            })

    } catch (err) {
        console.error(err)
        throw err
    }

}

export default fastifyPlugin(typeormConnector, {
  fastify: '>= 1.0.0',
  name: 'fastify-typeorm'
})
