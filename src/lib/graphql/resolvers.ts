import { Resolvers } from '@/lib/generated/core.graphql';
import { createLanguage, deleteLanguage, getLanguageById, getLanguages, updateLanguage } from '@/lib/data/language';
import {
    createPublishingHouse,
    deletePublishingHouse, getPublishingHouseById,
    getPublishingHouses,
    updatePublishingHouse
} from '@/lib/data/publishing-house';
import { createPageType, deletePageType, getPageTypes, updatePageType } from '@/lib/data/page-type';
import { createBookType, deleteBookType, getBookTypeById, getBookTypes, updateBookType } from '@/lib/data/book-type';
import { createCoverType, deleteCoverType, getCoverTypes, updateCoverType } from '@/lib/data/cover-type';
import {
    AuthorEntity,
    BookEntity,
    BookSeriesEntity,
    BookTypeEntity, CommentEntity,
    CoverTypeEntity,
    DeliveryEntity,
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
    getBookSeries, getBookSeriesById,
    getBookSeriesOptions,
    updateBookSeries
} from '@/lib/data/book-series';
import {
    addComment, approveComment,
    createBook,
    getBookById,
    getBookComments,
    getBooks, getBooksFromSeries, getBooksWithNotApprovedComments, removeComment,
    updateBook,
    updateBookNumberInStock
} from '@/lib/data/books';
import { createAuthor, deleteAuthor, getAuthorById, getAuthors, updateAuthor } from '@/lib/data/author';
import { GraphQLError } from 'graphql/error';
import { createUser, getNewToken, login, updateUser } from '@/lib/data/user';
import { createDelivery, deleteDelivery, getDeliveries, updateDelivery } from '@/lib/data/delivery';
import { createOrder, deleteOrder, getOrders, updateOrder } from '@/lib/data/order';

function parseError(error) {
    switch (error.extensions?.code) {
        case 'BAD_USER_INPUT':
        case 'GRAPHQL_PARSE_FAILED':
            throw new GraphQLError(error, {
                extensions: {
                    code: error.extensions?.code,
                    message: 'Something wrong with data.'
                }
            });
        case 'USAGE_ERROR':
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
                    message: 'Data is invalid.'
                }
            });
        }
        default: {
            throw new GraphQLError(error, {
                extensions: {
                    code: 'SOMETHING_BAD_HAPPENED',
                    message: 'Something went wrong.'
                }
            });
        }
    }
}

