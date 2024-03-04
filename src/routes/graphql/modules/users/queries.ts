import { User } from "@prisma/client";
import { GraphQLList, GraphQLNonNull } from "graphql";
import { UserType } from "../../types/entities.js";
import { UUIDType } from "../../types/uuid.js";
import { handler } from "./handlers.js";
import { createField } from "../../utils.js";
import { ResolveTree, parseResolveInfo, simplifyParsedResolveInfoFragmentWithType } from "graphql-parse-resolve-info";

export const user = createField<User, { id: string }>({
  type: UserType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: (_, { id }, { prisma }) => handler.getById(prisma, id),
});

export const users = createField<User>({
  type: new GraphQLList(UserType),
  resolve: async (_, __, { prisma, dataLoader }, info) => {
    const parsedResolveInfoFragment = parseResolveInfo(info) as ResolveTree;
    const { fields } = simplifyParsedResolveInfoFragmentWithType(
      parsedResolveInfoFragment,
      info.returnType,
    ) ;

    const needToIncludeSubscribedTo = Object.hasOwn(fields, 'userSubscribedTo');
    const needToIncludeSubscribedBy = Object.hasOwn(fields, 'subscribedToUser');
    
    const users = await handler.getAll(prisma, {
      subscribedToUser: needToIncludeSubscribedBy,
      userSubscribedTo: needToIncludeSubscribedTo,
    });
    
    users.forEach((user) => {
      if (needToIncludeSubscribedBy) {
        dataLoader.subscribedBy.prime(
          user.id, 
          users.filter(({id}) => user.subscribedToUser?.some(({subscriberId}) => id === subscriberId)),
        )
      }

      if (needToIncludeSubscribedTo) {
        dataLoader.subscribedTo.prime(
          user.id, 
          users.filter(({id}) => user.userSubscribedTo?.some(({ authorId }) => id === authorId)),
        )
      }

      dataLoader.users.prime(user.id, user);
    })

    return users; 
  },
});
