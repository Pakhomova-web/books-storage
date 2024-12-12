import { AuthorEntity, GroupDiscountEntity, IGroupDiscountFilter, IPageable } from '@/lib/data/types';
import { _useCreateItem, _useDeleteItemById, _usePageableItems, _useUpdateItem } from '@/lib/graphql/base-hooks';
import {
    createGroupDiscountQuery, deleteGroupDiscountQuery,
    groupDiscountsQuery,
    updateGroupDiscountQuery
} from '@/lib/graphql/queries/group-discounts/queries';

export function useGroupDiscounts(pageSettings?: IPageable, filters?: IGroupDiscountFilter) {
    return _usePageableItems<GroupDiscountEntity>(groupDiscountsQuery, 'groupDiscounts', pageSettings, filters);
}

export function useUpdateGroupDiscount() {
    return _useUpdateItem<AuthorEntity>(updateGroupDiscountQuery);
}

export function useCreateGroupDiscount() {
    return _useCreateItem<AuthorEntity>(createGroupDiscountQuery);
}

export function useRemoveGroupDiscount() {
    return _useDeleteItemById(deleteGroupDiscountQuery);
}
