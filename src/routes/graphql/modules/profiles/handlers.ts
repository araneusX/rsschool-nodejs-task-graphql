import { PrismaClient, Profile, User } from "@prisma/client"
import { Errors } from "../../types/constants.js";

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

    if (profile === null) {
      throw new Error(Errors.NotFound);
    }

    return profile;
  },

  async getByUserId(prisma: PrismaClient, userId: User['id']) {
    const profile = await prisma.profile.findUnique({
      where: {
        userId,
      },
    });
    if (profile === null) {
      throw new Error(Errors.NotFound);
    }
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