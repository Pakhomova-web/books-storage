import { IPageable, PublishingHouseEntity } from '@/lib/data/types';
import { _useCreateItem, _useDeleteItemById, _useItems, _useUpdateItem } from '@/lib/graphql/base-hooks';
import {
    createPublishingHouseQuery,
    deletePublishingHouseQuery,
    publishingHouseOptionsQuery,
    publishingHousesQuery, updatePublishingHouseQuery
} from '@/lib/graphql/queries/publishing-house/queries';

export function usePublishingHouses(pageSettings?: IPageable, filters?: PublishingHouseEntity) {
    return _useItems<PublishingHouseEntity>(publishingHousesQuery, pageSettings, filters);
}

export function usePublishingHouseOptions<T>(pageSettings?: IPageable) {
    return _useItems<T>(publishingHouseOptionsQuery, pageSettings);
}

export function useDeletePublishingHouse() {
    return _useDeleteItemById(deletePublishingHouseQuery);
}

export function useUpdatePublishingHouse() {
    return _useUpdateItem<PublishingHouseEntity>(updatePublishingHouseQuery);
}

export function useCreatePublishingHouse() {
    return _useCreateItem<PublishingHouseEntity>(createPublishingHouseQuery);
}
