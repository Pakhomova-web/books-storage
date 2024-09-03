import { CoverTypeEntity, IPageable } from '@/lib/data/types';
import { _useCreateItem, _useDeleteItemById, _useItems, _useUpdateItem } from '@/lib/graphql/base-hooks';
import {
    coverTypeOptionsQuery,
    coverTypesQuery,
    createCoverTypeQuery, deleteCoverTypeQuery,
    updateCoverTypeQuery
} from '@/lib/graphql/queries/cover-type/queries';


export function useCoverTypes(pageSettings?: IPageable, filters?: CoverTypeEntity) {
    return _useItems(coverTypesQuery, pageSettings, filters);
}

export function useCoverTypeOptions<T>(pageSettings?: IPageable) {
    return _useItems<T>(coverTypeOptionsQuery, pageSettings);
}

export function useUpdateCoverType() {
    return _useUpdateItem<CoverTypeEntity>(updateCoverTypeQuery);
}

export function useCreateCoverType() {
    return _useCreateItem<CoverTypeEntity>(createCoverTypeQuery);
}

export function useDeleteCoverType() {
    return _useDeleteItemById(deleteCoverTypeQuery);
}