const resolvers: Resolvers = {
    Query: {
        languages: async (_root, { pageSettings, filters }) => {
            try {
                return getLanguages(<IPageable>pageSettings, <LanguageEntity>filters);
            } catch (error) {
                parseError(error);
            }
        },
        publishingHouses: async (_root, { pageSettings, filters }) => {
            try {
                return getPublishingHouses(<IPageable>pageSettings, <PublishingHouseEntity>filters);
            } catch (error) {
                parseError(error);
            }
        },
        pageTypes: async (_root, { pageSettings, filters }) => {
            try {
                return getPageTypes(<IPageable>pageSettings, <PageTypeEntity>filters);
            } catch (error) {
                parseError(error);
            }
        },
        bookTypes: async (_root, { pageSettings, filters }) => {
            try {
                return getBookTypes(<IPageable>pageSettings, <BookTypeEntity>filters);
            } catch (error) {
                parseError(error);
            }
        },
        coverTypes: async (_root, { pageSettings, filters }) => {
            try {
                return getCoverTypes(<IPageable>pageSettings, <CoverTypeEntity>filters);
            } catch (error) {
                parseError(error);
            }
        },
        authors: async (_root, { pageSettings, filters }) => {
            try {
                return getAuthors(<IPageable>pageSettings, <AuthorEntity>filters);
            } catch (error) {
                parseError(error);
            }
        },
        bookSeries: async (_root, { pageSettings, filters }) => {
            try {
                return getBookSeries(<IPageable>pageSettings, filters);
            } catch (error) {
                parseError(error);
            }
        },
        bookSeriesOptions: async (_root, { filters }) => {
            try {
                return getBookSeriesOptions(filters);
            } catch (error) {
                parseError(error);
            }
        },
        fullBookSeriesOptions: async (_root, { filters }) => {
            try {
                return getBookSeriesOptions(filters, true);
            } catch (error) {
                parseError(error);
            }
        },
        books: async (_root, { pageSettings, filters }) => {
            try {
                return getBooks(<IPageable>pageSettings, filters);
            } catch (error) {
                parseError(error);
            }
        },
        bookById: async (_root, { id }) => {
            try {
                return getBookById(id);
            } catch (error) {
                parseError(error);
            }
        },
        bookTypeById: async (_root, { id }) => {
            try {
                return getBookTypeById(id);
            } catch (error) {
                parseError(error);
            }
        },
        authorById: async (_root, { id }) => {
            try {
                return getAuthorById(id);
            } catch (error) {
                parseError(error);
            }
        },
        publishingHouseById: async (_root, { id }) => {
            try {
                return getPublishingHouseById(id);
            } catch (error) {
                parseError(error);
            }
        },
        languageById: async (_root, { id }) => {
            try {
                return getLanguageById(id);
            } catch (error) {
                parseError(error);
            }
        },
        bookSeriesByIdQuery: async (_root, { id }) => {
            try {
                return getBookSeriesById(id);
            } catch (error) {
                parseError(error);
            }
        },
        refreshToken: async (_root, { refreshToken }) => {
            try {
                return getNewToken(refreshToken);
            } catch (error) {
                parseError(error);
            }
        },
        deliveries: async (_root, { pageSettings, filters }) => {
            try {
                return getDeliveries(<IPageable>pageSettings, <DeliveryEntity>filters);
            } catch (error) {
                parseError(error);
            }
        },
        orders: async (_root, { pageSettings, filters }) => {
            try {
                return getOrders(<IPageable>pageSettings, <IOrderFilter>filters);
            } catch (error) {
                parseError(error);
            }
        },
        bookComments: async (_root, { id, page, rowsPerPage }) => {
            try {
                return getBookComments(id, page, rowsPerPage);
            } catch (error) {
                parseError(error);
            }
        },
        booksFromSeries: async (_root, { bookSeriesId }) => {
            try {
                return getBooksFromSeries(bookSeriesId);
            } catch (error) {
                parseError(error);
            }
        },
        booksWithNotApprovedComments: async (_root, { pageSettings }) => {
            try {
                return getBooksWithNotApprovedComments(<IPageable>pageSettings);
            } catch (error) {
                parseError(error);
            }
        },
    },
    Mutation: {
        updateLanguage: async (_root, { input }: { input: LanguageEntity }, { user }) => {
            _checkUser(user);
            try {
                return updateLanguage(input);
            } catch (error) {
                parseError(error);
            }
        },
        deleteLanguage: async (_root, { id }: { id: string }, { user }) => {
            _checkUser(user);
            try {
                return deleteLanguage(id);
            } catch (error) {
                parseError(error);
            }
        },
        createLanguage: async (_root, { input }: { input: LanguageEntity }, { user }) => {
            _checkUser(user);
            try {
                return createLanguage(input);
            } catch (error) {
                parseError(error);
            }
        },
        // publishing house
        updatePublishingHouse: async (_root, { input }: { input: PublishingHouseEntity }, { user }) => {
            _checkUser(user);
            try {
                return updatePublishingHouse(input);
            } catch (error) {
                parseError(error);
            }
        },
        createPublishingHouse: async (_root, { input }: { input: PublishingHouseEntity }, { user }) => {
            _checkUser(user);
            try {
                return createPublishingHouse(input);
            } catch (error) {
                parseError(error);
            }
        },
        deletePublishingHouse: async (_root, { id }: { id: string }, { user }) => {
            _checkUser(user);
            try {
                return deletePublishingHouse(id);
            } catch (error) {
                parseError(error);
            }
        },
        // page type
        updatePageType: async (_root, { input }: { input: PageTypeEntity }, { user }) => {
            _checkUser(user);
            try {
                return updatePageType(input);
            } catch (error) {
                parseError(error);
            }
        },
        createPageType: async (_root, { input }: { input: PageTypeEntity }, { user }) => {
            _checkUser(user);
            try {
                return createPageType(input);
            } catch (error) {
                parseError(error);
            }
        },
        deletePageType: async (_root, { id }: { id: string }, { user }) => {
            _checkUser(user);
            try {
                return deletePageType(id);
            } catch (error) {
                parseError(error);
            }
        },
        // details type
        updateBookType: async (_root, { input }: { input: BookTypeEntity }, { user }) => {
            _checkUser(user);
            try {
                return updateBookType(input);
            } catch (error) {
                parseError(error);
            }
        },
        createBookType: async (_root, { input }: { input: BookTypeEntity }, { user }) => {
            _checkUser(user);
            try {
                return createBookType(input);
            } catch (error) {
                parseError(error);
            }
        },
        deleteBookType: async (_root, { id }: { id: string }, { user }) => {
            _checkUser(user);
            try {
                return deleteBookType(id);
            } catch (error) {
                parseError(error);
            }
        },
        // cover type
        updateCoverType: (_root, { input }: { input: CoverTypeEntity }, { user }) => {
            _checkUser(user);
            try {
                return updateCoverType(input);
            } catch (error) {
                parseError(error);
            }
        },
        createCoverType: async (_root, { input }: { input: CoverTypeEntity }, { user }) => {
            _checkUser(user);
            try {
                return createCoverType(input);
            } catch (error) {
                parseError(error);
            }
        },
        deleteCoverType: async (_root, { id }: { id: string }, { user }) => {
            _checkUser(user);
            try {
                return deleteCoverType(id);
            } catch (error) {
                parseError(error);
            }
        },
        // details series
        updateBookSeries: async (_root, { input }: { input: BookSeriesEntity }, { user }) => {
            _checkUser(user);
            try {
                return updateBookSeries(input);
            } catch (error) {
                parseError(error);
            }
        },
        createBookSeries: async (_root, { input }: { input: BookSeriesEntity }, { user }) => {
            _checkUser(user);
            try {
                return createBookSeries(input);
            } catch (error) {
                parseError(error);
            }
        },
        deleteBookSeries: async (_root, { id }: { id: string }, { user }) => {
            _checkUser(user);
            try {
                return deleteBookSeries(id);
            } catch (error) {
                parseError(error);
            }
        },
        // author
        updateAuthor: async (_root, { input }: { input: AuthorEntity }, { user }) => {
            _checkUser(user);
            try {
                return updateAuthor(input);
            } catch (error) {
                parseError(error);
            }
        },
        createAuthor: async (_root, { input }: { input: AuthorEntity }, { user }) => {
            _checkUser(user);
            try {
                return createAuthor(input);
            } catch (error) {
                parseError(error);
            }
        },
        deleteAuthor: async (_root, { id }: { id: string }, { user }) => {
            _checkUser(user);
            try {
                return deleteAuthor(id);
            } catch (error) {
                parseError(error);
            }
        },
        // details
        createBook: async (_root, { input }: { input: BookEntity }, { user }) => {
            _checkUser(user);
            try {
                return createBook(input);
            } catch (error) {
                parseError(error);
            }
        },
        updateBook: async (_root, { input }: { input: BookEntity }, { user }) => {
            _checkUser(user);
            try {
                return updateBook(input);
            } catch (error) {
                parseError(error);
            }
        },
        updateBookNumberInStock: async (_root, { input }: {
            input: { id: string, numberInStock: number }
        }, { user }) => {
            _checkUser(user);
            try {
                return updateBookNumberInStock(input);
            } catch (error) {
                parseError(error);
            }
        },
        approveComment: async (_root, { input }: { input: { bookId: string, commentId: string } }, { user }) => {
            _checkUser(user);
            try {
                return approveComment(input);
            } catch (error) {
                parseError(error);
            }
        },
        removeComment: async (_root, { input }: { input: { bookId: string, commentId: string } }, { user }) => {
            _checkUser(user);
            try {
                return removeComment(input);
            } catch (error) {
                parseError(error);
            }
        },
        addBookComment: async (_root, { id, input }: { id: string, input: CommentEntity }) => {
            try {
                return addComment(id, input);
            } catch (error) {
                parseError(error);
            }
        },
        createUser: async (_root, { input }: { input: UserEntity }) => {
            try {
                return createUser(input);
            } catch (error) {
                parseError(error);
            }
        },
        // auth
        login: async (_root, { email, password }) => {
            try {
                return login(email, password);
            } catch (error) {
                parseError(error);
            }
        },
        user: async (_root, {}, { user }) => {
            _checkUser(user);
            try {
                return user;
            } catch (error) {
                parseError(error);
            }
        },
        updateUser: async (_root, { input }: { input: UserEntity }, { user }) => {
            _checkUser(user);
            try {
                return updateUser(input);
            } catch (error) {
                parseError(error);
            }
        },
        // delivery
        updateDelivery: async (_root, { input }: { input: DeliveryEntity }, { user }) => {
            _checkUser(user);
            try {
                return updateDelivery(input);
            } catch (error) {
                parseError(error);
            }
        },
        deleteDelivery: async (_root, { id }: { id: string }, { user }) => {
            _checkUser(user);
            try {
                return deleteDelivery(id);
            } catch (error) {
                parseError(error);
            }
        },
        createDelivery: async (_root, { input }: { input: DeliveryEntity }, { user }) => {
            _checkUser(user);
            try {
                return createDelivery(input);
            } catch (error) {
                parseError(error);
            }
        },
        // order
        updateOrder: async (_root, { input }: { input: OrderEntity }, { user }) => {
            _checkUser(user);
            try {
                return updateOrder(input);
            } catch (error) {
                parseError(error);
            }
        },
        deleteOrder: async (_root, { id }: { id: string }, { user }) => {
            _checkUser(user);
            try {
                return deleteOrder(id);
            } catch (error) {
                parseError(error);
            }
        },
        createOrder: async (_root, { input }: { input: OrderEntity }, { user }) => {
            _checkUser(user);
            try {
                return createOrder(input);
            } catch (error) {
                parseError(error);
            }
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