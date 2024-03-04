import { PrismaClient } from "@prisma/client"
import { GraphQLFieldConfig } from "graphql";
import DataLoader from "dataloader";

export type Context = {
  prisma: PrismaClient;
  dataLoader: {
    users: DataLoader<unknown, unknown>,
    profiles: DataLoader<unknown, unknown>,
    usersPosts:  DataLoader<unknown, unknown>,
    memberTypes: DataLoader<unknown, unknown>,
    subscribedTo: DataLoader<unknown, unknown>,
    subscribedBy: DataLoader<unknown, unknown>,
  };
}

export type FieldConfig<TSource, TArgs = never> = GraphQLFieldConfig<TSource, Context, TArgs>;
