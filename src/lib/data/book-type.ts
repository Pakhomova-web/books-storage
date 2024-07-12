import { BookTypeEntity } from '@/lib/data/types';
import { GraphQLError } from 'graphql/error';
import BookType from '@/lib/data/models/book-type';
import { checkUsageInBook, getByName } from '@/lib/data/base';
import BookSeries from '@/lib/data/models/book-series';
import Book from '@/lib/data/models/book';

export async function getBookTypes(orderBy: string, order: string) {
    return BookType.find(null, null, { sort: { [orderBy]: order } });
}

export async function createBookType(input: BookTypeEntity)  {
    const item = await getByName(BookSeries, input.name);

    if (item) {
        return null;
    } else {
        const item = new BookType(input);

        await item.save();

        return { ...input, id: item.id } as BookTypeEntity;
    }
}

export async function updateBookType(input: BookTypeEntity) {
    if (!input.id) {
        throw new GraphQLError(`No Book Type found with id ${input.id}`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    const itemByName = await getByName(BookType, input.name);

    if (itemByName && itemByName.id.toString() !== input.id) {
        throw new GraphQLError(`Book Type with name '${input.name}' already exists.`, {
            extensions: { code: 'DUPLICATE_ERROR' }
        });
    }
    await BookType.findOneAndUpdate({ _id: input.id }, input);

    return input as BookTypeEntity;
}

export async function getBookTypeById(id: string) {
    return BookType.findById(id);
}

export async function deleteBookType(id: string) {
    await checkUsageInBook('bookTypeId', [id], 'Book Type');
    await BookType.findByIdAndDelete(id);

    return { id } as BookTypeEntity;
}
