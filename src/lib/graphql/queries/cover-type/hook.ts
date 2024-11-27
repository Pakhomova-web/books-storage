import { CoverTypeEntity, IOption, IPageable, NameFilter } from '@/lib/data/types';
import {
    _useCreateItem,
    _useDeleteItemById,
    _useItems,
    _usePageableItems,
    _useUpdateItem
} from '@/lib/graphql/base-hooks';
import {
    coverTypeOptionsQuery,
    coverTypesQuery,
    createCoverTypeQuery, deleteCoverTypeQuery,
    updateCoverTypeQuery
} from '@/lib/graphql/queries/cover-type/queries';


export function useCoverTypes(pageSettings?: IPageable, filters?: CoverTypeEntity) {
    return _usePageableItems(coverTypesQuery, 'coverTypes', pageSettings, filters);
}

export function useCoverTypeOptions() {
    return _usePageableItems<IOption<string>>(coverTypeOptionsQuery, 'coverTypes');
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
