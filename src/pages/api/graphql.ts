import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';

import allowCors from '@/utils/cors';
import typeDefs from '../../lib/graphql/schema';
import resolvers from '../../lib/graphql/resolvers';
import { SchemaLink } from '@apollo/client/link/schema';
import { NextApiRequest, NextApiResponse } from 'next';
import ResolverContext = SchemaLink.ResolverContext;
import { getUserById } from '@/lib/data/user';
import { getUserIdFromToken, SECRET_JWT_KEY } from '@/lib/data/auth-utils';
import { verify } from 'jsonwebtoken';

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers
});

async function getContext(req: NextApiRequest, res: NextApiResponse) {
    const context: ResolverContext = {};

    if (req.headers.authorization) {
        const token = req.headers.authorization.split('Bearer ')[1];
        try {
            verify(token, SECRET_JWT_KEY);
            const userId = getUserIdFromToken(token);

            if (userId) {
                context.user = await getUserById(userId);
            }
        } catch (err) {}
    }
    return context;
}

const handler = startServerAndCreateNextHandler(apolloServer, { context: getContext });

export default process.env.NODE_ENV === 'development' ? handler : allowCors(handler);
