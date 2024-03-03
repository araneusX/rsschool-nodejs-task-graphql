import { GraphQLResolveInfo } from "graphql";
import { Context } from "./types/definitions.js";
import DataLoader from "dataloader";

export const useDataLoader = (loader: (ids: Readonly<string[]>) => Promise<unknown[]>, context: Context , info: GraphQLResolveInfo) => {
  const { dataLoaders } = context;

  let dataLoader = dataLoaders.get(info.fieldNodes);

  if (!dataLoader) {
    dataLoader = new DataLoader(loader);
    dataLoaders.set(info.fieldNodes, dataLoader);
  }

  return dataLoader;
}