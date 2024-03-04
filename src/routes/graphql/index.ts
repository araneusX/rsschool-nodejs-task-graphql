import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, gqlSchema } from './schemas.js';
import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { useDataLoader } from './utils.js';
import { DataLoaders } from './types/definitions.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  const dataLoaders: DataLoaders = new WeakMap();

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

      console.log({ query, variables });
      

      const errors = validate(gqlSchema, parse(query), [depthLimit(5)]);

      if (errors.length) {
        return { errors };
      }

      return await graphql({
        schema: gqlSchema,
        source: query,
        variableValues: variables,
        contextValue: {
          prisma,
          useDataLoader,
          dataLoaders,
        },
      });
    },
  });
};

export default plugin;
