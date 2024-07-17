import { BookEntity, IBookFilter, IPageable } from '@/lib/data/types';
import Book from '@/lib/data/models/book';
import { GraphQLError } from 'graphql/error';
import { getValidFilters } from '@/lib/data/base';

export async function getBooks(pageSettings?: IPageable, filters?: IBookFilter): Promise<{
    items: BookEntity[],
    totalCount: number
}> {
    const validFilters = getValidFilters(filters);

    const items = await Book
        .find(validFilters, null, pageSettings ? {
            skip: pageSettings.rowsPerPage * pageSettings.page,
            limit: pageSettings.rowsPerPage
        } : null)
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
        .sort({ [pageSettings.orderBy || 'name']: pageSettings.order });
    const totalCount = await Book.count(validFilters);

    return { items, totalCount };
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
        throw new GraphQLError(`No Publishing House found with id ${input.id}`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    const itemByName = await _getBookByUnique(input.name, input.bookSeriesId, input.bookTypeId);

    if (itemByName && itemByName.id.toString() !== input.id) {
        throw new GraphQLError(`Publishing House with name '${input.name}' already exists.`, {
            extensions: { code: 'DUPLICATE_ERROR' }
        });
    }
    await Book.findByIdAndUpdate(input.id, _getBookData(input));

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
