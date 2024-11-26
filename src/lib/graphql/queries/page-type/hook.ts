import { IPageable, PageTypeEntity } from '@/lib/data/types';
import { _useCreateItem, _useDeleteItemById, _usePageableItems, _useUpdateItem } from '@/lib/graphql/base-hooks';
import {
    createPageTypeQuery,
    deletePageTypeQuery, pageTypeOptionsQuery,
    pageTypesQuery,
    updatePageTypeQuery
} from '@/lib/graphql/queries/page-type/queries';


export function usePageTypes(pageSettings?: IPageable, filters?: PageTypeEntity) {
    return _usePageableItems(pageTypesQuery, 'pageTypes', pageSettings, filters);
}

export function usePageTypeOptions() {
    return _usePageableItems(pageTypeOptionsQuery, 'pageTypes');
}

export function useCreatePageType() {
    return _useCreateItem<PageTypeEntity>(createPageTypeQuery);
}

export function useUpdatePageType() {
    return _useUpdateItem<PageTypeEntity>(updatePageTypeQuery);
}

export function useDeletePageType() {
    return _useDeleteItemById(deletePageTypeQuery);
}
