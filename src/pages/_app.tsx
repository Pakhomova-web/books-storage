import { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import React from 'react';

import { apolloClient } from '@/lib/apollo';
import './global.css';
import { AuthProvider } from '@/components/auth-context';
import Main from '@/components/main';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#448AFF'
        }
    },
    typography: {
        fontFamily: 'Tomes New Roman'
    }
});

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ApolloProvider client={apolloClient}>
            <AuthProvider>
                <ThemeProvider theme={theme}>
                    <Main>
                        <Component {...pageProps} />
                    </Main>
                </ThemeProvider>
            </AuthProvider>
        </ApolloProvider>
    );
}
