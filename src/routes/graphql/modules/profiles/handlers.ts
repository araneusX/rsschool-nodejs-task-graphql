import { PrismaClient, Profile, User } from "@prisma/client"

export const handler = {
  async getAll(prisma: PrismaClient) {
    return prisma.profile.findMany();
  },

  async getById(prisma: PrismaClient, id: string) {
    const profile = await prisma.profile.findUnique({
      where: {
        id,
      },
    });

    return profile;
  },
  
  async getByIds(prisma: PrismaClient, ids: User['id'][]) {
    const profiles: Profile[] = await prisma.profile.findMany({
      where: {
        userId: {
          in: ids,
        },
      },
    });

    const result = ids.map((userId) => profiles.find(({id}) => id === userId));

    return result;
  },

  async getByUserId(prisma: PrismaClient, userId: User['id']) {
    const profile = await prisma.profile.findUnique({
      where: {
        userId,
      },
    });

    return profile;
  },

  create(prisma: PrismaClient, profile: Omit<Profile, 'id'>) {
    return prisma.profile.create({
      data: profile,
    });
  },

  change(prisma: PrismaClient, id: Profile['id'], profile: Partial<Omit<Profile, 'id'>>) {
    return prisma.profile.update({
      where: { id },
      data: profile,
    });
  },

  async delete(prisma: PrismaClient, id: Profile['id']) {
    await prisma.profile.delete({
      where: {
        id,
      },
    });
  }
};