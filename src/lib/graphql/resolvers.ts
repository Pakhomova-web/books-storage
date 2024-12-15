import { Resolvers } from '@/lib/generated/core.graphql';
import { createLanguage, deleteLanguage, getLanguageById, getLanguages, updateLanguage } from '@/lib/data/language';
import {
    createPublishingHouse,
    deletePublishingHouse,
    getPublishingHouseById,
    getPublishingHouses,
    updatePublishingHouse
} from '@/lib/data/publishing-house';
import { createPageType, deletePageType, getPageTypes, updatePageType } from '@/lib/data/page-type';
import { createBookType, deleteBookType, getBookTypeById, getBookTypes, updateBookType } from '@/lib/data/book-type';
import { createCoverType, deleteCoverType, getCoverTypes, updateCoverType } from '@/lib/data/cover-type';
import {
    AuthorEntity,
    BookSeriesEntity,
    BookTypeEntity,
    CommentEntity,
    CoverTypeEntity,
    DeliveryEntity, GroupDiscountEntity, IGroupDiscountFilter,
    IOrderFilter,
    IPageable,
    LanguageEntity,
    OrderEntity,
    PageTypeEntity,
    PublishingHouseEntity,
    UserEntity
} from '@/lib/data/types';
import {
    createBookSeries,
    deleteBookSeries,
    getBookSeries,
    getBookSeriesById,
    getBookSeriesOptions,
    updateBookSeries
} from '@/lib/data/book-series';
import {
    addComment,
    approveComment,
    createBook,
    getBookById,
    getBookComments,
    getBooks,
    getBooksByAuthor,
    getBooksByIds,
    getBooksFromSeries,
    getBooksNameByQuickSearch,
    getBooksWithDiscount,
    getBooksWithNotApprovedComments, getTopOfSoldBooks,
    removeComment,
    updateBook,
    updateBookNumberInStock
} from '@/lib/data/books';
import { createAuthor, deleteAuthor, getAuthorById, getAuthors, updateAuthor } from '@/lib/data/author';
import { GraphQLError } from 'graphql/error';
import {
    activateUser,
    addBookInBasket, addGroupDiscountInBasket, changePassword, changePasswordByToken,
    changeRecentlyViewedBooks,
    createUser,
    getNewToken,
    likeBook,
    login,
    removeBookFromBasket, removeGroupDiscountFromBasket, sendActivationLinkTo,
    unlikeBook,
    updateBookCountInBasket, updateGroupDiscountCountInBasket,
    updateUser
} from '@/lib/data/user';
import { createDelivery, deleteDelivery, getDeliveries, getDeliveryOptions, updateDelivery } from '@/lib/data/delivery';
import { cancelOrder, createOrder, getBalance, getOrders, updateOrder } from '@/lib/data/order';
import { isAdmin } from '@/utils/utils';
import { checkResetPasswordToken, sendUpdatePasswordLink } from '@/lib/data/reset-token';
import {
    createGroupDiscount,
    deleteGroupDiscount,
    getGroupDiscounts, getGroupDiscountsByIds,
    updateGroupDiscount
} from '@/lib/data/group-discounts';

function parseError<T>(error): T {
    switch (error.extensions?.code) {
        case 'BAD_USER_INPUT':
        case 'GRAPHQL_PARSE_FAILED':
            throw new GraphQLError(error, {
                extensions: {
                    code: error.extensions?.code,
                    message: 'Щось невірно із даними.'
                }
            });
        case 'USAGE_ERROR':
        case 'NOT_FOUND':
        case 'INVALID_TOKEN':
        case 'NOT_AUTHORIZED':
        case 'NOT_ACTIVATED':
        case 'DUPLICATE_ERROR':
            throw new GraphQLError(error, {
                extensions: {
                    code: error.extensions?.code,
                    message: error.message
                }
            });
        case 'GRAPHQL_VALIDATION_FAILED': {
            throw new GraphQLError(error, {
                extensions: {
                    code: 'SOMETHING_BAD_HAPPENED',
                    message: 'Щось не так із даними.'
                }
            });
        }
        default: {
            throw new GraphQLError(error, {
                extensions: {
                    code: 'SOMETHING_BAD_HAPPENED',
                    message: 'Щось пішло не так.'
                }
            });
        }
    }
}

