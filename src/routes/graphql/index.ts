import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, gqlSchema } from './schemas.js';
import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { createDataLoader } from './utils.js';
import { handler as profilesHandler } from "./modules/profiles/handlers.js";
import { handler as memberTypesHandler } from "./modules/memberTypes/handler.js";
import { handler as usersHandler } from "./modules/users/handlers.js";
import { handler as postsHandler } from "./modules/posts/handlers.js";
import { Context } from './types/definitions.js';


const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;
    

      const errors = validate(gqlSchema, parse(query), [depthLimit(5)]);

      if (errors.length) {
        return { errors };
      }

      const context: Context = {
        prisma,
        dataLoader: {
          users: createDataLoader(prisma, usersHandler.getByIds, { orderBy: 'id' }),
          usersPosts: createDataLoader(prisma, postsHandler.getByUserIds),
          memberTypes: createDataLoader(prisma, memberTypesHandler.getByIds, { orderBy: 'id' }),
          profiles: createDataLoader(prisma, profilesHandler.getByUserIds, { orderBy: 'userId' }),
          subscribedBy: createDataLoader(prisma, usersHandler.getSubscribedToUsers),
          subscribedTo: createDataLoader(prisma, usersHandler.getUsersSubscribedTo),
        }
      };

      return await graphql({
        schema: gqlSchema,
        source: query,
        variableValues: variables,
        contextValue: context,
      });
    },
  });
};

export default plugin;
