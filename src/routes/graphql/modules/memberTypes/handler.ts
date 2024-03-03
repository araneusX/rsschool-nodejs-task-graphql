import { MemberType, PrismaClient, User } from "@prisma/client"
import { Errors } from "../../types/constants.js";

export const handler = {
  async getAll(prisma: PrismaClient) {
    return prisma.memberType.findMany();
  },

  async getByIds(prisma: PrismaClient, ids: User['id'][]) {
    const memberTypes: MemberType[] = await prisma.memberType.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });


    const result = ids.map((userId) => memberTypes.find(({id}) => id === userId));

    return result;
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