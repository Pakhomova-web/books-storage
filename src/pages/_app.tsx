import { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import React from 'react';
import Head from 'next/head';

import { apolloClient } from '@/lib/apollo';
import './global.css';
import { AuthProvider } from '@/components/auth-context';
import Main from '@/components/main';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ApolloProvider client={apolloClient}>
            <Head>
                <title>Books Storage</title>
            </Head>

            <AuthProvider>
                <Main>
                    <Component {...pageProps} />
                </Main>
            </AuthProvider>
        </ApolloProvider>
    );
}
