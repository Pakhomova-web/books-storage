import { Resolvers } from '@/lib/generated/core.graphql';
import { createLanguage, deleteLanguage, getLanguageById, getLanguages, updateLanguage } from '@/lib/data/language';
import {
    createPublishingHouse,
    deletePublishingHouse,
    getPublishingHouseById,
    getPublishingHouses,
    updatePublishingHouse
} from '@/lib/data/publishing-house';
import { createPageType, deletePageType, getPageTypeById, getPageTypes, updatePageType } from '@/lib/data/page-type';
import { createBookType, deleteBookType, getBookTypeById, getBookTypes, updateBookType } from '@/lib/data/book-type';
import {
    createCoverType,
    deleteCoverType,
    getCoverTypeById,
    getCoverTypes,
    updateCoverType
} from '@/lib/data/cover-type';
import {
    AuthorEntity,
    BookEntity,
    BookSeriesEntity,
    BookTypeEntity,
    CoverTypeEntity, IPageable,
    LanguageEntity,
    PageTypeEntity,
    PublishingHouseEntity
} from '@/lib/data/types';
import {
    createBookSeries,
    deleteBookSeries,
    getBookSeries,
    getBookSeriesById, getBookSeriesOptions,
    updateBookSeries
} from '@/lib/data/book-series';
import { createBook, deleteBook, getBooks, updateBook } from '@/lib/data/books';
import { createAuthor, deleteAuthor, getAuthorById, getAuthors, updateAuthor } from '@/lib/data/author';
import { GraphQLError } from 'graphql/error';

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
        books: async (_root, { pageSettings, filters }) => {
            try {
                return getBooks(<IPageable>pageSettings, filters);
            } catch (error) {
                parseError(error);
            }
        }
    },
    Mutation: {
        updateLanguage: async (_root, { input }: { input: LanguageEntity }) => {
            try {
                return updateLanguage(input);
            } catch (error) {
                parseError(error);
            }
        },
        deleteLanguage: async (_root, { id }: { id: string }) => {
            try {
                return deleteLanguage(id);
            } catch (error) {
                parseError(error);
            }
        },
        createLanguage: async (_root, { input }: { input: LanguageEntity }) => {
            try {
                return createLanguage(input);
            } catch (error) {
                parseError(error);
            }
        },
        // publishing house
        updatePublishingHouse: async (_root, { input }: { input: PublishingHouseEntity }) => {
            try {
                return updatePublishingHouse(input);
            } catch (error) {
                parseError(error);
            }
        },
        createPublishingHouse: async (_root, { input }: { input: PublishingHouseEntity }) => {
            try {
                return createPublishingHouse(input);
            } catch (error) {
                parseError(error);
            }
        },
        deletePublishingHouse: async (_root, { id }: { id: string }) => {
            try {
                return deletePublishingHouse(id);
            } catch (error) {
                parseError(error);
            }
        },
        // page type
        updatePageType: async (_root, { input }: { input: PageTypeEntity }) => {
            try {
                return updatePageType(input);
            } catch (error) {
                parseError(error);
            }
        },
        createPageType: async (_root, { input }: { input: PageTypeEntity }) => {
            try {
                return createPageType(input);
            } catch (error) {
                parseError(error);
            }
        },
        deletePageType: async (_root, { id }: { id: string }) => {
            try {
                return deletePageType(id);
            } catch (error) {
                parseError(error);
            }
        },
        // book type
        updateBookType: async (_root, { input }: { input: BookTypeEntity }) => {
            try {
                return updateBookType(input);
            } catch (error) {
                parseError(error);
            }
        },
        createBookType: async (_root, { input }: { input: BookTypeEntity }) => {
            try {
                return createBookType(input);
            } catch (error) {
                parseError(error);
            }
        },
        deleteBookType: async (_root, { id }: { id: string }) => {
            try {
                return deleteBookType(id);
            } catch (error) {
                parseError(error);
            }
        },
        // cover type
        updateCoverType: (_root, { input }: { input: CoverTypeEntity }) => {
            try {
                return updateCoverType(input);
            } catch (error) {
                parseError(error);
            }
        },
        createCoverType: async (_root, { input }: { input: CoverTypeEntity }) => {
            try {
                return createCoverType(input);
            } catch (error) {
                parseError(error);
            }
        },
        deleteCoverType: async (_root, { id }: { id: string }) => {
            try {
                return deleteCoverType(id);
            } catch (error) {
                parseError(error);
            }
        },
        // book series
        updateBookSeries: async (_root, { input }: { input: BookSeriesEntity }) => {
            try {
                return updateBookSeries(input);
            } catch (error) {
                parseError(error);
            }
        },
        createBookSeries: async (_root, { input }: { input: BookSeriesEntity }) => {
            try {
                return createBookSeries(input);
            } catch (error) {
                parseError(error);
            }
        },
        deleteBookSeries: async (_root, { id }: { id: string }) => {
            try {
                return deleteBookSeries(id);
            } catch (error) {
                parseError(error);
            }
        },
        // author
        updateAuthor: async (_root, { input }: { input: AuthorEntity }) => {
            try {
                return updateAuthor(input);
            } catch (error) {
                parseError(error);
            }
        },
        createAuthor: async (_root, { input }: { input: AuthorEntity }) => {
            try {
                return createAuthor(input);
            } catch (error) {
                parseError(error);
            }
        },
        deleteAuthor: async (_root, { id }: { id: string }) => {
            try {
                return deleteAuthor(id);
            } catch (error) {
                parseError(error);
            }
        },
        // book
        createBook: async (_root, { input }: { input: BookEntity }) => {
            try {
                return createBook(input);
            } catch (error) {
                parseError(error);
            }
        },
        updateBook: async (_root, { input }: { input: BookEntity }) => {
            try {
                return updateBook(input);
            } catch (error) {
                parseError(error);
            }
        },
        deleteBook: async (_root, { id }: { id: string }) => {
            try {
                return deleteBook(id);
            } catch (error) {
                parseError(error);
            }
        }
    }
};

export default resolvers;