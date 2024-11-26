import { DeliveryEntity, IPageable, NameFilter } from '@/lib/data/types';
import {
    _useCreateItem,
    _useDeleteItemById,
    _useItems,
    _usePageableItems,
    _useUpdateItem
} from '@/lib/graphql/base-hooks';
import {
    createDeliveryQuery,
    deleteDeliveryQuery,
    deliveriesQuery,
    updateDeliveryQuery
} from '@/lib/graphql/queries/delivery/queries';

export function useDeliveries(pageSettings?: IPageable, filters?: DeliveryEntity) {
    return _usePageableItems<DeliveryEntity>(deliveriesQuery, 'deliveries', pageSettings, filters);
}

export function useUpdateDelivery() {
    return _useUpdateItem<DeliveryEntity>(updateDeliveryQuery);
}

export function useCreateDelivery() {
    return _useCreateItem<DeliveryEntity>(createDeliveryQuery);
}

export function useDeleteDelivery() {
    return _useDeleteItemById(deleteDeliveryQuery);
}
