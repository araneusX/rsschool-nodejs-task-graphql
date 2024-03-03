import { PrismaClient } from "@prisma/client"
import { useDataLoader } from "../utils.js"
import { GraphQLFieldConfig } from "graphql";

export type Context = {
  prisma: PrismaClient,
  useDataLoader: typeof useDataLoader;
}

export type FieldConfig<TArgs = never> = GraphQLFieldConfig<string, Context, TArgs>