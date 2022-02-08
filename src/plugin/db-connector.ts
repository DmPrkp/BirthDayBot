import fastifyPlugin from 'fastify-plugin'
import { createConnection, Connection } from "typeorm";
import { FastifyORMInterface } from '../interface/typeOrmPlugin'
import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";
import * as path from 'path'

let pathToProjectRoot = path.join(__dirname, '../')

const dbSettings : MysqlConnectionOptions = {
    type: "mysql",
    host: process.env.ROOT_HOST,
    port: Number(process.env.PORT),
    username: process.env.DB_USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    synchronize: true,
    logging: false,
    entities: [
        pathToProjectRoot + "/entity/*.ts"
    ],
    migrations: [
        pathToProjectRoot + "/migration/*.ts"
    ],
}


async function typeormConnector (fastify: FastifyORMInterface, options: MysqlConnectionOptions) {



    try {
        let dbOptions = (options && options.password) ? options : dbSettings

        let connection : Connection = await createConnection(dbOptions)
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
