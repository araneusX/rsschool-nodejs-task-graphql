import { Post, User, PrismaClient } from "@prisma/client"
import { Errors } from "../../types/constants.js";

export const handler = {
  async getAll(prisma: PrismaClient) {
    return prisma.post.findMany();
  },

  async getById(prisma: PrismaClient, id: Post['id']) {
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    });

    if (post === null) {
      throw new Error(Errors.NotFound);
    }

    return post;
  },

  getByUserId(prisma: PrismaClient, userId: User['id']) {
    return prisma.post.findMany({
      where: {
        authorId: userId,
      },
    });
  },

  create(prisma: PrismaClient, post: Omit<Post, 'id'>) {
    return prisma.post.create({
      data: post,
    });
  },

  change(prisma: PrismaClient, id: Post['id'], post: Partial<Omit<Post, 'id'>>) {
    return prisma.post.update({
      where: { id },
      data: post,
    });
  },

  async delete(prisma: PrismaClient, id: Post['id']) {
    await prisma.post.delete({
      where: {
        id,
      },
    });
  }
};