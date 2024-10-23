import { AuthorEntity, IOption, IPageable, NameFilter, PublishingHouseEntity } from '@/lib/data/types';
import { _useCreateItem, _useDeleteItemById, _useItems, _useUpdateItem, getItemById } from '@/lib/graphql/base-hooks';
import {
    createPublishingHouseQuery,
    deletePublishingHouseQuery,
    publishingHouseByIdQuery,
    publishingHouseOptionsQuery,
    publishingHousesQuery,
    updatePublishingHouseQuery
} from '@/lib/graphql/queries/publishing-house/queries';

export function usePublishingHouses(pageSettings?: IPageable, filters?: PublishingHouseEntity) {
    return _useItems<PublishingHouseEntity, NameFilter>(publishingHousesQuery, pageSettings, filters);
}

export function getPublishingHouseById(id: string): Promise<AuthorEntity> {
    return getItemById<PublishingHouseEntity>(publishingHouseByIdQuery, id);
}

export function usePublishingHouseOptions() {
    return _useItems<IOption<string>, NameFilter>(publishingHouseOptionsQuery);
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
