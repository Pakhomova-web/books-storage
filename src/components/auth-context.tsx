import { DeliveryEntity, UkrPoshtaWarehouse, UserEntity } from '@/lib/data/types';
import { createContext, useContext, useState } from 'react';
import { removeTokenFromLocalStorage, saveTokenToLocalStorage } from '@/utils/utils';
import { useRouter } from 'next/router';
import { ApolloError } from '@apollo/client';
import { GraphQLError } from 'graphql/error';
import {
    addBookInBasket, addGroupDiscountInBasket,
    changeRecentlyViewedBooks,
    likeBook,
    removeBookFromBasket, removeGroupDiscountIdFromBasket,
    unlikeBook
} from '@/lib/graphql/queries/book/hook';
import { usePathname } from 'next/navigation';

type authContextType = {
    user: UserEntity;
    ukrPoshtaWarehouses: UkrPoshtaWarehouse[],
    deliveries: DeliveryEntity[],
    openLoginModal: boolean,
    setOpenLoginModal: (open: boolean) => void,
    login: (user: UserEntity, token: string, refreshToken: string) => void;
    logout: () => void;
    setUser: (user: UserEntity) => void;
    checkAuth: (error: ApolloError) => void;
    setLikedBook: (bookId: string) => void;
    setBookInBasket: (bookId: string) => void;
    setGroupDiscountInBasket: (bookId: string) => void;
    setRecentlyViewedBooks: (bookId: string) => void;
    setDeliveries: (deliveries: DeliveryEntity[]) => void;
    setUkrPoshtaWarehouses: (warehouses: UkrPoshtaWarehouse[]) => void;
};

const authContextDefaultValues: authContextType = {
    user: null,
    openLoginModal: false,
    ukrPoshtaWarehouses: [],
    deliveries: [],
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
    setGroupDiscountInBasket: (_groupDiscountId: string) => {
    },
    setRecentlyViewedBooks: (_bookId: string) => {
    },
    setOpenLoginModal: (_open: boolean) => {
    },
    setDeliveries: (_opts: DeliveryEntity[]) => {},
    setUkrPoshtaWarehouses: (_opts: UkrPoshtaWarehouse[]) => {}
};

const AuthContext = createContext<authContextType>(authContextDefaultValues);

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<UserEntity>(null);
    const [deliveries, setDeliveries] = useState<DeliveryEntity[]>(null);
    const [ukrPoshtaWarehouses, setUkrPoshtaWarehouses] = useState<UkrPoshtaWarehouse[]>([]);
    const [openLoginModal, setOpenLoginModal] = useState<boolean>(false);
    const value = {
        user,
        deliveries,
        ukrPoshtaWarehouses,
        openLoginModal,
        login: (user: UserEntity, token: string, refreshToken: string) => {
            saveTokenToLocalStorage(token, refreshToken);
            setUser(user ? new UserEntity(user) : null);
            if (pathname === '/sign-in') {
                router.push('/');
            }
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
        setRecentlyViewedBooks: (bookId: string) => {
            if (user) {
                if (bookId !== user.recentlyViewedBookIds[0]) {
                    changeRecentlyViewedBooks(bookId)
                        .then(books => setUser({
                            ...user,
                            recentlyViewedBookIds: books.map(({ id }) => id),
                            recentlyViewedBooks: books
                        }))
                        .catch(e => {
                            console.log(e);
                        });
                }
            }
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
        setGroupDiscountInBasket: (groupDiscountId: string) => {
            if (!user) {
                setOpenLoginModal(true);
                return;
            }

            let promise;

            if (user.basketGroupDiscounts?.some(item => item.groupDiscountId === groupDiscountId)) {
                promise = removeGroupDiscountIdFromBasket(groupDiscountId);
            } else {
                promise = addGroupDiscountInBasket(groupDiscountId);
            }

            promise
                .then(basketGroupDiscounts => setUser({ ...user, basketGroupDiscounts }))
                .catch(e => {
                    console.log(e);
                });
        },
        setOpenLoginModal: (open: boolean) => {
            setOpenLoginModal(open);
        },
        setDeliveries: (deliveries: DeliveryEntity[]) => {
            setDeliveries(deliveries);
        },
        setUkrPoshtaWarehouses: (opts: UkrPoshtaWarehouse[]) => {
            setUkrPoshtaWarehouses(opts);
        }
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
