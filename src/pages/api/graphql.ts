import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';

import allowCors from '@/utils/cors';
import typeDefs from '../../lib/graphql/schema';
import resolvers from '../../lib/graphql/resolvers';

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers
});

const handler = startServerAndCreateNextHandler(apolloServer, {
    context: async (req, res) => ({ req, res }),
});

export default allowCors(handler);