const resolvers: Resolvers = {
    Query: {
        balance: async (_root, _, { user }) => {
            _checkUser(user);
            return isAdmin(user) ? getBalance() : null;
        },
        languages: async (_root, { pageSettings, filters }) => {
            return getLanguages(<IPageable>pageSettings, <LanguageEntity>filters).catch(error => parseError(error));
        },
        publishingHouses: async (_root, { pageSettings, filters }) => {
            return getPublishingHouses(<IPageable>pageSettings, <PublishingHouseEntity>filters).catch(error => parseError(error))
        },
        pageTypes: async (_root, { pageSettings, filters }) => {
            return getPageTypes(<IPageable>pageSettings, <PageTypeEntity>filters).catch(error => parseError(error))
        },
        bookTypes: async (_root, { pageSettings, filters }) => {
            return getBookTypes(<IPageable>pageSettings, <BookTypeEntity>filters).catch(error => parseError(error));
        },
        coverTypes: async (_root, { pageSettings, filters }) => {
            return getCoverTypes(<IPageable>pageSettings, <CoverTypeEntity>filters).catch(error => parseError(error));
        },
        authors: async (_root, { pageSettings, filters }) => {
            return getAuthors(<IPageable>pageSettings, <AuthorEntity>filters).catch(error => parseError(error));
        },
        bookSeries: async (_root, { pageSettings, filters }) => {
            return getBookSeries(<IPageable>pageSettings, filters).catch(error => parseError(error));
        },
        bookSeriesOptions: async (_root, { filters }) => {
            return getBookSeriesOptions(filters).catch(error => parseError(error));
        },
        books: async (_root, { pageSettings, filters }) => {
            return getBooks(<IPageable>pageSettings, filters).catch(error => parseError(error));
        },
        groupDiscounts: async (_root, { pageSettings, filters }) => {
            return getGroupDiscounts(<IPageable>pageSettings, <IGroupDiscountFilter>filters).catch(error => parseError(error));
        },
        groupDiscountsByIds: async (_root, { pageSettings, ids }) => {
            return getGroupDiscountsByIds(ids, <IPageable>pageSettings).catch(error => parseError(error));
        },
        bookById: async (_root, { id }) => {
            return getBookById(id).catch(error => parseError(error));
        },
        bookTypeById: async (_root, { id }) => {
            return getBookTypeById(id).catch(error => parseError(error));
        },
        authorById: async (_root, { id }) => {
            return getAuthorById(id).catch(error => parseError(error));
        },
        publishingHouseById: async (_root, { id }) => {
            return getPublishingHouseById(id).catch(error => parseError(error));
        },
        languageById: async (_root, { id }) => {
            return getLanguageById(id).catch(error => parseError(error));
        },
        bookSeriesByIdQuery: async (_root, { id }) => {
            return getBookSeriesById(id).catch(error => parseError(error));
        },
        refreshToken: async (_root, { refreshToken }) => {
            return getNewToken(refreshToken).catch(error => parseError(error));
        },
        deliveries: async (_root, { pageSettings, filters }) => {
            return getDeliveries(<IPageable>pageSettings, <DeliveryEntity>filters).catch(error => parseError(error));
        },
        deliveryOptions: async () => {
            return getDeliveryOptions().catch(error => parseError(error));
        },
        orders: async (_root, { pageSettings, filters }) => {
            return getOrders(<IPageable>pageSettings, <IOrderFilter>filters).catch(error => parseError(error));
        },
        bookComments: async (_root, { id, page, rowsPerPage }) => {
            return getBookComments(id, page, rowsPerPage).catch(error => parseError(error));
        },
        booksFromSeries: async (_root, { bookId, rowsPerPage }) => {
            return getBooksFromSeries(bookId, rowsPerPage).catch(error => parseError(error));
        },
        booksNameByQuickSearch: async (_root, { quickSearch }) => {
            return getBooksNameByQuickSearch(quickSearch).catch(error => parseError(error));
        },
        booksByAuthor: async (_root, { authorId, rowsPerPage, excludeBookSeriesId }) => {
            return getBooksByAuthor(authorId, rowsPerPage, excludeBookSeriesId).catch(error => parseError(error));
        },
        booksByIds: async (_root, { ids, pageSettings }) => {
            return getBooksByIds(ids, <IPageable>pageSettings).catch(error => parseError(error));
        },
        booksWithDiscount: async (_root, { rowsPerPage }) => {
            return getBooksWithDiscount(rowsPerPage).catch(error => parseError(error));
        },
        topOfSoldBooks: async (_root, { rowsPerPage }) => {
            return getTopOfSoldBooks(rowsPerPage).catch(error => parseError(error));
        },
        booksWithNotApprovedComments: async (_root, { pageSettings }) => {
            return getBooksWithNotApprovedComments(<IPageable>pageSettings).catch(error => parseError(error));
        },
        checkResetPasswordToken: async (_root, { userId, token }) => {
            return checkResetPasswordToken(userId, token).catch(error => parseError(error));
        },
        login: async (_root, { email, password }) => {
            return login(email, password).catch(error => parseError(error));
        },
        activateUser: async (_root, { token }) => {
            return activateUser(token).catch(error => parseError(error));
        },
        sendActivationLinkTo: async (_root, _, { user }) => {
            _checkUser(user);
            return sendActivationLinkTo(user.id, user.email).catch(error => parseError(error));
        }
    },
    Mutation: {
        updateLanguage: async (_root, { input }: { input: LanguageEntity }, { user }) => {
            _checkUser(user);
            return updateLanguage(input).catch(error => parseError(error));
        },
        deleteLanguage: async (_root, { id }: { id: string }, { user }) => {
            _checkUser(user);
            return deleteLanguage(id).catch(error => parseError(error));
        },
        createLanguage: async (_root, { input }: { input: LanguageEntity }, { user }) => {
            _checkUser(user);
            return createLanguage(input).catch(error => parseError(error));
        },
        // publishing house
        updatePublishingHouse: async (_root, { input }: { input: PublishingHouseEntity }, { user }) => {
            _checkUser(user);
            return updatePublishingHouse(input).catch(error => parseError(error));
        },
        createPublishingHouse: async (_root, { input }: { input: PublishingHouseEntity }, { user }) => {
            _checkUser(user);
            return createPublishingHouse(input).catch(error => parseError(error));
        },
        deletePublishingHouse: async (_root, { id }: { id: string }, { user }) => {
            _checkUser(user);
            return deletePublishingHouse(id).catch(error => parseError(error));
        },
        // page type
        updatePageType: async (_root, { input }: { input: PageTypeEntity }, { user }) => {
            _checkUser(user);
            return updatePageType(input).catch(error => parseError(error));
        },
        createPageType: async (_root, { input }: { input: PageTypeEntity }, { user }) => {
            _checkUser(user);
            return createPageType(input).catch(error => parseError(error));
        },
        deletePageType: async (_root, { id }: { id: string }, { user }) => {
            _checkUser(user);
            return deletePageType(id).catch(error => parseError(error));
        },
        // details type
        updateBookType: async (_root, { input }: { input: BookTypeEntity }, { user }) => {
            _checkUser(user);
            return updateBookType(input).catch(error => parseError(error));
        },
        createBookType: async (_root, { input }: { input: BookTypeEntity }, { user }) => {
            _checkUser(user);
            return createBookType(input).catch(error => parseError(error));
        },
        deleteBookType: async (_root, { id }: { id: string }, { user }) => {
            _checkUser(user);
            return deleteBookType(id).catch(error => parseError(error));
        },
        // cover type
        updateCoverType: (_root, { input }: { input: CoverTypeEntity }, { user }) => {
            _checkUser(user);
            return updateCoverType(input).catch(error => parseError(error));
        },
        createCoverType: async (_root, { input }: { input: CoverTypeEntity }, { user }) => {
            _checkUser(user);
            return createCoverType(input).catch(error => parseError(error));
        },
        deleteCoverType: async (_root, { id }: { id: string }, { user }) => {
            _checkUser(user);
            return deleteCoverType(id).catch(error => parseError(error));
        },
        // details series
        updateBookSeries: async (_root, { input }: { input: BookSeriesEntity }, { user }) => {
            _checkUser(user);
            return updateBookSeries(input).catch(error => parseError(error));
        },
        createBookSeries: async (_root, { input }: { input: BookSeriesEntity }, { user }) => {
            _checkUser(user);
            return createBookSeries(input).catch(error => parseError(error));
        },
        deleteBookSeries: async (_root, { id }: { id: string }, { user }) => {
            _checkUser(user);
            return deleteBookSeries(id).catch(error => parseError(error));
        },
        // author
        updateAuthor: async (_root, { input }: { input: AuthorEntity }, { user }) => {
            _checkUser(user);
            return updateAuthor(input).catch(error => parseError(error));
        },
        createAuthor: async (_root, { input }: { input: AuthorEntity }, { user }) => {
            _checkUser(user);
            return createAuthor(input).catch(error => parseError(error));
        },
        deleteAuthor: async (_root, { id }: { id: string }, { user }) => {
            _checkUser(user);
            return deleteAuthor(id).catch(error => parseError(error));
        },
        // details
        createBook: async (_root, { input }, { user }) => {
            _checkUser(user);
            return createBook(input).catch(error => parseError(error));
        },
        updateBook: async (_root, { input, updateAllBooksInSeries }, { user }) => {
            _checkUser(user);
            return updateBook(input, updateAllBooksInSeries).catch(error => parseError(error));
        },
        updateBookNumberInStock: async (_root, { input }, { user }) => {
            _checkUser(user);
            return updateBookNumberInStock(input).catch(error => parseError(error));
        },
        approveComment: async (_root, { input }: { input: { bookId: string, commentId: string } }, { user }) => {
            _checkUser(user);
            return approveComment(input).catch(error => parseError(error));
        },
        removeComment: async (_root, { input }: { input: { bookId: string, commentId: string } }, { user }) => {
            _checkUser(user);
            return removeComment(input).catch(error => parseError(error));
        },
        addBookComment: async (_root, { id, input }: { id: string, input: CommentEntity }) => {
            return addComment(id, input).catch(error => parseError(error));
        },
        createUser: async (_root, { input }: { input: UserEntity }) => {
            return createUser(input).catch(error => parseError(error));
        },
        likeBook: async (_root, { id }, { user }) => {
            _checkUser(user);
            return likeBook(user.id, id).catch(error => parseError(error));
        },
        unlikeBook: async (_root, { id }, { user }) => {
            _checkUser(user);
            return unlikeBook(user.id, id).catch(error => parseError(error));
        },
        changeRecentlyViewedBooks: async (_root, { id }, { user }) => {
            _checkUser(user);
            return changeRecentlyViewedBooks(user.id, id).catch(error => parseError(error));
        },
        addBookInBasket: async (_root, { id }, { user }) => {
            _checkUser(user);
            return addBookInBasket(user.id, id).catch(error => parseError(error));
        },
        removeBookInBasket: async (_root, { id }, { user }) => {
            _checkUser(user);
            return removeBookFromBasket(user.id, id).catch(error => parseError(error));
        },
        addGroupDiscountInBasket: async (_root, { id }, { user }) => {
            _checkUser(user);
            return addGroupDiscountInBasket(user.id, id).catch(error => parseError(error));
        },
        removeGroupDiscountFromBasket: async (_root, { id }, { user }) => {
            _checkUser(user);
            return removeGroupDiscountFromBasket(user.id, id).catch(error => parseError(error));
        },
        updateBookCountInBasket: async (_root, { id, count }, { user }) => {
            _checkUser(user);

            return updateBookCountInBasket(user.id, id, count).catch(error => parseError(error));
        },
        // auth
        activateUser: async (_root, { email }) => {
            return activateUser(email).catch(error => parseError(error));
        },
        sendUpdatePasswordLink: async (_root, { email }) => {
            return sendUpdatePasswordLink(email).catch(error => parseError(error));
        },
        changePasswordByToken: async (_root, { userId, password }) => {
            return changePasswordByToken(userId, password).catch(error => parseError(error));
        },
        changePassword: async (_root, { newPassword, password }, { user }) => {
            _checkUser(user);
            return changePassword(user.id, password, newPassword).catch(error => parseError(error));
        },
        user: async (_root, {}, { user }) => {
            _checkUser(user);

            return user;
        },
        updateUser: async (_root, { input }: { input: UserEntity }, { user }) => {
            _checkUser(user);
            return updateUser(input).catch(error => parseError(error));
        },
        // delivery
        updateDelivery: async (_root, { input }: { input: DeliveryEntity }, { user }) => {
            _checkUser(user);
            return updateDelivery(input).catch(error => parseError(error));
        },
        deleteDelivery: async (_root, { id }: { id: string }, { user }) => {
            _checkUser(user);
            return deleteDelivery(id).catch(error => parseError(error));
        },
        createDelivery: async (_root, { input }: { input: DeliveryEntity }, { user }) => {
            _checkUser(user);
            return createDelivery(input).catch(error => parseError(error));
        },
        // group discount
        updateGroupDiscount: async (_root, { input }: { input: GroupDiscountEntity }, { user }) => {
            _checkUser(user);
            return updateGroupDiscount(input).catch(error => parseError(error));
        },
        deleteGroupDiscount: async (_root, { id }: { id: string }, { user }) => {
            _checkUser(user);
            return deleteGroupDiscount(id).catch(error => parseError(error));
        },
        createGroupDiscount: async (_root, { input }: { input: GroupDiscountEntity }, { user }) => {
            _checkUser(user);
            return createGroupDiscount(input).catch(error => parseError(error));
        },
        updateGroupDiscountCountInBasket: async (_root, { id, count }, { user }) => {
            _checkUser(user);
            return updateGroupDiscountCountInBasket(user.id, id, count).catch(error => parseError(error));
        },
        // basket
        updateOrder: async (_root, { input }, { user }) => {
            _checkUser(user);
            return updateOrder(input as OrderEntity).catch(error => parseError(error));
        },
        cancelOrder: async (_root, { id }: { id: string }, { user }) => {
            _checkUser(user);
            return cancelOrder(id).catch(error => parseError(error));
        },
        createOrder: async (_root, { input }, { user }) => {
            _checkUser(user);
            return createOrder(input as OrderEntity).catch(error => parseError(error));
        }
    }
};

function _checkUser(user: UserEntity) {
    if (!user) {
        throw unauthorizedError('Missing authentication!');
    }
}

function unauthorizedError(message: string) {
    return new GraphQLError(message, {
        extensions: { code: 'UNAUTHORIZED' }
    });
}

export default resolvers;