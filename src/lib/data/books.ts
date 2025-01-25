import { BookEntity, BookFilter, CommentEntity, IOption, IPageable } from '@/lib/data/types';
import Book from '@/lib/data/models/book';
import { GraphQLError } from 'graphql/error';
import { getCaseInsensitiveSubstringOption, getValidFilters } from '@/lib/data/base';
import BookSeries from '@/lib/data/models/book-series';
import Balance from '@/lib/data/models/balance';
import { removePunctuation } from '@/utils/utils';

export async function getBooks(pageSettings?: IPageable, filters?: BookFilter): Promise<{
    items: BookEntity[],
    totalCount: number
}> {
    const { quickSearch, andFilters, orFilters } = getValidFilters(filters);
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
    if (orFilters?.length) {
        query.or(orFilters);
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
        .populate('languages')
        .populate('authors')
        .populate('illustrators')
        .populate({
            path: 'languageBooks',
            populate: [
                {
                    path: 'bookSeries',
                    populate: 'publishingHouse'
                },
                { path: 'languages' }
            ]
        })
        .sort({ [pageSettings?.orderBy || 'name']: pageSettings?.order || 'asc' });

    let res = { items: [], totalCount: 0 };

    await query.exec().then((items: BookEntity[]) => {
        if (quickSearch) {
            items = items.filter(
                ({ authors, nameToSearch, bookSeries, bookTypes, tags, illustrators, languages, description }) =>
                    quickSearch.test(nameToSearch) ||
                    (authors?.length && authors.some(author => quickSearch.test(removePunctuation(author.name)))) ||
                    (illustrators?.length && illustrators.some(illustrator => quickSearch.test(removePunctuation(illustrator.name)))) ||
                    (bookTypes?.length && bookTypes.some(bookType => quickSearch.test(removePunctuation(bookType.name)))) ||
                    (languages?.length && languages.some(language => quickSearch.test(removePunctuation(language.name)))) ||
                    quickSearch.test(removePunctuation(bookSeries.name)) ||
                    quickSearch.test(removePunctuation(bookSeries.description)) ||
                    quickSearch.test(removePunctuation(description)) ||
                    quickSearch.test(removePunctuation(bookSeries.publishingHouse.name)) ||
                    tags?.some(tag => quickSearch.test(removePunctuation(tag)))
            );
        }

        const today = new Date();

        items.forEach(item => {
            if (!!item.discountEndDate && dateDiffInDays(today, new Date(item.discountEndDate)) > 0) {
                item.discount = 0;
            }
        });

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

export async function getAllBooks(): Promise<{ id: string, imageIds?: string[] }[]> {
    return Book.find();
}

export async function getBookById(id: string) {
    const item = await Book.findById(id)
        .populate('languages')
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
        .populate({
            path: 'languageBooks',
            populate: [
                { path: 'languages' },
                {
                    path: 'bookSeries',
                    populate: {
                        path: 'publishingHouse'
                    }
                }
            ]
        })
        .populate('coverType');

    if (!item) {
        throw new GraphQLError(`Не знайдено такої книги.`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }

    return item;
}

export async function createBook(input: Partial<BookEntity>) {
    const item = await _getBookByUnique(input.name, input.bookSeriesId, input.bookTypeIds, input.pageTypeId, input.coverTypeId, input.languageIds);

    if (item) {
        return null;
    } else {
        const item = new Book(_getBookData(input));
        const balance = await Balance.findOne();

        if (input.numberInStock && input.purchasePrice) {
            balance.value = balance.value - input.numberInStock * input.purchasePrice;
        }

        const languageBooks = await Book.find({ _id: item.languageBooks });

        await Promise.all([
            balance.save(),
            item.save(),
            languageBooks.map(book => {
                if (!!book.languageBooks && book.languageBooks.some(id => item.id === id)) {
                    return new Promise(null);
                }

                if (!book.languageBooks) {
                    book.languageBooks = [item.id];
                } else {
                    book.languageBooks.push(item.id);
                }
                return book.save();
            })
        ]);

        return { ...input, id: item.id } as BookEntity;
    }
}

export async function updateBook(input: Partial<BookEntity>, updateAllBooksInSeries = false) {
    if (!input.id) {
        throw new GraphQLError(`Не вказан ідентифікатор.`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    const itemByUnique = await _getBookByUnique(input.name, input.bookSeriesId, input.bookTypeIds, input.pageTypeId, input.coverTypeId, input.languageIds);

    if (itemByUnique && itemByUnique.name.toLowerCase() === input.name.toLowerCase() && itemByUnique.id.toString() !== input.id) {
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
    const item = await Book.findById(input.id);
    const oldLanguageBooks = await Book.find({ _id: item.languageBooks });
    const languageBooks = await Book.find({ _id: input.languageBookIds });

    await Promise.all([
        Book.findByIdAndUpdate(input.id, _getBookData(input)),
        languageBooks.filter(book => !(book.languageBooks || []).some((id: string) => input.id === id))
            .map(book => {
                if (!book.languageBooks) {
                    book.languageBooks = [input.id];
                } else {
                    book.languageBooks.push(input.id);
                }
                return book.save();
            }),
        oldLanguageBooks.filter(book => !book.languageBooks || !input.languageBookIds.includes(book.id))
            .map(book => {
                book.languageBooks = book.languageBooks.filter((id: string) => id !== input.id);

                return book.save();
            })
    ]);

    return { id: input.id } as BookEntity;
}

export async function updateBookNumberInStock(input: { id: string, receivedNumber: number, purchasePrice: number }) {
    if (!input.id) {
        throw new GraphQLError(`Не вказан ідентифікатор.`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    const book = await Book.findById(input.id);
    const balance = await Balance.findOne();

    book.numberInStock = (book.numberInStock || 0) + input.receivedNumber;
    balance.value = balance.value - input.purchasePrice * input.receivedNumber;

    await Promise.all([
        book.save(),
        balance.save()
    ]);

    return book as BookEntity;
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

function _getBookByUnique(name: string, bookSeries: string, bookTypes: string[], pageType: string, coverType: string, languages: string[]) {
    return Book.findOne({
        name: new RegExp(`^${name}$`, "i"),
        bookSeries,
        bookTypes,
        pageType,
        coverType,
        languages
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

export async function getBooksNameByQuickSearch(quickSearch: string): Promise<IOption<string>[]> {
    const books = await Book.find({
        nameToSearch: getCaseInsensitiveSubstringOption(quickSearch),
        archive: { $in: [null, false] }
    })
        .populate({
            path: 'bookSeries',
            populate: {
                path: 'publishingHouse'
            }
        })
        .limit(5);

    return books.map(b => ({
        id: b.id,
        label: b.name,
        description: `${b.bookSeries.publishingHouse.name}${b.bookSeries.default ? '' : `, ${b.bookSeries.name}`}`
    }));
}

export async function getBookPartById(id: string) {
    const book = await Book.findById(id).populate({
        path: 'bookSeries'
    });

    return {
        name: book.name,
        imageId: book.imageIds ? book.imageIds[0] : null,
        price: book.price,
        discount: !book.discountEndDate || dateDiffInDays(new Date(), new Date(book.discountEndDate)) > 0 ? book.discount : 0,
        bookSeries: {
            name: book.bookSeries.name,
            default: !!book.bookSeries.default
        }
    };
}

export async function getBooksFromSeries(bookId: string, rowsPerPage: number) {
    if (!bookId) {
        throw new GraphQLError(`Не вказан ідентифікатор книги.`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }

    const book = await Book.findById(bookId);

    return Book
        .find({
            _id: { $nin: [bookId, ...(book.languageBooks || [])] },
            bookSeries: book.bookSeries,
            archived: { $in: [false, null] }
        })
        .limit(rowsPerPage)
        .populate({
            path: 'bookSeries',
            populate: {
                path: 'publishingHouse'
            }
        })
        .populate('bookTypes')
        .populate('languages')
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
        .populate('languages');
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
        .populate('languages');

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
    const query = Book
        .find({ discount: { $gt: 0 }, archived: { $in: [false, null] }, numberInStock: { $gt: 0 } })
        .populate({
            path: 'bookSeries',
            populate: {
                path: 'publishingHouse'
            }
        })
        .populate('bookTypes')
        .populate('languages');
    const totalCount = await query.countDocuments();
    const random = Math.floor(Math.random() * (totalCount - rowsPerPage + 1));

    return query.find().limit(rowsPerPage).skip(random);
}

export async function getTopOfSoldBooks(rowsPerPage: number) {
    return Book
        .find({ archived: { $in: [false, null] }, numberInStock: { $gt: 0 } })
        .populate({
            path: 'bookSeries',
            populate: {
                path: 'publishingHouse'
            }
        })
        .populate('bookTypes')
        .populate('languages')
        .sort({ numberSold: 'desc' }).limit(rowsPerPage);
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
        languages: input.languageIds,
        bookSeries: input.bookSeriesId,
        coverType: input.coverTypeId,
        pageType: input.pageTypeId,
        languageBooks: input.languageBookIds,
        bookTypes: input.bookTypeIds,
        imageIds: input.imageIds || [],
        nameToSearch: removePunctuation(input.name),
        discountEndDate: !!input.discount ? input.discountEndDate : null
    };
}

function dateDiffInDays(a: Date, b: Date): number {
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc1 - utc2) / 1000 * 60 * 60 * 24);
}
