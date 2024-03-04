import { GraphQLFieldConfig, GraphQLResolveInfo } from "graphql";
import { Context } from "./types/definitions.js";
import DataLoader from "dataloader";
import { PrismaClient } from "@prisma/client";

export const useDataLoader = (
    loader: (prisma: PrismaClient, ids: Readonly<unknown[]>) => Promise<unknown[]>, 
    context: Context , 
    info: GraphQLResolveInfo, 
    key = '__default'
  ) => {
  const { dataLoaders } = context;

  let dataLoader = dataLoaders.get(info.fieldNodes)?.[key];

  if (!dataLoader) {
    dataLoader = new DataLoader((keys) => loader(context.prisma, keys));
    dataLoaders.set(info.fieldNodes, { ...dataLoaders.get(info.fieldNodes), [key]: dataLoader });
  }

  return dataLoader;
}

export const createField = <TSource, TArgs = never>(config: GraphQLFieldConfig<TSource, Context, TArgs>) => config as GraphQLFieldConfig<unknown, unknown>;