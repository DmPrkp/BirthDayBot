import fastifyPlugin from "fastify-plugin";
import { FastifyInstance, FastifyPluginCallback } from 'fastify'
import * as http from "http";

let token = '1823718690:AAHVu1ZMQWvXFC182G_e7K55yv7WjVpEgpQ'

async function telegramPoolingConnection(fastify: FastifyInstance, options) {

    let reqestOptions = {
        hostname: 'https://api.telegram.org/bot'+token,
        port: 443,
        method: 'POST'
    }

    try {
        let req = http.request(reqestOptions, res => {
            res.on('data', d => console.log(d))
        })
        req.on('error', error => {
            console.error(error)
        })

        req.end()

    } catch (err) {
        console.error(err)
        throw err
    }
}