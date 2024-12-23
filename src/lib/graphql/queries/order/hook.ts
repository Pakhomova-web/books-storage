import { IOrderFilter, IPageable, OrderEntity } from '@/lib/data/types';
import { _useCreateItem, _usePageableItems, _useUpdateItem } from '@/lib/graphql/base-hooks';
import {
    cancelOrderQuery,
    createOrderQuery,
    ordersQuery,
    sendEmailWithOrderQuery,
    updateOrderQuery
} from '@/lib/graphql/queries/order/queries';
import { apolloClient } from '@/lib/apollo';

export function useOrders(pageSettings?: IPageable, filters?: IOrderFilter) {
    const data = _usePageableItems<OrderEntity>(ordersQuery, 'orders', pageSettings, filters);

    return { ...data, items: data.items.map(item => new OrderEntity(item)) };
}

export function useUpdateOrder() {
    return _useUpdateItem<OrderEntity>(updateOrderQuery);
}

export function useCancelOrder() {
    return _useUpdateItem<OrderEntity>(cancelOrderQuery);
}

export function useCreateOrder() {
    return _useCreateItem<OrderEntity>(createOrderQuery);
}

export function sendEmailWithOrder(orderId: string) {
    return apolloClient.query({ query: sendEmailWithOrderQuery, fetchPolicy: 'network-only', variables: { orderId } });
}
