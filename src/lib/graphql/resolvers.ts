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
    CoverTypeEntity,
    LanguageEntity,
    PageTypeEntity,
    PublishingHouseEntity
} from '@/lib/data/types';
import {
    createBookSeries,
    deleteBookSeries,
    getBookSeries,
    getBookSeriesById,
    updateBookSeries
} from '@/lib/data/book-series';
import { createBook, deleteBook, getBooks, updateBook } from '@/lib/data/books';
import { createAuthor, deleteAuthor, getAuthorById, getAuthors, updateAuthor } from '@/lib/data/author';
import { GraphQLError } from 'graphql/error';

function parseError(error) {
    switch (error.extensions?.code) {
        case 'GRAPHQL_PARSE_FAILED': {
            throw new GraphQLError(error, {
                extensions: {
                    code: error.extensions?.code,
                    message: 'Something wrong with data.'
                }
            });
        }
        case 'USAGE_ERROR':
        case 'DUPLICATE_ERROR': {
            throw new GraphQLError(error, {
                extensions: {
                    code: error.extensions?.code,
                    message: error.message
                }
            });
        }
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
        languages: async (_root, { orderBy, order }) => {
            return getLanguages(orderBy || 'name', order || 'asc');
        },
        publishingHouses: async (_root, { orderBy, order }) => {
            return getPublishingHouses(orderBy || 'name', order || 'asc');
        },
        pageTypes: async (_root, { orderBy, order }) => {
            return getPageTypes(orderBy || 'name', order || 'asc');
        },
        bookTypes: async (_root, { orderBy, order }) => {
            return getBookTypes(orderBy || 'name', order || 'asc');
        },
        coverTypes: async (_root, { orderBy, order }) => {
            return getCoverTypes(orderBy || 'name', order || 'asc');
        },
        authors: async (_root, { orderBy, order }) => {
            return getAuthors(orderBy || 'name', order || 'asc');
        },
        bookSeries: async (_root, { orderBy, order, filters }) => {
            return getBookSeries(orderBy || 'name', order || 'asc', filters);
        },
        books: async (_root, { orderBy, order }) => {
            return getBooks(orderBy || 'name', order || 'asc');
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
        createPublishingHouse: async (_root, { input }: { input: PublishingHouseEntity}) => {
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
                parseError(error);;
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
        createBookSeries: async (_root, { input }: { input: BookSeriesEntity}) => {
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
                console.log(error);
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
    },
    BookSeries: {
        publishingHouse: item => !item.publishingHouse ? getPublishingHouseById(item.publishingHouseId) : item.publishingHouse
    },
    Book: {
        bookSeries: item => !item.bookSeries ? getBookSeriesById(item.bookSeriesId) : item.bookSeries,
        language: item => !item.language ? getLanguageById(item.languageId) : item.language,
        coverType: item => !item.coverType ? getCoverTypeById(item.coverTypeId) : item.coverType,
        pageType: item => !item.pageType ? getPageTypeById(item.pageTypeId) : item.pageType,
        bookType: item => !item.bookType ? getBookTypeById(item.bookTypeId) : item.bookType,
        author: item => !item.author ? (item.authorId ? getAuthorById(item.authorId) : null) : item.author,
    }
};

export default resolvers;