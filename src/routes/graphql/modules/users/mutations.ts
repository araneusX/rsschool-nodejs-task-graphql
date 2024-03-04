import { GraphQLBoolean, GraphQLNonNull } from "graphql";
import { UserType } from "../../types/entities.js";
import { User } from "@prisma/client";
import { ChangeUserInput, CreateUserInput } from "./types.js";
import { UUIDType } from "../../types/uuid.js";
import { handler } from "./handlers.js";
import { createField } from "../../utils.js";

export const createUser = createField<User, { dto: Omit<User, 'id'> }>({
  type: UserType,
  args: {
    dto: { type: new GraphQLNonNull(CreateUserInput) },
  },
  resolve: (_, { dto }, { prisma }) => handler.create(prisma, dto),
});

export const changeUser = createField<User, { id: string, dto: Partial<User> }>({
  type: UserType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: new GraphQLNonNull(ChangeUserInput) },
  },
  resolve: (_, { id, dto }, { prisma }) => handler.change(prisma, id, dto),
});

export const deleteUser = createField<User, { id: string }>({
  type: GraphQLBoolean,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: (_, { id }, { prisma }) => handler.delete(prisma, id),
});
