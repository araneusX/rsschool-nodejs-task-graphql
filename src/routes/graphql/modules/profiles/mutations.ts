import { GraphQLBoolean, GraphQLNonNull } from "graphql";
import { ProfileType } from "../../types/entities.js";
import { Profile } from "@prisma/client";
import { ChangeProfileInput, CreateProfileInput } from "./types.js";
import { UUIDType } from "../../types/uuid.js";
import { handler } from "./handlers.js";
import { createField } from "../../utils.js";

export const createProfile = createField<Profile, { dto: Omit<Profile, 'id'> }>({
  type: ProfileType,
  args: {
    dto: { type: new GraphQLNonNull(CreateProfileInput) },
  },
  resolve: (_, { dto }, { prisma }) => handler.create(prisma, dto),
});

export const changeProfile = createField<Profile, { id: string, dto: Partial<Profile> }>({
  type: ProfileType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: new GraphQLNonNull(ChangeProfileInput) },
  },
  resolve: (_, { id, dto }, { prisma }) => handler.change(prisma, id, dto),
});

export const deleteProfile = createField<Profile, { id: string }>({
  type: GraphQLBoolean,  
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: (_, { id }, { prisma }) => handler.delete(prisma, id),
});
