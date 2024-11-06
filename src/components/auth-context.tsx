import { UserEntity } from '@/lib/data/types';
import { createContext, useContext, useState } from 'react';
import { removeTokenFromLocalStorage, saveTokenToLocalStorage } from '@/utils/utils';
import { useRouter } from 'next/router';
import { ApolloError } from '@apollo/client';
import { GraphQLError } from 'graphql/error';
import { addBookInBasket, likeBook, removeBookFromBasket, unlikeBook } from '@/lib/graphql/queries/book/hook';

type authContextType = {
    user: UserEntity;
    openLoginModal: boolean,
    setOpenLoginModal: (open: boolean) => void,
    login: (user: UserEntity, token: string, refreshToken: string) => void;
    logout: () => void;
    setUser: (user: UserEntity) => void;
    checkAuth: (error: ApolloError) => void;
    setLikedBook: (bookId: string) => void;
    setBookInBasket: (bookId: string) => void;
};

const authContextDefaultValues: authContextType = {
    user: null,
    openLoginModal: false,
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
    setBookInBasket: (_bookId: string) => {
    },
    setOpenLoginModal: (_open: boolean) => {
    }
};

const AuthContext = createContext<authContextType>(authContextDefaultValues);

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const router = useRouter();
    const [user, setUser] = useState<UserEntity>(null);
    const [openLoginModal, setOpenLoginModal] = useState<boolean>(false);
    const value = {
        user,
        openLoginModal,
        login: (user: UserEntity, token: string, refreshToken: string) => {
            saveTokenToLocalStorage(token, refreshToken);
            setUser(user ? new UserEntity(user) : null);
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
            if (!user) {
                setOpenLoginModal(true);
                return;
            }
            let promise;

            if (user.likedBookIds?.some(id => id === bookId)) {
                promise = unlikeBook(bookId);
            } else {
                promise = likeBook(bookId);
            }

            promise
                .then(bookIds => setUser({ ...user, likedBookIds: bookIds }))
                .catch(e => {
                    console.log(e);
                });
        },
        setBookInBasket: (bookId: string) => {
            if (!user) {
                setOpenLoginModal(true);
                return;
            }

            let promise;

            if (user.basketItems?.some(item => item.bookId === bookId)) {
                promise = removeBookFromBasket(bookId);
            } else {
                promise = addBookInBasket(bookId);
            }

            promise
                .then(basketItems => setUser({ ...user, basketItems: basketItems }))
                .catch(e => {
                    console.log(e);
                });
        },
        setOpenLoginModal: (open: boolean) => {
            setOpenLoginModal(open);
        }
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
