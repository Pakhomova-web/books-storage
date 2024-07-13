import { BookEntity, IPageable } from '@/lib/data/types';
import Book from '@/lib/data/models/book';
import { GraphQLError } from 'graphql/error';

export async function getBooks(pageSettings: IPageable, filters?: Partial<BookEntity>): Promise<{ items: BookEntity[], totalCount: number }> {
    let validFilters: { [key: string]: string | RegExp } = {};

    if (filters) {
        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                if (key === 'name') {
                    validFilters.name = new RegExp(filters.name, "i");
                } else {
                    validFilters[key] = filters[key];
                }
            }
        });
    }

    const items = await Book.find(validFilters, null, {
        sort: { [pageSettings.orderBy || 'name']: pageSettings.order },
        skip: pageSettings.rowsPerPage * pageSettings.page,
        limit: pageSettings.rowsPerPage
    });
    const totalCount = await Book.count(validFilters);

    return { items, totalCount };
}

export async function createBook(input: BookEntity) {
    const item = await _getBookByUnique(input.name, input.bookSeriesId, input.bookTypeId);

    if (item) {
        return null;
    } else {
        const item = new Book(input);

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
    await Book.findOneAndUpdate({ _id: input.id }, input);

    return input as BookEntity;
}

export async function deleteBook(id: string) {
    await Book.findByIdAndDelete(id);

    return { id } as BookEntity;
}

function _getBookByUnique(name: string, bookSeriesId: string, bookTypeId: string) {
    return Book.findOne({
        name: new RegExp(`^${name}$`, "i"),
        bookSeriesId,
        bookTypeId
    });
}