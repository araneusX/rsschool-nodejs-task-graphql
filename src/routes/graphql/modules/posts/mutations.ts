import { Post } from "@prisma/client";
import { PostType, ProfileType } from "../../types/entities.js";
import { GraphQLBoolean, GraphQLNonNull } from "graphql";
import { UUIDType } from "../../types/uuid.js";
import { ChangePostInput, CreatePostInput } from "./types.js";
import { handler } from "./handlers.js";
import { createField } from "../../utils.js";

export const createPost = createField<Post, { dto: Omit<Post, 'id'> }>({
  type: PostType,
  args: {
    dto: { type: new GraphQLNonNull(CreatePostInput) },
  },
  resolve: (_, { dto }, { prisma }) => handler.create(prisma, dto),
});

export const changePost = createField<Post, { id: string, dto: Partial<Post> }>({
  type: ProfileType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: new GraphQLNonNull(ChangePostInput) },
  },
  resolve: (_, { id, dto }, { prisma }) => handler.change(prisma, id, dto),
});

export const deletePost = createField<boolean, { id: string }>({
  type: GraphQLBoolean,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: (_, { id }, { prisma }) => handler.delete(prisma, id),
});
