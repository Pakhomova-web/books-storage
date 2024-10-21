import { DeliveryEntity, IOption, IPageable, NameFilter } from '@/lib/data/types';
import { _useCreateItem, _useDeleteItemById, _useItems, _useUpdateItem } from '@/lib/graphql/base-hooks';
import {
    createDeliveryQuery, deleteDeliveryQuery,
    deliveriesQuery,
    deliveryOptionsQuery,
    updateDeliveryQuery
} from '@/lib/graphql/queries/delivery/queries';

export function useDeliveries(pageSettings?: IPageable, filters?: DeliveryEntity) {
    return _useItems<DeliveryEntity, NameFilter>(deliveriesQuery, pageSettings, filters);
}

export function useDeliveryOptions() {
    return _useItems<IOption, NameFilter>(deliveryOptionsQuery);
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
