import { FastifyInstance, FastifyPluginCallback } from 'fastify'
import { Connection, ConnectionOptions } from "typeorm";

declare namespace fastifyTypeorm {
    interface FastifyTypeormNestedObject {
      [name: string]: Connection;
    }
  
    interface FastifyTypeormOpts {
      connection?: Connection;
      namespace?: string;
    }
    type FastifyTypeormOptions = ConnectionOptions | FastifyTypeormOpts;
  }
  
declare const fastifyTypeorm: FastifyPluginCallback<fastifyTypeorm.FastifyTypeormOptions>;

export interface FastifyORMInterface extends FastifyInstance {
    orm?: Connection & fastifyTypeorm.FastifyTypeormNestedObject;
}