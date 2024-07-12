import { BookEntity, PublishingHouseEntity } from '@/lib/data/types';
import Book from '@/lib/data/models/book';
import { GraphQLError } from 'graphql/error';

export async function getBooks(orderBy?: string, order?: string) {
    return Book.find(null, null, { sort: { [orderBy]: order } });

    // return getBookTable().select(
    //     'book.id as id',
    //     'book.name as name',
    //     'price',
    //     'bookSeriesId',
    //     'pageTypeId',
    //     'bookTypeId',
    //     'numberInStock',
    //     'numberOfPages',
    //     'format',
    //     'isbn',
    //     'book.description as description',
    //     'languageId',
    //     'coverTypeId',
    //     'authorId'
    // )
    //     .join('bookSeries as bookSeries', 'book.bookSeriesId', '=', 'bookSeries.id')
    //     .join('language as language', 'book.languageId', '=', 'language.id')
    //     .join('coverType as coverType', 'book.coverTypeId', '=', 'coverType.id')
    //     // .join('author as author', 'book.authorId', '=', 'author.id')
    //     .join('bookType as bookType', 'book.bookTypeId', '=', 'bookType.id')
    //     .join('pageType as pageType', 'book.pageTypeId', '=', 'pageType.id')
    //     .orderBy(orderBy, order);
}

export async function createBook(input: BookEntity) {
    const item = await _getBookByUnique(input.name, input.bookSeriesId, input.bookTypeId);

    if (item) {
        return null;
    } else {
        const item = new Book(input);

        await item.save();

        return item as BookEntity;
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