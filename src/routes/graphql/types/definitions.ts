import { PrismaClient } from "@prisma/client"
import { useDataLoader } from "../utils.js"
import { FieldNode, GraphQLFieldConfig } from "graphql";
import DataLoader from "dataloader";

export type Context = {
  prisma: PrismaClient;
  useDataLoader: typeof useDataLoader;
  dataLoaders: DataLoaders;
}

export type DataLoaders = WeakMap<ReadonlyArray<FieldNode>, DataLoader<unknown, unknown>>;

export type FieldConfig<TArgs = never> = GraphQLFieldConfig<string, Context, TArgs>;
