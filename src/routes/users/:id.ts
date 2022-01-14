import {FastifyInstance, FastifyRequest, FastifyReply, RouteShorthandOptions} from 'fastify'
import { Resource } from 'fastify-autoroutes'

const opts: RouteShorthandOptions = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    pong: {
                        type: 'string'
                    }
                }
            }
        }
    }
}

export default (fastify: FastifyInstance) => {
    return <Resource>{
        get: {
            handler: async function (request: FastifyRequest, reply: FastifyReply) {
                console.info("request", request.params)
                let {id}: any = request.params;
                // reply.send('Hello, user #' + id)
                reply.send({pong: 3})
            },
            schema: {
                response: {
                    200: {
                        type: 'object',
                        properties: {
                            pong: {
                                type: 'number'
                            }
                        }
                    }
                },
                querystring: {
                    name: { type: 'number' }
                },
                params: {
                    id: { type: 'number' }
                }
            }
        },
    }
}