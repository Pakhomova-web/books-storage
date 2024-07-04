import { connection } from '@/lib/data/connection';
import { AuthorEntity, BookEntity } from '@/lib/data/types';
import { GraphQLError } from 'graphql/error';

export const getBookTable = () => connection().table<BookEntity>('book');

export async function getBooks(orderBy?: string, order?: string) {
    return getBookTable().select(
        'book.id as id',
        'book.name as name',
        'price',
        'bookSeriesId',
        'pageTypeId',
        'bookTypeId',
        'numberInStock',
        'numberOfPages',
        'format',
        'isbn',
        'book.description as description',
        'languageId',
        'coverTypeId',
        'authorId'
    )
        .join('bookSeries as bookSeries', 'book.bookSeriesId', '=', 'bookSeries.id')
        .join('language as language', 'book.languageId', '=', 'language.id')
        .join('coverType as coverType', 'book.coverTypeId', '=', 'coverType.id')
        // .join('author as author', 'book.authorId', '=', 'author.id')
        .join('bookType as bookType', 'book.bookTypeId', '=', 'bookType.id')
        .join('pageType as pageType', 'book.pageTypeId', '=', 'pageType.id')
        .orderBy(orderBy, order);
}

export async function createBook(input: {
    name,
    price?,
    description?,
    isbn?,
    format?,
    numberInStock?,
    numberOfPages,
    bookSeriesId,
    languageId,
    bookTypeId,
    pageTypeId,
    coverTypeId,
    authorId?
}) {
    await getBookTable().insert(input);

    return input as BookEntity;
}

export async function updateBook(input: {
    id,
    name,
    price?,
    description?,
    isbn?,
    format?,
    numberInStock?,
    numberOfPages,
    bookSeriesId,
    languageId,
    bookTypeId,
    pageTypeId,
    coverTypeId,
    authorId?
}) {
    const dataToUpdate = { ...input, languageId: null };

    delete dataToUpdate.id;
    await getBookTable().update(dataToUpdate).where({ id: input.id });

    return input as BookEntity;
}

export async function deleteBook(id: string) {
    await getBookTable().delete().where({ id });

    return { id } as BookEntity;
}
