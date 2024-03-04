import { GraphQLObjectType } from "graphql";
import * as memberTypes from '../modules/memberTypes/queries.js'
import * as posts from '../modules/posts/queries.js'
import * as profiles from '../modules/profiles/queries.js'
import * as users from '../modules/users/queries.js'


export const Query = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    ...memberTypes,
    ...posts,
    ...profiles,
    ...users
  },
});
