import { GraphQLBoolean, GraphQLInputObjectType, GraphQLInt, GraphQLNonNull } from "graphql";
import { UUIDType } from "../../types/uuid.js";
import { GqlMemberTypeId } from "../../types/MemberTypeId.js";

export const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(GqlMemberTypeId) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
  },
});

export const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    memberTypeId: { type: GqlMemberTypeId },
    yearOfBirth: { type: GraphQLInt },
    isMale: { type: GraphQLBoolean },
  }),
});
