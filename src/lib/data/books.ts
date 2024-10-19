import { BookEntity, IBookFilter, IPageable } from '@/lib/data/types';
import Book from '@/lib/data/models/book';
import { GraphQLError } from 'graphql/error';
import { getValidFilters } from '@/lib/data/base';
import BookSeries from '@/lib/data/models/book-series';

export async function getBooks(pageSettings?: IPageable, filters?: IBookFilter): Promise<{
    items: BookEntity[],
    totalCount: number
}> {
    const { quickSearch, andFilters } = getValidFilters(filters);
    const indexFilterByPublishingHouse = andFilters.findIndex(filter => filter.publishingHouse);

    if (indexFilterByPublishingHouse !== -1) {
        const bookSeries = await BookSeries.find(andFilters[indexFilterByPublishingHouse], 'id');

        if (bookSeries.length) {
            andFilters.push({ bookSeries: bookSeries.map(bookSeries => bookSeries.id) });
        }
        andFilters.splice(indexFilterByPublishingHouse, 1);
    }

    const query = Book.find();

    if (andFilters?.length) {
        query.and(andFilters);
    }

    query
        .populate({
            path: 'bookSeries',
            populate: {
                path: 'publishingHouse'
            }
        })
        .populate('bookType')
        .populate('pageType')
        .populate('coverType')
        .populate('language')
        .populate('author')
        .sort({ [pageSettings?.orderBy || 'name']: pageSettings?.order || 'asc' });

    let res = { items: [], totalCount: 0 };

    await query.exec().then((items: BookEntity[]) => {
        if (quickSearch) {
            items = items.filter(({ author, name, bookSeries, bookType, tags }) =>
                quickSearch.test(name) ||
                (author && quickSearch.test(author.name)) ||
                quickSearch.test(bookType.name) ||
                quickSearch.test(bookSeries.name) ||
                quickSearch.test(bookSeries.publishingHouse.name) ||
                tags?.some(tag => quickSearch.test(tag))
            );
        }
        const totalCount = items.length;

        if (pageSettings) {
            const startIndex = pageSettings.rowsPerPage * pageSettings.page;

            items = items.slice(startIndex, startIndex + pageSettings.rowsPerPage);
        }

        res = { items, totalCount };
    });

    return res;
}

export function getBookById(id: string) {
    const item = Book.findById(id)
        .populate('language')
        .populate('bookType')
        .populate('author')
        .populate({
            path: 'bookSeries',
            populate: {
                path: 'publishingHouse'
            }
        })
        .populate('pageType')
        .populate('coverType');

    if (!item) {
        throw new GraphQLError(`No Book found with id ${id}`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }

    return item;
}

export async function createBook(input: BookEntity) {
    const item = await _getBookByUnique(input.name, input.bookSeriesId, input.bookTypeId);

    if (item) {
        return null;
    } else {
        const item = new Book(_getBookData(input));

        await item.save();

        return { ...input, id: item.id } as BookEntity;
    }
}

export async function updateBook(input: BookEntity) {
    if (!input.id) {
        throw new GraphQLError(`No Book found with id ${input.id}`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    const itemByName = await _getBookByUnique(input.name, input.bookSeriesId, input.bookTypeId);

    if (itemByName && itemByName.id.toString() !== input.id) {
        throw new GraphQLError(`Book with name '${input.name}' already exists.`, {
            extensions: { code: 'DUPLICATE_ERROR' }
        });
    }
    await Book.findByIdAndUpdate(input.id, _getBookData(input));

    return { id: input.id } as BookEntity;
}

export async function updateBookNumberInStock(input: { id: string, numberInStock: number }) {
    if (!input.id) {
        throw new GraphQLError(`No Book found with id ${input.id}`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    await Book.findByIdAndUpdate(input.id, { numberInStock: input.numberInStock });

    return input as BookEntity;
}

export async function deleteBook(id: string) {
    await Book.findByIdAndDelete(id);

    return { id } as BookEntity;
}

function _getBookByUnique(name: string, bookSeries: string, bookType: string) {
    return Book.findOne({
        name: new RegExp(`^${name}$`, "i"),
        bookSeries,
        bookType
    });
}

function _getBookData(input: BookEntity) {
    return {
        ...input,
        author: input.authorId,
        language: input.languageId,
        bookSeries: input.bookSeriesId,
        coverType: input.coverTypeId,
        pageType: input.pageTypeId,
        bookType: input.bookTypeId
    };
}
