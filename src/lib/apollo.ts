import { ApolloClient, from, HttpLink, InMemoryCache } from "@apollo/client";
import { removeTypenameFromVariables } from '@apollo/client/link/remove-typename';

const removeTypenameLink = removeTypenameFromVariables();
const link = from([
    removeTypenameLink,
    new HttpLink({ uri: 'http://localhost:3000/api/graphql' }),
    new HttpLink({ uri: 'https://ph-books-storage.vercel.app/api/graphql' })
]);

export const apolloClient = new ApolloClient({
    link,
    cache: new InMemoryCache()
});
