import { PrismaClient } from "@prisma/client"
import { Errors } from "../../types/constants.js";

export const handler = {
  async getAll(prisma: PrismaClient) {
    return prisma.memberType.findMany();
  },

  async getById(prisma: PrismaClient, id: string) {
    const memberType = await prisma.memberType.findUnique({
      where: {
        id,
      },
    });

    if (memberType === null) {
      throw new Error(Errors.NotFound);
    }

    return memberType;
  }
};