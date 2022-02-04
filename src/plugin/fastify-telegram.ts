import fastifyPlugin from "fastify-plugin";
import { FastifyInstance, FastifyPluginCallback } from 'fastify'
import * as https from "https";

interface TelegramPoolingConnection {
    token: string,
}

async function telegramPoolingConnection(fastify: FastifyInstance, options: TelegramPoolingConnection) {

    let { token } = options

    // let body = JSON.stringify({timeout: 10, offset: 883704862})
    // let body = JSON.stringify({file_id: 'BQACAgIAAxkBAANUYf2GxgkJpBjdj74WNOF9-ZP8ClkAAsoaAALzWulLUicd5YrP8wYjBA'})

    let requestOptions = {
        hostname: `api.telegram.org`,
        method: 'POST',
        port: 443,
        // path: `/bot${token}/getUpdates`,
        // path: `/bot${token}/getFile`,
        path: `/file/bot${token}/documents/file_0.png`,
        headers: {
            // 'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            // 'Content-Length': body.length
        }
    }



    try {

        let httpRequest = async (options) => {
            let req = (options) => {
                return new Promise<any>((resolve, rejects) => {
                    let req = https.request(options, (res) => {
                        let body: Array<any> = [];

                        res.on('data', (chunk) => {
                            body.push(chunk)
                        });
                        res.on('end', () => {
                            // @ts-ignore
                            let bodySting : string = Buffer.concat(body).toString();
                            // resolve(JSON.parse(bodySting))
                            resolve(bodySting)
                        });
                    })

                    req.on('error', error => {
                        console.error(error)
                        rejects(error)
                    })

                    // req.write(body);
                    req.end()
                })
            }
            const answer = await req(options);
            return answer
        }

        let test : any = await httpRequest(requestOptions)
        // console.log(test.result[0].message.document)
        console.log(test)
    } catch (err) {
        console.error(err)
        throw err
    }
}

export default fastifyPlugin(telegramPoolingConnection, {
    fastify: '>= 1.0.0',
    name: 'fastify-telegram'
})