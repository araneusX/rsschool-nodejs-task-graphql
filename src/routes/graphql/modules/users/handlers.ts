import { PrismaClient, User } from "@prisma/client"

export const handler = {
  async getAll(prisma: PrismaClient, include?: {
    subscribedToUser: boolean,
    userSubscribedTo: boolean,
  }) {
    return prisma.user.findMany({
      include
    });
  },

  async getById(prisma: PrismaClient, id: User['id']) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

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
    try {
      await prisma.user.delete({
        where: {
          id,
        },
      });
      
      return true;
    } catch {
      return false;
    }
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
    try {
      await prisma.subscribersOnAuthors.delete({
        where: {
          subscriberId_authorId: {
            subscriberId: userId,
            authorId,
          },
        },
      });
        
      return true;
    } catch {
      return false;
    } 
  },
};