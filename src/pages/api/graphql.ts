import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import typeDefs from '../../lib/graphql/schema';
import resolvers from '../../lib/graphql/resolvers';

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers
});

export default startServerAndCreateNextHandler(apolloServer);

