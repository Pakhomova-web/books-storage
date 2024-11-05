import { IOrderFilter, IPageable, OrderEntity } from '@/lib/data/types';
import Order from '@/lib/data/models/order';
import { GraphQLError } from 'graphql/error';
import { getValidFilters } from '@/lib/data/base';

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
            items = items.filter(({ customerFirstName, customerLastName }) => quickSearch.test(customerFirstName));
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
    const item = new Order(_getOrderData(input));

    await item.save();

    return { ...input, id: item.id } as OrderEntity;
}

export async function updateOrder(input: OrderEntity) {
    if (!input.id) {
        throw new GraphQLError(`No Order found with id ${input.id}`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }

    await Order.findByIdAndUpdate(input.id, _getOrderData(input));

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

function _getOrderData(input: OrderEntity) {
    return {
        ...input,
        delivery: input.deliveryId
    };
}
