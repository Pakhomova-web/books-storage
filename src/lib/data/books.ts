import { BookEntity, BookFilter, CommentEntity, IPageable } from '@/lib/data/types';
import Book from '@/lib/data/models/book';
import { GraphQLError } from 'graphql/error';
import { getCaseInsensitiveSubstringOption, getValidFilters } from '@/lib/data/base';
import BookSeries from '@/lib/data/models/book-series';
import Balance from '@/lib/data/models/balance';

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
        .populate('bookTypes')
        .populate('pageType')
        .populate('coverType')
        .populate('language')
        .populate('authors')
        .populate('illustrators')
        .sort({ [pageSettings?.orderBy || 'name']: pageSettings?.order || 'asc' });

    let res = { items: [], totalCount: 0 };

    await query.exec().then((items: BookEntity[]) => {
        if (quickSearch) {
            items = items.filter(
                ({ authors, name, bookSeries, bookTypes, tags, illustrators, language, description }) =>
                    quickSearch.test(name) ||
                    (authors?.length && authors.some(author => quickSearch.test(author.name))) ||
                    (illustrators?.length && illustrators.some(illustrator => quickSearch.test(illustrator.name))) ||
                    (bookTypes?.length && bookTypes.some(bookType => quickSearch.test(bookType.name))) ||
                    quickSearch.test(bookSeries.name) ||
                    quickSearch.test(bookSeries.description) ||
                    quickSearch.test(language.name) ||
                    quickSearch.test(description) ||
                    quickSearch.test(bookSeries.publishingHouse.name) ||
                    tags?.some(tag => quickSearch.test(tag))
            );
        }
        if (pageSettings?.orderBy === 'priceWithDiscount') {
            items.sort((a, b) => {
                if (a.price * (100 - (a.discount || 0)) > b.price * (100 - (b.discount || 0))) {
                    return pageSettings.order === 'asc' ? 1 : -1;
                } else {
                    return pageSettings.order === 'asc' ? -1 : 1;
                }
            });
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
        .populate('bookTypes')
        .populate('authors')
        .populate('illustrators')
        .populate({
            path: 'bookSeries',
            populate: {
                path: 'publishingHouse'
            }
        })
        .populate('pageType')
        .populate('coverType');

    if (!item) {
        throw new GraphQLError(`Не знайдено такої книги.`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }

    return item;
}

export async function createBook(input: Partial<BookEntity>) {
    const item = await _getBookByUnique(input.name, input.bookSeriesId, input.bookTypeIds, input.pageTypeId, input.coverTypeId, input.languageId);

    if (item) {
        return null;
    } else {
        const item = new Book(_getBookData(input));
        const balance = await Balance.findOne();

        if (item.numberInStock) {
            if (balance) {
                balance.value = balance.value - item.numberInStock * item.price;
                await balance.save();
            } else {
                await Balance.create({ value: -1 * item.numberInStock * item.price });
            }
        }
        await item.save();

        return { ...input, id: item.id } as BookEntity;
    }
}

export async function updateBook(input: Partial<BookEntity>, updateAllBooksInSeries = false) {
    if (!input.id) {
        throw new GraphQLError(`Не вказан ідентифікатор.`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    const itemByName = await _getBookByUnique(input.name, input.bookSeriesId, input.bookTypeIds, input.pageTypeId, input.coverTypeId, input.languageId);

    if (itemByName && itemByName.name.toLowerCase() === input.name.toLowerCase() && itemByName.id.toString() !== input.id) {
        throw new GraphQLError(`Книга з назвою '${input.name}' вже є.`, {
            extensions: { code: 'DUPLICATE_ERROR' }
        });
    }

    if (updateAllBooksInSeries) {
        const itemsBySeries = await Book.find({ bookSeries: input.bookSeriesId });

        await Promise.all(itemsBySeries.map(item => {
            item.format = input.format;
            item.ages = input.ages;

            return item.save();
        }));
    }
    await Book.findByIdAndUpdate(input.id, _getBookData(input));

    return { id: input.id } as BookEntity;
}

export async function updateBookNumberInStock(input: { id: string, numberInStock: number }) {
    if (!input.id) {
        throw new GraphQLError(`Не вказан ідентифікатор.`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    await Book.findByIdAndUpdate(input.id, { numberInStock: input.numberInStock });

    return input as BookEntity;
}

export async function approveComment(input: { bookId: string, commentId: string }) {
    if (!input.bookId) {
        throw new GraphQLError(`Не вказан ідентифікатор.`, {
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
        throw new GraphQLError(`Не вказан ідентифікатор.`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    const book = await Book.findById(input.bookId);

    if (!book) {
        throw new GraphQLError(`Не знайдено такої книги.`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }

    book.comments = book.comments.filter(c => c.id !== input.commentId);
    await book.save();

    return { ...book, comments: book.comments.filter(c => !c.approved) } as BookEntity;
}

export async function addComment(id: string, input: CommentEntity) {
    if (!id) {
        throw new GraphQLError(`Не вказан ідентифікатор.}`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    const book = await Book.findById(id);

    book.comments.push(input);
    await book.save();

    return book as BookEntity;
}

function _getBookByUnique(name: string, bookSeries: string, bookTypes: string[], pageType: string, coverType: string, language: string) {
    return Book.findOne({
        name: new RegExp(`^${name}$`, "i"),
        bookSeries,
        bookTypes,
        pageType,
        coverType,
        language
    });
}

export async function getBookComments(id: string, page: number, rowsPerPage: number) {
    if (!id) {
        throw new GraphQLError(`Не вказан ідентифікатор.`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }

    const book = await Book.findById(id);

    if (!book) {
        throw new GraphQLError(`Не вказан ідентифікатор.`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }

    return book.comments.splice(rowsPerPage * page, rowsPerPage);
}

export async function getBooksNameByQuickSearch(quickSearch: string) {
    return Book.find({ name: getCaseInsensitiveSubstringOption(quickSearch) }).limit(5);
}

export async function getBooksFromSeries(bookId: string, rowsPerPage: number) {
    if (!bookId) {
        throw new GraphQLError(`Не вказан ідентифікатор книги.`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }

    const book = await Book.findById(bookId);

    return Book
        .find({ _id: { $ne: bookId }, bookSeries: book.bookSeries, archived: { $in: [false, null] } })
        .limit(rowsPerPage)
        .populate({
            path: 'bookSeries',
            populate: {
                path: 'publishingHouse'
            }
        })
        .populate('bookTypes')
        .populate('language')
        .sort({ numberInStock: 'desc' });
}

export async function getBooksByAuthor(authorId: string, rowsPerPage: number, excludeBookSeriesId?: string) {
    if (!authorId) {
        throw new GraphQLError(`Не вказан ідентифікатор автора.`, {
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
        .populate('bookTypes')
        .populate('language');
}

export async function getBooksByIds(ids: string[], pageSettings: IPageable) {
    if (!ids?.length) {
        return { items: [], totalCount: 0 };
    }

    const query = Book
        .find({ _id: ids, archived: { $in: [false, null] } })
        .populate({
            path: 'bookSeries',
            populate: {
                path: 'publishingHouse'
            }
        })
        .populate('bookTypes')
        .populate('language');

    if (pageSettings && pageSettings.rowsPerPage && pageSettings.page !== undefined) {
        query
            .skip(pageSettings.rowsPerPage * pageSettings.page)
            .limit(pageSettings.rowsPerPage);
    }
    query.sort({ bookSeries: 'desc', numberInStock: 'desc' });

    const totalCount = await query.countDocuments();
    const items = await query.find();

    return { items, totalCount };
}

export async function getBooksWithDiscount(rowsPerPage: number) {
    return Book
        .find({ discount: { $gt: 0 }, archived: { $in: [false, null] } })
        .populate({
            path: 'bookSeries',
            populate: {
                path: 'publishingHouse'
            }
        })
        .populate('bookTypes')
        .populate('language')
        .sort({ numberInStock: 'desc' })
        .limit(rowsPerPage);
}

export async function getBooksWithNotApprovedComments(pageSettings?: IPageable) {
    const query = Book
        .find()
        .populate('bookTypes')
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

function _getBookData(input: Partial<BookEntity>) {
    return {
        ...input,
        authors: input.authorIds,
        illustrators: input.illustratorIds,
        language: input.languageId,
        bookSeries: input.bookSeriesId,
        coverType: input.coverTypeId,
        pageType: input.pageTypeId,
        bookTypes: input.bookTypeIds
    };
}
