import { IOrderFilter, IPageable, OrderEntity } from '@/lib/data/types';
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
import { isNovaPostSelected, isSelfPickup, isUkrPoshtaSelected, renderPrice } from '@/utils/utils';

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

    const order = await Order.findById(input.id);
    const balance = await Balance.findOne();

    if (!order.isConfirmed && input.isConfirmed) {
        const books = await Book.find({ _id: { $in: input.books.map(b => b.bookId) } });

        await Promise.all(books.map(book => {
            book.numberInStock = book.numberInStock - input.books.find(b => b.bookId === book.id).count;
            book.numberSold = (book.numberSold || 0) + input.books.find(b => b.bookId === book.id).count;

            return book.save();
        }));

        input.books.forEach(({ count, price, discount }) =>
            balance.value = balance.value + count * price * (100 - discount) / 100);
        await balance.save();
    } else if (!order.isDone && !order.isSent && !order.isPaid && !order.isPartlyPaid && order.isConfirmed && !input.isConfirmed) {
        const books = await Book.find({ _id: { $in: input.books.map(b => b.bookId) } });

        await Promise.all(books.map(book => {
            book.numberInStock = book.numberInStock + input.books.find(b => b.bookId === book.id).count;
            book.numberSold = (book.numberSold || 0) - input.books.find(b => b.bookId === book.id).count;

            return book.save();
        }));

        input.books.forEach(({ count, price, discount }) =>
            balance.value = balance.value - count * price * (100 - discount) / 100);
        await balance.save();
    }
    const sentEmail = !!data.trackingNumber && data.isSent && !order.isSent;

    await Order.findByIdAndUpdate(input.id, data);

    if (sentEmail) {
        await sendEmailWithOrder(order.id);
    }

    return input as OrderEntity;
}

export async function getBalance() {
    const balance = await Balance.findOne();

    return Number(balance?.value.toFixed(2)) || 0;
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
                        <a href="${process.env.FRONTEND_URL}/books/details?id=${book.id}">
                            ${book.name}
                        </a>
                    </div>
                    <div>(${book.languages.map(l => l.name).join(', ')})</div>
                </td>
                <td>${count}</td>
                <td>${renderPrice(price * count, discount)}</td>
            </tr>
    `;
    }).join('');

    return mailContainer(`
        ${order.isSent && order.trackingNumber ?
        `<p style="font-size: 16px">Ваше замовлення відправлене! ТТН: ${order.trackingNumber}</p>${mailDivider()}` : ''} 
        
        <p style="font-size: 16px"><b>Замовлення №${order.orderNumber}</b></p>
        ${mailDivider(true)}
        
        <table style="width: 100%">
            <tr>
                <th style="text-align: left">ПІБ</th>
                <td style="text-align: left">${order.lastName} ${order.firstName}</td>
            </tr>
            <tr>
                <th style="text-align: left">Номер телефону</th>
                <td style="text-align: left">${order.phoneNumber}</td>
            </tr>
            <tr>
                <th style="text-align: left">Спосіб доставки</th>
                <td style="text-align: left">${order.delivery.name}</td>
            </tr>
            <tr>
                <th style="text-align: left">Адреса доставки</th>
                <td style="text-align: left">
                    ${order.region} область${order.district ? `, ${order.district} район` : ''}, ${order.city}${isNovaPostSelected(order.delivery.id) ? `, ${order.novaPostOffice}` : ''}${isUkrPoshtaSelected(order.delivery.id) ? `, ${order.postcode}` : ''}
                </td>
            </tr>
            ${!!order.comment ? `<tr>
                                    <th style="text-align: left">Коментар</th>
                                    <td style="text-align: left">${order.comment}</td>
                                </tr>` : ''}
        </table>
        ${mailDivider(true)}
        
        <table style="width: 100%">
            <tr>
                <th>Зображення</th>
                <th>Назва (мова)</th>
                <th>#</th>
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
