import { AuthorEntity, GroupDiscountEntity, IGroupDiscountFilter, IPageable } from '@/lib/data/types';
import { _useCreateItem, _useDeleteItemById, _usePageableItems, _useUpdateItem } from '@/lib/graphql/base-hooks';
import {
    createGroupDiscountQuery,
    deleteGroupDiscountQuery,
    groupDiscountsByIdsQuery,
    groupDiscountsQuery,
    updateGroupDiscountCountInBasket,
    updateGroupDiscountQuery
} from '@/lib/graphql/queries/group-discounts/queries';
import { useMutation, useQuery } from '@apollo/client';

export function useGroupDiscounts(pageSettings?: IPageable, filters?: IGroupDiscountFilter) {
    return _usePageableItems<GroupDiscountEntity>(groupDiscountsQuery, 'groupDiscounts', pageSettings, filters);
}

export function useGroupDiscountsByIds(ids: string[], pageSettings?: IPageable) {
    const { data, loading, error, refetch } = useQuery(groupDiscountsByIdsQuery, {
        fetchPolicy: 'no-cache',
        variables: { ids, pageSettings: pageSettings ? pageSettings : { page: 0, rowsPerPage: (ids || []).length } }
    });

    return {
        items: data ? data.groupDiscountsByIds.items : [],
        totalCount: data ? data.groupDiscountsByIds.totalCount : 0,
        loading,
        error,
        refetch
    };
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

export function useUpdateGroupDiscountCountInBasket() {
    const [mutate, { loading, error }] = useMutation(updateGroupDiscountCountInBasket);

    return {
        updateGroup: async (id: string, count: number) => {
            const { data: { items } } = await mutate({
                fetchPolicy: 'no-cache',
                variables: { id, count }
            });

            return items;
        },
        updatingGroup: loading,
        updatingGroupError: error
    };
}
