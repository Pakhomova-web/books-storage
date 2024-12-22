import { DeliveryEntity, IPageable, UkrPoshtaWarehouse } from '@/lib/data/types';
import {
    _useCreateItem,
    _useDeleteItemById,
    _useOptions,
    _usePageableItems,
    _useUpdateItem
} from '@/lib/graphql/base-hooks';
import {
    createDeliveryQuery,
    deleteDeliveryQuery,
    deliveriesQuery,
    deliveryOptionsQuery, ukrPoshtaWarehousesQuery,
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

export function getDeliveryOptions() {
    return _useOptions<DeliveryEntity>(deliveryOptionsQuery);
}

export function getUkrPoshtaWarehouses() {
    return _useOptions<UkrPoshtaWarehouse>(ukrPoshtaWarehousesQuery);
}
