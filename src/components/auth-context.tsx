import { UserEntity } from '@/lib/data/types';
import { createContext, useContext, useState } from 'react';
import { removeTokenFromLocalStorage, saveTokenToLocalStorage } from '@/utils/utils';
import { useRouter } from 'next/router';
import { ApolloError } from '@apollo/client';
import { GraphQLError } from 'graphql/error';

type authContextType = {
    user: UserEntity;
    login: (user: UserEntity, token: string, refreshToken: string) => void;
    logout: () => void;
    setUser: (user: UserEntity) => void;
    checkAuth: (error: ApolloError) => void;
};

const authContextDefaultValues: authContextType = {
    user: null,
    login: (_user: UserEntity, _token: string, _refreshToken: string) => {
    },
    logout: () => {
    },
    setUser: (_user: UserEntity) => {
    },
    checkAuth: (_error: ApolloError) => {
    }
};

const AuthContext = createContext<authContextType>(authContextDefaultValues);

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const router = useRouter();
    const [user, setUser] = useState<UserEntity>(null);
    const value = {
        user,
        login: (user: UserEntity, token: string, refreshToken: string) => {
            saveTokenToLocalStorage(token, refreshToken);
            setUser(user);
        },
        logout: () => {
            removeTokenFromLocalStorage();
            setUser(null);
        },
        setUser: (user: UserEntity) => setUser(user),
        checkAuth: (error: ApolloError) => {
            if (error?.networkError) {
                if ((error.networkError as GraphQLError).extensions?.code === 'UNAUTHORIZED') {
                    router.push('/');
                    removeTokenFromLocalStorage();
                    setUser(null);
                }
            }
        }
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
