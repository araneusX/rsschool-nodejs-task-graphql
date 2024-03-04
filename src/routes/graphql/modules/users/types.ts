import { GraphQLFloat, GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import { UUIDType } from "../../types/uuid.js";

export const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

export const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});