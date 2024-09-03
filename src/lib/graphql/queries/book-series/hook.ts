import { BookSeriesEntity, IBookSeriesFilter, IPageable } from '@/lib/data/types';
import { apolloClient } from '@/lib/apollo';
import {
    _useCreateItem,
    _useDeleteItemById,
    _useItems,
    _usePageableItems,
    _useUpdateItem
} from '@/lib/graphql/base-hooks';
import {
    bookSeriesOptionsQuery,
    bookSeriesQuery,
    createBookSeriesQuery,
    deleteBookSeriesQuery,
    updateBookSeriesQuery
} from '@/lib/graphql/queries/book-series/queries';

export function useBookSeries(pageSettings?: IPageable, filters?: IBookSeriesFilter) {
    return _usePageableItems<BookSeriesEntity>(bookSeriesQuery, 'bookSeries', pageSettings, filters);
}

export function useUpdateBookSeries() {
    return _useUpdateItem<BookSeriesEntity>(updateBookSeriesQuery);
}

export function useCreateBookSeries() {
    return _useCreateItem<BookSeriesEntity>(createBookSeriesQuery);
}

export function useDeleteBookSeries() {
    return _useDeleteItemById(deleteBookSeriesQuery);
}

export function useBookSeriesOptions(filters?: BookSeriesEntity) {
    const { items, loading, gettingError, refetch } = _useItems<BookSeriesEntity>(bookSeriesQuery, null, filters);

    return {
        refetch,
        items: items.map(item => ({ id: item.id, label: `${item.name} (${item.publishingHouse?.name})` })),
        loading,
        gettingError
    };
}

export async function getBookSeriesOptions(filters?: IBookSeriesFilter) {
    const { data: { items } } = await apolloClient.query({
        query: bookSeriesOptionsQuery,
        variables: { filters }
    });

    return items;
}