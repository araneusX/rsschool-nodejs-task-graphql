import { Post, User, PrismaClient } from "@prisma/client"

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

    return post;
  },

  getByUserId(prisma: PrismaClient, userId: User['id']) {
    return prisma.post.findMany({
      where: {
        authorId: userId,
      },
    });
  },

  getByUserIds: async (prisma: PrismaClient, ids: User['id'][]) => {
    const posts = await prisma.post.findMany({
      where: {
        authorId: {
          in: ids,
        },
      },
    });

    return ids.map((userId) => posts.filter(({ authorId }) => userId === authorId));
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
    try {
      await prisma.post.delete({
        where: {
          id,
        },
      });

      return true;
    } catch {
      return false;
    }
  }
};
