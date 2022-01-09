import fastifyPlugin from 'fastify-plugin'
import { createConnection, Connection, ConnectionOptions } from "typeorm";
import { FastifyORMInterface } from './interface/typeOrmPlugin'

// type ORM 

async function typeormConnector (fastify: FastifyORMInterface, options) {  
    try {
        let connection : Connection = await createConnection(options)
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
