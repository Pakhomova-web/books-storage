import { IOrderFilter, IPageable, OrderEntity } from '@/lib/data/types';
import { _useCreateItem, _useDeleteItemById, _usePageableItems, _useUpdateItem } from '@/lib/graphql/base-hooks';
import { createOrderQuery, deleteOrderQuery, ordersQuery, updateOrderQuery } from '@/lib/graphql/queries/order/queries';


export function useOrders(pageSettings?: IPageable, filters?: IOrderFilter) {
    return _usePageableItems<OrderEntity>(ordersQuery, 'orders', pageSettings, filters);
}

export function useUpdateOrder() {
    return _useUpdateItem<OrderEntity>(updateOrderQuery);
}

export function useCreateOrder() {
    return _useCreateItem<OrderEntity>(createOrderQuery);
}

export function useDeleteOrder() {
    return _useDeleteItemById(deleteOrderQuery);
}
