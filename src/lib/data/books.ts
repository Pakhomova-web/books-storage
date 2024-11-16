import { BookEntity, BookFilter, CommentEntity, IPageable } from '@/lib/data/types';
import Book from '@/lib/data/models/book';
import { GraphQLError } from 'graphql/error';
import { getValidFilters } from '@/lib/data/base';
import BookSeries from '@/lib/data/models/book-series';

export async function getBooks(pageSettings?: IPageable, filters?: BookFilter): Promise<{
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
        .populate('authors')
        .sort({ numberInStock: 'desc' })
        .sort({ [pageSettings?.orderBy || 'name']: pageSettings?.order || 'asc' });

    let res = { items: [], totalCount: 0 };

    await query.exec().then((items: BookEntity[]) => {
        if (quickSearch) {
            items = items.filter(({ authors, name, bookSeries, bookType, tags }) =>
                quickSearch.test(name) ||
                (authors?.length && authors.some(author => quickSearch.test(author.name))) ||
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

export async function getBookById(id: string) {
    const item = await Book.findById(id)
        .populate('language')
        .populate('bookType')
        .populate('authors')
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
    const item = await _getBookByUnique(input.name, input.bookSeriesId, input.bookTypeId, input.pageTypeId, input.coverTypeId, input.languageId);

    if (item) {
        return null;
    } else {
        const item = new Book(_getBookData(input));

        await item.save();

        return { ...input, id: item.id } as BookEntity;
    }
}

export async function updateBook(input: BookEntity, updateAllBooksInSeries = false) {
    if (!input.id) {
        throw new GraphQLError(`No Book found with id ${input.id}`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    const itemByName = await _getBookByUnique(input.name, input.bookSeriesId, input.bookTypeId, input.pageTypeId, input.coverTypeId, input.languageId);

    if (itemByName && itemByName.name.toLowerCase() === input.name.toLowerCase() && itemByName.id.toString() !== input.id) {
        throw new GraphQLError(`Book with name '${input.name}' already exists.`, {
            extensions: { code: 'DUPLICATE_ERROR' }
        });
    }

    if (updateAllBooksInSeries) {
        const itemsBySeries = await Book.find({ bookSeries: input.bookSeriesId });

        await Promise.all(itemsBySeries.map(item => {
            item.format = input.format;
            item.description = input.description;
            item.ages = input.ages;
            item.tags = input.tags;
            item.authors = input.authorIds;

            return item.save();
        }));
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

export async function approveComment(input: { bookId: string, commentId: string }) {
    if (!input.bookId) {
        throw new GraphQLError(`No Book found with id ${input.bookId}`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    const book = await Book.findById(input.bookId);

    book.comments.find(c => c.id === input.commentId).approved = true;
    await book.save();

    return { ...book, comments: book.comments.filter(c => !c.approved) } as BookEntity;
}

export async function removeComment(input: { bookId: string, commentId: string }) {
    if (!input.bookId) {
        throw new GraphQLError(`No Book found with id ${input.bookId}`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    const book = await Book.findById(input.bookId);

    if (!book) {
        throw new GraphQLError(`No Book found with id ${input.bookId}`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }

    book.comments = book.comments.filter(c => c.id !== input.commentId);
    await book.save();

    return { ...book, comments: book.comments.filter(c => !c.approved) } as BookEntity;
}

export async function addComment(id: string, input: CommentEntity) {
    if (!id) {
        throw new GraphQLError(`No Book found with id ${id}`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    const book = await Book.findById(id);

    book.comments.push(input);
    await book.save();

    return book as BookEntity;
}

function _getBookByUnique(name: string, bookSeries: string, bookType: string, pageType: string, coverType: string, language: string) {
    return Book.findOne({
        name: new RegExp(`^${name}$`, "i"),
        bookSeries,
        bookType,
        pageType,
        coverType,
        language
    });
}

export async function getBookComments(id: string, page: number, rowsPerPage: number) {
    if (!id) {
        throw new GraphQLError(`No Book found with id ${id}`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }

    const book = await Book.findById(id);

    if (!book) {
        throw new GraphQLError(`No Book found with id ${id}`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }

    return book.comments.splice(rowsPerPage * page, rowsPerPage);
}

export async function getBooksFromSeries(bookSeriesId: string) {
    if (!bookSeriesId) {
        throw new GraphQLError(`No Books found`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }

    return Book
        .find({ bookSeries: bookSeriesId, archived: { $in: [false, null] } })
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
        .populate('authors')
        .sort({ numberInStock: 'desc' });
}

export async function getBooksByAuthor(authorId: string, rowsPerPage: number, excludeBookSeriesId?: string) {
    if (!authorId) {
        throw new GraphQLError(`No Books found`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }

    return Book
        .find({
            authors: authorId,
            archived: { $in: [false, null] },
            ...(excludeBookSeriesId ? { bookSeries: { $ne: excludeBookSeriesId } } : {})
        })
        .sort({ numberInStock: 'desc' })
        .limit(rowsPerPage)
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
        .populate('authors');
}

export async function getBooksByIds(ids: string[]) {
    if (!ids?.length) {
        return [];
    }

    return Book
        .find({ _id: ids, archived: { $in: [false, null] } })
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
        .populate('authors')
        .sort({ bookSeries: 'desc', numberInStock: 'desc' });
}

export async function getBooksWithDiscounts(rowsPerPage: number) {
    return Book
        .find({ discount: { $gt: 0 }, archived: { $in: [false, null] } })
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
        .populate('authors')
        .limit(rowsPerPage);
}

export async function getBooksWithNotApprovedComments(pageSettings?: IPageable) {
    const query = Book
        .find()
        .and([{ archived: { $in: [null, false] } }])
        .populate('bookType')
        .populate({
            path: 'bookSeries',
            populate: {
                path: 'publishingHouse'
            }
        });
    let res = { items: [], totalCount: 0 };

    await query.exec().then((items: BookEntity[]) => {
        const startIndex = pageSettings.page * pageSettings.rowsPerPage;

        items = items.filter(i => {
            i.comments = i.comments.filter(({ approved }) => !approved);

            return !!i.comments.length;
        });

        res = { items: items.slice(startIndex, startIndex + pageSettings.rowsPerPage), totalCount: items.length };
    });

    return res;
}

function _getBookData(input: BookEntity) {
    return {
        ...input,
        authors: input.authorIds,
        language: input.languageId,
        bookSeries: input.bookSeriesId,
        coverType: input.coverTypeId,
        pageType: input.pageTypeId,
        bookType: input.bookTypeId
    };
}
