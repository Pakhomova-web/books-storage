import { BookEntity } from '@/lib/data/types';
import Book from '@/lib/data/models/book';
import { GraphQLError } from 'graphql/error';

export function getBooks(orderBy?: string, order?: string, filters?: Partial<BookEntity>) {
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
    return Book.find(validFilters, null, { sort: { [orderBy]: order } });
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