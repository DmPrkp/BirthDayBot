import fastifyPlugin from "fastify-plugin";
import { FastifyInstance, FastifyPluginCallback } from 'fastify'
import * as https from "https";

interface TelegramPoolingConnection {
    token: string,
}

async function telegramPoolingConnection(fastify: FastifyInstance, options: TelegramPoolingConnection) {

    let { token } = options

    // let body = JSON.stringify({params: { timeout: 20, offset: 883704840}})
    let body = JSON.stringify({timeout: 10, offset: 883704844})

    let requestOptions = {
        hostname: `api.telegram.org`,
        method: 'POST',
        port: 443,
        path: `/bot${token}/getUpdates`,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': body.length
        }
    }

    try {

        let req = https.request(requestOptions, (res) => {
            console.log(`STATUS: ${res.statusCode}`);
            console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                console.log(`BODY: ${chunk}`);
            });
            res.on('end', () => {
                console.log('No more data in response.');
            });
        })

        req.on('error', error => {
            console.error(error)
        })

        req.write(body);
        req.end()

    } catch (err) {
        console.error(err)
        throw err
    }
}

export default fastifyPlugin(telegramPoolingConnection, {
    fastify: '>= 1.0.0',
    name: 'fastify-telegram'
})