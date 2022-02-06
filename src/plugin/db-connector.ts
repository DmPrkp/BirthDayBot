import fastifyPlugin from 'fastify-plugin'
import { createConnection, Connection } from "typeorm";
import { FastifyORMInterface } from '../interface/typeOrmPlugin'
import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";

// type ORM 

async function typeormConnector (fastify: FastifyORMInterface, options: MysqlConnectionOptions) {
    try {
        let connection : Connection = await createConnection({...options, host: '31.134.171.194'})
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
