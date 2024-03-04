import { Profile } from "@prisma/client";
import { ProfileType } from "../../types/entities.js";
import { GraphQLList, GraphQLNonNull } from "graphql";
import { UUIDType } from "../../types/uuid.js";
import { handler } from "./handlers.js";
import { createField } from "../../utils.js";

export const profile = createField<Profile, { id: string }>({
  type: ProfileType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: (_, { id }, { prisma }) => handler.getById(prisma, id),
});

export const profiles = createField<Profile>({
  type: new GraphQLList(ProfileType),
  resolve: (_, __, { prisma }) => handler.getAll(prisma),
});
