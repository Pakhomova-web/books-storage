import { IOrderFilter, IPageable, OrderEntity } from '@/lib/data/types';
import Order from '@/lib/data/models/order';
import { GraphQLError } from 'graphql/error';
import { getValidFilters } from '@/lib/data/base';
import OrderNumber from '@/lib/data/models/orderNumber';
import User from '@/lib/data/models/user';
import Book from '@/lib/data/models/book';

export async function getOrders(pageSettings?: IPageable, filters?: IOrderFilter) {
    const { quickSearch, andFilters } = getValidFilters(filters);

    const query = Order.find()
        .populate([
            { path: 'user' },
            {
                path: 'books',
                populate: {
                    path: 'book',
                    populate: [
                        {
                            path: 'bookSeries',
                            populate: {
                                path: 'publishingHouse'
                            }
                        },
                        { path: 'bookTypes' },
                        { path: 'language' }
                    ]
                }
            }])
        .populate('delivery')
        .sort({ [pageSettings.orderBy || 'orderNumber']: pageSettings.order || 'desc' });

    if (andFilters?.length) {
        query.and(andFilters);
    }
    let res = { items: [], totalCount: 0 };

    await query.exec().then((items: OrderEntity[]) => {
        if (quickSearch) {
            items = items
                .filter(({ firstName, lastName }) => quickSearch.test(firstName) || quickSearch.test(lastName));
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

export async function createOrder(input: OrderEntity) {
    let orderNumber = await OrderNumber.findOne();

    if (orderNumber) {
        orderNumber.value = orderNumber.value + 1;
        await orderNumber.save();
    } else {
        orderNumber = await OrderNumber.create({ value: 1 });
    }
    const item = new Order(_getOrderData(input, orderNumber.value));
    item.date = new Date().toISOString();

    await item.save();
    await User.findByIdAndUpdate(input.userId, { basketItems: [] });

    return item as OrderEntity;
}

export async function updateOrder(input: OrderEntity) {
    if (!input.id) {
        throw new GraphQLError(`Не вказан ідентифікатор.`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    const data = _getOrderData(input);
    delete data.orderNumber;
    delete data.user;

    const order = await Order.findById(input.id);

    if (!order.isConfirmed && input.isConfirmed) {
        const books = await Book.find({ _id: { $in: input.books.map(b => b.bookId) } });

        await Promise.all(books.map(book => {
            book.numberInStock = book.numberInStock - input.books.find(b => b.bookId === book.id).count;
            book.numberSold = (book.numberSold || 0) + input.books.find(b => b.bookId === book.id).count;

            return book.save();
        }));
    } else if (!order.isDone && !order.isSent && !order.isPaid && !order.isPartlyPaid && order.isConfirmed && !input.isConfirmed) {
        const books = await Book.find({ _id: { $in: input.books.map(b => b.bookId) } });

        await Promise.all(books.map(book => {
            book.numberInStock = book.numberInStock + input.books.find(b => b.bookId === book.id).count;
            book.numberSold = (book.numberSold || 0) - input.books.find(b => b.bookId === book.id).count;

            return book.save();
        }));
    }
    await Order.findByIdAndUpdate(input.id, data);

    return input as OrderEntity;
}

export async function cancelOrder(id: string) {
    const order = await Order.findById(id);

    if (order.isConfirmed) {
        const books = await Book.find({ _id: { $in: order.books.map(b => b.bookId) } });

        await Promise.all(books.map(book => {
            book.numberInStock = book.numberInStock + order.books.find(b => b.bookId === book.id).count;

            return book.save();
        }));
    }

    order.isCanceled = true;
    order.isConfirmed = false;
    order.trackingNumber = null;
    await order.save();

    return { id } as OrderEntity;
}

function _getOrderData(input: OrderEntity, orderNumber?: number) {
    return {
        ...input,
        orderNumber,
        user: input.userId,
        delivery: input.deliveryId,
        books: input.books.map(b => ({ ...b, book: b.bookId }))
    };
}
