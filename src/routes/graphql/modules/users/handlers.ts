import { PrismaClient, User } from "@prisma/client"
import { Errors } from "../../types/constants.js";

export const handler = {
  async getAll(prisma: PrismaClient) {
    return prisma.user.findMany();
  },

  async getById(prisma: PrismaClient, id: User['id']) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (user === null) {
      throw new Error(Errors.NotFound);
    }

    return user;
  },

  getSubscribedBy(prisma: PrismaClient, userId: User['id']) {
    return prisma.user.findMany({
      where: {
        userSubscribedTo: {
          some: {
            authorId: userId,
          },
        },
      },
    });
  },

  getSubscribedTo(prisma: PrismaClient, userId: User['id']) {
    return prisma.user.findMany({
      where: {
        subscribedToUser: {
          some: {
            subscriberId: userId,
          },
        },
      },
    });
  },

  create(prisma: PrismaClient, user: Omit<User, 'id'>) {
    return prisma.user.create({
      data: user,
    });
  },

  change(prisma: PrismaClient, id: User['id'], user: Partial<Omit<User, 'id'>>) {
    return prisma.user.update({
      where: { id },
      data: user,
    });
  },

  async delete(prisma: PrismaClient, id: User['id']) {
    await prisma.user.delete({
      where: {
        id,
      },
    });
  },

  subscribeTo(prisma: PrismaClient, userId: User['id'], authorId: User['id']) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        userSubscribedTo: {
          create: {
            authorId,
          },
        },
      },
    });
  },

  async unsubscribeFrom(prisma: PrismaClient, userId: User['id'], authorId: User['id']) {
    await prisma.subscribersOnAuthors.delete({
      where: {
        subscriberId_authorId: {
          subscriberId: userId,
          authorId,
        },
      },
    });
  },
};