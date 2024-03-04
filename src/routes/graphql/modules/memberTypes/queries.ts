import { GraphQLList, GraphQLNonNull } from "graphql";
import { MemberTypeType } from "../../types/entities.js";
import { MemberType } from "@prisma/client";
import { GqlMemberTypeId } from "../../types/MemberTypeId.js";
import { MemberTypeId } from "../../../member-types/schemas.js";
import { handler } from "./handler.js";
import { createField } from "../../utils.js";

export const memberType = createField<MemberType, { id: MemberTypeId }>({
  type: MemberTypeType,
  args: {
    id: { type: new GraphQLNonNull(GqlMemberTypeId) },
  },
  resolve: (_, { id }, { prisma }) => handler.getById(prisma, id),
});

export const memberTypes = createField<MemberType>({
  type: new GraphQLList(MemberTypeType),
  resolve: (_, __, { prisma }) => handler.getAll(prisma),
});
