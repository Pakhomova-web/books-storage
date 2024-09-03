import { ApolloClient, ApolloLink, FetchResult, from, HttpLink, InMemoryCache, Observable } from "@apollo/client";
import { removeTypenameFromVariables } from '@apollo/client/link/remove-typename';
import { getAccessToken, getRefreshToken, saveTokenToLocalStorage } from '@/utils/utils';
import { onError } from '@apollo/client/link/error';
import { refreshTokenQuery } from '@/lib/graphql/queries/auth/queries';

const removeTypenameLink = removeTypenameFromVariables();
const authLink = new ApolloLink((operation, forward) => {
    const accessToken = getAccessToken();

    if (accessToken) {
        operation.setContext({
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });
    }

    return forward(operation);
});
const errorLink = onError(({ graphQLErrors, operation, forward }) => {
        if (graphQLErrors) {
            for (const err of graphQLErrors) {
                switch (err?.extensions?.code) {
                    case 'UNAUTHORIZED': {
                        return new Observable<FetchResult>(
                            (observer) => {
                                (async () => {
                                    try {
                                        if (operation.operationName === 'RefreshToken') {
                                            throw err;
                                        }
                                        const currentRefreshToken = getRefreshToken();

                                        if (!currentRefreshToken) {
                                            throw err;
                                        }

                                        const { data: { login } } = await apolloClient.query({
                                            query: refreshTokenQuery,
                                            variables: { refreshToken: currentRefreshToken }
                                        });

                                        if (!login || !login.refreshToken) {
                                            throw err;
                                        }
                                        saveTokenToLocalStorage(login.token, login.refreshToken);

                                        // Retry the failed request
                                        const subscriber = {
                                            next: observer.next.bind(observer),
                                            error: observer.error.bind(observer),
                                            complete: observer.complete.bind(observer),
                                        };
                                        const headers = operation.getContext().headers;

                                        operation.setContext({
                                            headers: {
                                                ...headers,
                                                authorization: `Bearer ${login.token}`
                                            }
                                        });
                                        forward(operation).subscribe(subscriber);
                                    } catch (e) {
                                        observer.error(e);
                                    }
                                })();
                            }
                        );
                    }
                }
            }
        }
    }
);

const link = from([
    authLink,
    errorLink,
    removeTypenameLink,
    new HttpLink({
        uri: `${process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://books-storage.vercel.app'}/api/graphql`
    }),
    // new HttpLink({
    //     uri: 'http://192.168.1.88:3000/api/graphql'
    // })
]);

export const apolloClient = new ApolloClient({
    link,
    cache: new InMemoryCache()
});
