import { MemberType, PrismaClient } from "@prisma/client"

export const handler = {
  async getAll(prisma: PrismaClient) {
    return prisma.memberType.findMany();
  },

  async getById(prisma: PrismaClient, id: MemberType['id']) {
    const memberType = await prisma.memberType.findUnique({
      where: {
        id,
      },
    });

    return memberType;
  },

  getByIds: async (prisma: PrismaClient, ids: MemberType['id'][]) => {
    const memberTypes: MemberType[] = await prisma.memberType.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return memberTypes;
  },
};