import { User } from "@prisma/client";
import { GraphQLList, GraphQLNonNull } from "graphql";
import { UserType } from "../../types/entities.js";
import { UUIDType } from "../../types/uuid.js";
import { handler } from "./handlers.js";
import { createField } from "../../utils.js";

export const user = createField<User, { id: string }>({
  type: UserType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: (_, { id }, { prisma }) => handler.getById(prisma, id),
});

export const users = createField<User>({
  type: new GraphQLList(UserType),
  resolve: (_, __, { prisma }) => handler.getAll(prisma),
});
