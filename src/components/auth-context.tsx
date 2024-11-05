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
    setLikedBook: (bookId: string) => void;
    setBookToBuy: (bookId: string) => void;
    refetchLikedBooks: () => void;
    refetchBooksToBuy: () => void;
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
    setLikedBook: (_bookId: string) => {
    },
    setBookToBuy: (_bookId: string) => {
    },
    refetchLikedBooks: () => {},
    refetchBooksToBuy: () => {}
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
        setLikedBook: (bookId: string) => {
            let newList;

            if (likedBooks.some(id => id === bookId)) {
                newList = likedBooks.filter(id => id !== bookId);
            } else {
                newList = [...likedBooks, bookId];
            }

            setLikedBooks(newList);
            localStorage.setItem(LIKED_BOOKS_ITEM, JSON.stringify(newList));
        },
        setBookToBuy: (bookId: string) => {
            let newList;

            if (booksToBuy.some(id => id === bookId)) {
                newList = booksToBuy.filter(id => id !== bookId);
            } else {
                newList = [...booksToBuy, bookId];
            }

            setBooksToBuy(newList);
            localStorage.setItem(BOOKS_TO_BUY_ITEM, JSON.stringify(newList));
        },
        refetchLikedBooks: () => {
            setLikedBooks(JSON.parse(localStorage.getItem(LIKED_BOOKS_ITEM)) || []);
        },
        refetchBooksToBuy: () => {
            setBooksToBuy(JSON.parse(localStorage.getItem(BOOKS_TO_BUY_ITEM)) || []);
        }
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
