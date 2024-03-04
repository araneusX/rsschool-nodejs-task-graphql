import { PrismaClient } from "@prisma/client"
import { useDataLoader } from "../utils.js"
import { FieldNode, GraphQLFieldConfig } from "graphql";
import DataLoader from "dataloader";

export type Context = {
  prisma: PrismaClient;
  useDataLoader: typeof useDataLoader;
  dataLoaders: DataLoaders;
}

export type DataLoaders = WeakMap<ReadonlyArray<FieldNode>, Record<string, DataLoader<unknown, unknown>>>;

export type FieldConfig<TSource, TArgs = never> = GraphQLFieldConfig<TSource, Context, TArgs>;
