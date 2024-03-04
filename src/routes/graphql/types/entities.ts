import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { UUIDType } from "./uuid.js";
import { GqlMemberTypeId } from "./MemberTypeId.js";
import { MemberType as Member, Post, Profile, User } from "@prisma/client";
import { Context } from "./definitions.js";

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
  fields: {
    id: { type: UUIDType },
    title: { type: GraphQLString },
    authorId: { type: UUIDType },
    content: { type: GraphQLString },
  },
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
      resolve: async (source, _, { dataLoader }) => {
        return dataLoader.users.load(source.userId);
      },
    },
    memberType: {
      type: MemberTypeType,
      resolve: async (source, _, { dataLoader }) => {
        return dataLoader.memberTypes.load(source.memberTypeId);
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
      resolve: async (source, _, { dataLoader }) => {
        return dataLoader.profiles.load(source.id);
      },
    },

    posts: {
      type: new GraphQLList(PostType),
      resolve: async ({ id }, _, { dataLoader }) => {
        return dataLoader.usersPosts.load(id);
      },
    },

    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (
        { id },
        _,
        { dataLoader },
      ) => {
        return dataLoader.subscribedTo.load(id);
      },
    },

    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async ({ id }, _, { dataLoader }) => {
        return dataLoader.subscribedBy.load(id);
      },
    },
  }),
});