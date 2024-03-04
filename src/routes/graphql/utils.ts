import { GraphQLFieldConfig } from "graphql";
import { Context } from "./types/definitions.js";
import DataLoader from "dataloader";
import { PrismaClient } from "@prisma/client";

export const createDataLoader = <TDataItem>(prisma: PrismaClient,
    loader: (prisma: PrismaClient, ids: string[]) => Promise<TDataItem[]>, 
    options?: {
      orderBy?: keyof TDataItem,
    }
  ) => {
  const loaderFn = async (keys: readonly unknown[]) => {
    const ids = keys.map((key) => String(key));

    const data = await loader(prisma, ids);

    const orderBy = options?.orderBy;

    if (!orderBy) {
      return data;
    }
    
    return keys.map((key) => data.find((dataItem) => {
      if (dataItem && typeof dataItem === 'object' && orderBy in dataItem) {
        if (typeof dataItem[orderBy] === 'string') {
          return String(key) === dataItem[orderBy];
        }
      }

      return false;
    }) ?? null);
  }
  return new DataLoader(loaderFn);
}

export const createField = <TSource, TArgs = never>(config: GraphQLFieldConfig<TSource, Context, TArgs>) => config as GraphQLFieldConfig<unknown, unknown>;