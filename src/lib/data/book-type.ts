import { BookTypeEntity, IPageable } from '@/lib/data/types';
import { GraphQLError } from 'graphql/error';
import BookType from '@/lib/data/models/book-type';
import { checkUsageInBook, getByName, getValidFilters, getDataByFiltersAndPageSettings } from '@/lib/data/base';
import Author from '@/lib/data/models/author';

export async function getBookTypes(pageSettings?: IPageable, filters?: BookTypeEntity) {
    const { andFilters } = getValidFilters(filters);
    return getDataByFiltersAndPageSettings(
        BookType.find(),
        andFilters,
        pageSettings
    );
}

export async function createBookType(input: BookTypeEntity) {
    const item = await getByName<BookTypeEntity>(BookType, input.name);

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
        throw new GraphQLError(`Не вказан ідентифікатор.`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    const itemByName = await getByName<BookTypeEntity>(BookType, input.name);

    if (itemByName && itemByName.name.toLowerCase() === input.name.toLowerCase() && itemByName.id.toString() !== input.id) {
        throw new GraphQLError(`Тип книги з назвою '${input.name}' вже є.`, {
            extensions: { code: 'DUPLICATE_ERROR' }
        });
    }
    await BookType.findByIdAndUpdate(input.id, input);

    return input as BookTypeEntity;
}

export async function getBookTypeById(id: string) {
    if (!id) {
        throw new GraphQLError(`Не вказан ідентифікатор.`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }

    return BookType.findById(id);
}

export async function deleteBookType(id: string) {
    await checkUsageInBook('bookType', [id], 'Book Type');
    await BookType.findByIdAndDelete(id);

    return { id } as BookTypeEntity;
}
