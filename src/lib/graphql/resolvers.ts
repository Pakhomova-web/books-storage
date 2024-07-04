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
                    code: 'SOMETHING_BAD_HAPPENED',
                    message: 'Something wrong with data.'
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
            return await getLanguages(orderBy || 'name', order || 'asc');
        },
        publishingHouses: async (_root, { orderBy, order }) => {
            return await getPublishingHouses(orderBy || 'name', order || 'asc');
        },
        pageTypes: async (_root, { orderBy, order }) => {
            return await getPageTypes(orderBy || 'name', order || 'asc');
        },
        bookTypes: async (_root, { orderBy, order }) => {
            return await getBookTypes(orderBy || 'name', order || 'asc');
        },
        coverTypes: async (_root, { orderBy, order }) => {
            return await getCoverTypes(orderBy || 'name', order || 'asc');
        },
        authors: async (_root, { orderBy, order }) => {
            return await getAuthors(orderBy || 'name', order || 'asc');
        },
        bookSeries: async (_root, { orderBy, order, filters }) => {
            return await getBookSeries(orderBy || 'name', order || 'asc', filters);
        },
        books: async (_root, { orderBy, order }) => {
            return await getBooks(orderBy || 'name', order || 'asc');
        }
    },
    Mutation: {
        updateLanguage: async (_root, { input }: { input: LanguageEntity }) => {
            return await updateLanguage(input);
        },
        deleteLanguage: async (_root, { id }: { id: string }) => {
            return await deleteLanguage(id);
        },
        createLanguage: async (_root, { input }) => {
            return await createLanguage(input);
        },
        // publishing house
        updatePublishingHouse: async (_root, { input }: { input: PublishingHouseEntity }) => {
            return await updatePublishingHouse(input);
        },
        createPublishingHouse: async (_root, { input }) => {
            return await createPublishingHouse(input);
        },
        deletePublishingHouse: async (_root, { id }: { id: string }) => {
            return await deletePublishingHouse(id);
        },
        // page type
        updatePageType: async (_root, { input }: { input: PageTypeEntity }) => {
            return await updatePageType(input);
        },
        createPageType: async (_root, { input }) => {
            return await createPageType(input);
        },
        deletePageType: async (_root, { id }: { id: string }) => {
            return await deletePageType(id);
        },
        // book type
        updateBookType: async (_root, { input }: { input: BookTypeEntity }) => {
            return await updateBookType(input);
        },
        createBookType: async (_root, { input }) => {
            return await createBookType(input);
        },
        deleteBookType: async (_root, { id }: { id: string }) => {
            return await deleteBookType(id);
        },
        // cover type
        updateCoverType: async (_root, { input }: { input: CoverTypeEntity }) => {
            return await updateCoverType(input);
        },
        createCoverType: async (_root, { input }) => {
            return await createCoverType(input);
        },
        deleteCoverType: async (_root, { id }: { id: string }) => {
            return await deleteCoverType(id);
        },
        // book series
        updateBookSeries: async (_root, { input }: { input: BookSeriesEntity }) => {
            return await updateBookSeries(input);
        },
        createBookSeries: async (_root, { input }) => {
            return await createBookSeries(input);
        },
        deleteBookSeries: async (_root, { id }: { id: string }) => {
            return await deleteBookSeries(id);
        },
        // author
        updateAuthor: async (_root, { input }: { input: AuthorEntity }) => {
            return await updateAuthor(input);
        },
        createAuthor: async (_root, { input }) => {
            return await createAuthor(input);
        },
        deleteAuthor: async (_root, { id }: { id: string }) => {
            return await deleteAuthor(id);
        },
        // book
        createBook: async (_root, { input }) => {
            try {
                return await createBook(input);
            } catch (error) {
                parseError(error)
            }
        },
        updateBook: async (_root, { input }) => {
            try {
                return await updateBook(input);
            } catch (error) {
                parseError(error);
            }
        },
        deleteBook: async (_root, { id }: { id: string }) => {
            return await deleteBook(id);
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