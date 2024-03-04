import { GraphQLObjectType } from "graphql";
import * as posts from '../modules/posts/mutations.js'
import * as profiles from '../modules/profiles/mutations.js'
import * as users from '../modules/users/mutations.js'

export const Mutation = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    ...posts,
    ...profiles,
    ...users
  },
});