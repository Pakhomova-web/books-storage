import { IOrderFilter, IPageable, OrderBookEntity, OrderEntity } from '@/lib/data/types';
import Order from '@/lib/data/models/order';
import { GraphQLError } from 'graphql/error';
import {
    createMailOptions,
    createMailTransport,
    getValidFilters,
    mailContainer,
    mailDivider,
    rowDivider
} from '@/lib/data/base';
import OrderNumber from '@/lib/data/models/order-number';
import User from '@/lib/data/models/user';
import Book from '@/lib/data/models/book';
import Balance from '@/lib/data/models/balance';
import { isSelfPickup, renderPrice } from '@/utils/utils';
import { primaryLightColor } from '@/constants/styles-variables';

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
                        { path: 'languages' }
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
    await sendEmailWithOrder(item.id);
    await User.findByIdAndUpdate(input.userId, { basketItems: [], basketGroupDiscounts: [] });

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

    const order = await Order.findById(input.id).populate({ path: 'books', populate: 'book' });
    const balance = await Balance.findOne();

    if (!order.isConfirmed && input.isConfirmed) {
        const books = await Book.find({ _id: { $in: input.books.map(b => b.bookId) } });

        await Promise.all(books.map(book => {
            book.numberInStock = book.numberInStock - input.books.find(b => b.bookId === book.id).count;
            book.numberSold = (book.numberSold || 0) + input.books.find(b => b.bookId === book.id).count;

            return book.save();
        }));

        input.books.forEach(orderBook => {
            balance.value = balance.value + calculateBookPrice(orderBook);
        });
        await balance.save();
    } else if (!order.isDone && !order.isSent && !order.isPaid && !order.isPartlyPaid && order.isConfirmed && !input.isConfirmed) {
        // change order from confirmed to unconfirmed
        // recalculate numberInStock & balance only for book which were in order
        const books = await Book.find({ _id: { $in: order.books.map(b => b.book.id) } });

        await Promise.all(books.map(book => {
            book.numberInStock = book.numberInStock + order.books.find(b => b.book.id === book.id).count;
            book.numberSold = (book.numberSold || 0) - order.books.find(b => b.book.id === book.id).count;

            return book.save();
        }));

        order.books.forEach(orderBook => {
            balance.value = balance.value - calculateBookPrice(orderBook);
        });
        await balance.save();
    } else if (order.isConfirmed && input.isConfirmed) {
        // change books in confirmed order
        // change balance and numberInStock
        const newBooks = input.books.filter(({ bookId }) => !order.books.some(b => b.book.id === bookId));
        const removedBooks = order.books.filter(({ book }) =>
            !input.books.some(({ bookId }) => bookId === book.id));
        const changedBooks = order.books.filter(orderBook =>
            input.books.some(({ bookId, count, discount }) =>
                orderBook.book.id === bookId && (orderBook.discount !== discount || orderBook.count !== count)));

        if (newBooks.length || removedBooks.length || changedBooks.length) {
            const books = await Book.find({
                _id: {
                    $in: [
                        ...newBooks.map(({ bookId }) => bookId),
                        ...changedBooks.map(({ book }) => book.id),
                        ...removedBooks.map(({ book }) => book.id)
                    ]
                }
            });
            let balanceSum = 0;

            await Promise.all(books.map(book => {
                const newBook = newBooks.find(b => b.bookId === book.id);

                if (newBook) {
                    book.numberInStock = book.numberInStock - newBook.count;
                    book.numberSold = (book.numberSold || 0) + newBook.count;
                    balanceSum = balanceSum + calculateBookPrice(newBook);

                    return book.save();
                }
                const removedBook = removedBooks.find(b => b.book.id === book.id);

                if (removedBook) {
                    book.numberInStock = book.numberInStock + removedBook.count;
                    book.numberSold = (book.numberSold || 0) - removedBook.count;
                    balanceSum = balanceSum - calculateBookPrice(removedBook);

                    return book.save();
                }

                const bookFromOrder = changedBooks.find(({ book: { id } }) => id === book.id);
                const bookFromInput = input.books.find(({ bookId }) => bookId === bookFromOrder.book.id);
                const countDiff = bookFromOrder.count - bookFromInput.count;

                book.numberInStock = book.numberInStock + countDiff;
                book.numberSold = (book.numberSold || 0) - countDiff;
                balanceSum = balanceSum - calculateBookPrice(bookFromOrder) + calculateBookPrice(bookFromInput);

                return book.save();
            }));

            balance.value = balance.value + balanceSum;
            await balance.save();
        }
    }
    const sentEmail = !!data.trackingNumber && data.isSent && !order.isSent;

    await Order.findByIdAndUpdate(input.id, data);

    if (sentEmail) {
        await sendEmailWithOrder(order.id);
    }

    return input as OrderEntity;
}

function calculateBookPrice(orderBook: OrderBookEntity) {
    return orderBook.count * orderBook.price * (100 - orderBook.discount) / 100;
}

