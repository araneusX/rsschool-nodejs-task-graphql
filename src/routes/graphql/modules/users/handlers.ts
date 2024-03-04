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

  getByIds: async  (prisma: PrismaClient, ids: User['id'][]) => {
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return users;
  },

  getSubscribedToUsers: async (prisma: PrismaClient, userIds: User['id'][]) => {
    const subscribers = await prisma.user.findMany({
      where: {
        userSubscribedTo: {
          some: {
            authorId: {
              in: userIds
            },
          },
        },
      },
      include: {
        userSubscribedTo: true,
      }
    });

    return userIds.map((userId) => subscribers.filter(({ userSubscribedTo }) => userSubscribedTo.some(({ authorId }) => userId === authorId)));
  },

  getUsersSubscribedTo: async (prisma: PrismaClient, userIds: User['id'][]) => {
    const subscribers = await prisma.user.findMany({
      where: {
        subscribedToUser: {
          some: {
            subscriberId: {
              in: userIds
            },
          },
        },
      },
      include: {
        subscribedToUser: true,
      }
    });

    return userIds.map((userId) => subscribers.filter(({ subscribedToUser }) => subscribedToUser.some(({ subscriberId }) => userId === subscriberId)));
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