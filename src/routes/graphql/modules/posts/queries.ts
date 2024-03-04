import { Post } from "@prisma/client";
import { PostType } from "../../types/entities.js";
import { GraphQLList, GraphQLNonNull } from "graphql";
import { UUIDType } from "../../types/uuid.js";
import { handler } from "./handlers.js";
import { createField } from "../../utils.js";

export const post = createField<Post, { id: string }>({
  type: PostType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: (_, { id }, { prisma }) => handler.getById(prisma, id),
});

export const posts = createField<Post>({
  type: new GraphQLList(PostType),
  resolve: (_, __, { prisma }) => handler.getAll(prisma),
});
