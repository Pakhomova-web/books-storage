import { UserEntity } from '@/lib/data/types';
import { createContext, useContext, useState } from 'react';
import { removeTokenFromLocalStorage, saveTokenToLocalStorage } from '@/utils/utils';
import { useRouter } from 'next/router';
import { ApolloError } from '@apollo/client';
import { GraphQLError } from 'graphql/error';
import { BOOKS_TO_BUY_ITEM, LIKED_BOOKS_ITEM } from '@/constants/local-storage';

type authContextType = {
    user: UserEntity;
    likedBooks: string[];
    booksToBuy: string[];
    login: (user: UserEntity, token: string, refreshToken: string) => void;
    logout: () => void;
    setUser: (user: UserEntity) => void;
    checkAuth: (error: ApolloError) => void;
    setLikedBooks: (bookId: string) => void;
    setBooksToBuy: (bookId: string) => void;
};

const authContextDefaultValues: authContextType = {
    user: null,
    likedBooks: [],
    booksToBuy: [],
    login: (_user: UserEntity, _token: string, _refreshToken: string) => {
    },
    logout: () => {
    },
    setUser: (_user: UserEntity) => {
    },
    checkAuth: (_error: ApolloError) => {
    },
    setLikedBooks: (_bookId: string) => {
    },
    setBooksToBuy: (_bookId: string) => {
    }
};

const AuthContext = createContext<authContextType>(authContextDefaultValues);

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const router = useRouter();
    const [user, setUser] = useState<UserEntity>(null);
    const [likedBooks, setLikedBooks] = useState<string[]>([]);
    const [booksToBuy, setBooksToBuy] = useState<string[]>([]);
    const value = {
        user,
        likedBooks,
        booksToBuy,
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
        },
        setLikedBooks: (bookId: string) => {
            let newList;

            if (likedBooks.some(id => id === bookId)) {
                newList = likedBooks.filter(id => id !== bookId);
            } else {
                newList = [...likedBooks, bookId];
            }

            setLikedBooks(newList);
            localStorage.setItem(LIKED_BOOKS_ITEM, JSON.stringify(newList));
        },
        setBooksToBuy: (bookId: string) => {
            let newList;

            if (booksToBuy.some(id => id === bookId)) {
                newList = booksToBuy.filter(id => id !== bookId);
            } else {
                newList = [...booksToBuy, bookId];
            }

            setBooksToBuy(newList);
            localStorage.setItem(BOOKS_TO_BUY_ITEM, JSON.stringify(newList));
        }
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