export async function cancelOrder(id: string) {
    const order = await Order.findById(id);

    if (order.isConfirmed) {
        const balance = await Balance.findOne();
        const books = await Book.find({ _id: { $in: order.books.map(b => b.bookId) } });

        await Promise.all(books.map(book => {
            book.numberInStock = book.numberInStock + order.books.find(b => b.bookId === book.id).count;

            return book.save();
        }));
        order.books.forEach(({ count, price, discount }) =>
            balance.value = balance.value - count * price * (100 - discount) / 100);
        await balance.save();
    }

    order.isCanceled = true;
    order.isConfirmed = false;
    order.trackingNumber = null;
    await order.save();

    return { id } as OrderEntity;
}

export async function sendEmailWithOrder(orderId: string) {
    const order = await Order.findById(orderId).populate([
        { path: 'user' },
        { path: 'delivery' },
        {
            path: 'books',
            populate: {
                path: 'book',
                populate: [
                    {
                        path: 'languages'
                    },
                    {
                        path: 'bookSeries',
                        populate: {
                            path: 'publishingHouse'
                        }
                    }
                ]
            }
        }
    ]);

    if (!order) {
        throw new GraphQLError(`Такого замовлення немає.`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }

    createMailTransport().sendMail(
        createMailOptions(
            order.user.email,
            `Замовлення №${order.orderNumber}`,
            orderTemplate(order),
            order.books.map(({ book }) => ({
                filename: `${book.id}.png`,
                path: `https://drive.google.com/thumbnail?id=${book.imageIds[0]}&sz=w1000`,
                cid: book.id
            }))
        ), async (err) => {
            if (err) {
                throw new GraphQLError(`Щось пішло не так.`, {
                    extensions: { code: 'INVALID_DATA' }
                });
            }
        });

    return 'OK';
}

function orderTemplate(order: OrderEntity) {
    let finalSum = 0;
    let finalSumWithDiscounts = 0;
    const bookRows = order.books.map(({ book, price, discount, count }) => {
        finalSum = finalSum + price * count;
        finalSumWithDiscounts = finalSumWithDiscounts + price * count * (100 - discount) / 100;

        return `
            <tr>
                <td><img src="cid:${book.id}" style="width: 60px; height: 60px; object-fit: contain"/></td>
                <td>
                    <div>
                        <a href="${process.env.FRONTEND_URL}/books/${book.id}">
                            ${book.name}
                        </a>
                    </div>
                    <div>(${book.languages.map(l => l.name).join(', ')})</div>
                </td>
                <td style="border-right: 1px solid ${primaryLightColor}; border-left: 1px solid ${primaryLightColor}">${count}</td>
                <td>${renderPrice(price * count, discount)}</td>
            </tr>
    `;
    }).join('');

    return mailContainer(`
        ${order.isSent && order.trackingNumber ?
        `<p style="font-size: 16px">Ваше замовлення відправлене! ТТН: ${order.trackingNumber}</p>${mailDivider()}` : ''} 
        
        <p style="font-size: 16px"><b>Замовлення №${order.orderNumber}</b></p>
        ${mailDivider(true)}
        
        <div style="text-align: left">
            <p><b>ПІБ: </b>${order.lastName} ${order.firstName}</p>
            <p><b>Номер телефону: </b>${order.phoneNumber}</p>
            <p><b>Спосіб доставки: </b>${order.delivery.name}</p>
            ${!isSelfPickup(order.delivery.id) ? `<p>
                    <b>Адреса доставки: </b>
                    ${order.region} область${order.district ? `, ${order.district} район` : ''}, ${order.city}${order.house ? `, буд. ${order.house}${order.flat ? `, кв. ${order.flat}` : ''}` : ''}${order.warehouse ? `, № відділення/поштомат ${order.warehouse}` : ''}
                </p>` : ''}
            ${!!order.comment ? `<p><b>Коментар: </b>${order.comment}</p>` : ''}
        </div>
        ${mailDivider(true)}
        
        <table style="width: 100%">
            <tr>
                <th>Зображ.</th>
                <th>Назва (мова)</th>
                <th style="border-right: 1px solid ${primaryLightColor}; border-left: 1px solid ${primaryLightColor}">#</th>
                <th>Ціна</th>
            </tr>
            ${bookRows}
            ${rowDivider(4)}
            <tr>
                <th colspan="2" style="text-align: right">Кінцева сума без знижки:</th>
                <td colspan="2" style="text-align: center">${renderPrice(finalSum)}</td>
            </tr>
            ${rowDivider(4)}
            <tr>
                <th colspan="2" style="text-align: right">Знижка:</th>
                <td colspan="2" style="text-align: center">${renderPrice(finalSum - finalSumWithDiscounts)}</td>
            </tr>
            ${rowDivider(4)}
            <tr>
                <th colspan="2" style="text-align: right">Кінцева сума:</th>
                <td colspan="2" style="text-align: center; font-size: 16px"><b>${renderPrice(finalSumWithDiscounts)}</b></td>
            </tr>
        </table>
    `);
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
