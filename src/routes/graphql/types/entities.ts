import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { UUIDType } from "./uuid.js";
import { GqlMemberTypeId } from "./MemberTypeId.js";
import { MemberType as Member, Post, Profile, User } from "@prisma/client";
import { Context } from "./definitions.js";
import { handler as profilesHandler } from "../modules/profiles/handlers.js";
import { handler as memberTypesHandler } from "../modules/memberTypes/handler.js";
import { handler as usersHandler } from "../modules/users/handlers.js";
import { handler as postsHandler } from "../modules/posts/handlers.js";


export const MemberTypeType = new GraphQLObjectType<Member, Context>({
  name: 'MemberType',
  fields: {
    id: { type: GqlMemberTypeId },
    postsLimitPerMonth: { type: GraphQLInt },
    discount: { type: GraphQLFloat },
  },
});

export const PostType = new GraphQLObjectType<Post, Context>({
  name: 'PostType',
  fields: () => ({
    id: { type: UUIDType },
    title: { type: GraphQLString },
    authorId: { type: UUIDType },
    content: { type: GraphQLString },
  }),
});

export const ProfileType = new GraphQLObjectType<Profile, Context>({
  name: 'ProfileType',
  fields: () => ({
    id: { type: UUIDType },
    yearOfBirth: { type: GraphQLInt },
    isMale: { type: GraphQLBoolean },
    userId: { type: UUIDType },
    memberTypeId: { type: GqlMemberTypeId },
    user: {
      type: UserType,
      resolve: async (source, _, { prisma }) => {
        return usersHandler.getById(prisma, source.userId);
      },
    },
    memberType: {
      type: MemberTypeType,
      resolve: async (source, _, { prisma }) => {
        return memberTypesHandler.getById(prisma, source.memberTypeId);
      },
    }
  }),
});

export const UserType: GraphQLObjectType = new GraphQLObjectType<User, Context>({
  name: 'UserType',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },

    profile: {
      type: ProfileType,
      resolve: async (source, _, { prisma }) => {
        return profilesHandler.getByUserId(prisma, source.id);
      },
    },

    posts: {
      type: new GraphQLList(PostType),
      resolve: async ({ id }, _, { prisma }) => {
        return postsHandler.getByUserId(prisma, id);
      },
    },

    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (
        { id },
        _,
        { prisma },
      ) => {
        return usersHandler.getSubscribedTo(prisma, id);
      },
    },

    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async ({ id }, _, { prisma }) => {
        return usersHandler.getSubscribedBy(prisma, id);
      },
    },
  }),
});