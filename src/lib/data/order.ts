import { IOrderFilter, IPageable, OrderEntity } from '@/lib/data/types';
import Order from '@/lib/data/models/order';
import { GraphQLError } from 'graphql/error';
import { getValidFilters } from '@/lib/data/base';
import OrderNumber from '@/lib/data/models/orderNumber';
import User from '@/lib/data/models/user';

export async function getOrders(pageSettings?: IPageable, filters?: IOrderFilter) {
    const { quickSearch, andFilters } = getValidFilters(filters);

    const query = Order.find()
        .populate({
            path: 'books',
            populate: {
                path: 'book',
                populate: {
                    path: 'bookSeries',
                    populate: {
                        path: 'publishingHouse'
                    }
                }
            }
        })
        .populate('delivery')
        .sort({ [pageSettings.orderBy || 'name']: pageSettings.order });

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

    await item.save();
    await User.findByIdAndUpdate(input.userId, { basketItems: [] });

    return item as OrderEntity;
}

export async function updateOrder(input: OrderEntity) {
    if (!input.id) {
        throw new GraphQLError(`No Order found with id ${input.id}`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }

    await Order.findByIdAndUpdate(input.id, _getOrderData(input, input.orderNumber));

    return input as OrderEntity;
}

export async function getOrderById(id: string) {
    return Order.findById(id);
}

export async function deleteOrder(id: string) {
    // TODO recalculate count of books in Books table for each basket details after deleting
    await Order.findByIdAndDelete(id);

    return { id } as OrderEntity;
}

function _getOrderData(input: OrderEntity, orderNumber: number) {
    return {
        ...input,
        orderNumber,
        delivery: input.deliveryId
    };
}
