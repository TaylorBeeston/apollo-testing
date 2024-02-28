import { loadSchema } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { addResolversToSchema } from "@graphql-tools/schema";

import { resolvers } from "./graphql/resolvers";

import { ApolloServer } from "@apollo/server";

const makeExecutableSchema = async () => {
    const schemaOptions = { loaders: [new GraphQLFileLoader()] };
    const schema = await loadSchema("src/graphql/**/*.graphql", schemaOptions);

    return addResolversToSchema({ schema, resolvers });
};

export const server = new ApolloServer({
    schema: await makeExecutableSchema(),
    resolvers,
});
