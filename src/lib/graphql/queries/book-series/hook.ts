import { BookSeriesEntity, BookSeriesFilter, IPageable } from '@/lib/data/types';
import { apolloClient } from '@/lib/apollo';
import {
    _useCreateItem,
    _useDeleteItemById,
    _useItems,
    _usePageableItems,
    _useUpdateItem,
    getItemById
} from '@/lib/graphql/base-hooks';
import {
    bookSeriesByIdQuery,
    bookSeriesOptionsQuery,
    bookSeriesQuery,
    createBookSeriesQuery,
    deleteBookSeriesQuery,
    fullBookSeriesOptionsQuery,
    updateBookSeriesQuery
} from '@/lib/graphql/queries/book-series/queries';

export function useBookSeries(pageSettings?: IPageable, filters?: BookSeriesFilter) {
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

export function useBookSeriesOptions(filters?: BookSeriesFilter, displayPublishingHouse = true) {
    const {
        items,
        loading,
        gettingError,
        refetch
    } = _useItems<BookSeriesEntity, BookSeriesFilter>(fullBookSeriesOptionsQuery, null, filters);

    return {
        refetch,
        items: items.map(item => ({
            id: item.id,
            label: `${item.name}${displayPublishingHouse ? ` (${item.publishingHouse?.name})` : ''}`
        })),
        loading,
        gettingError
    };
}

export async function getBookSeriesOptions(filters?: BookSeriesFilter) {
    const { data: { items } } = await apolloClient.query({
        query: bookSeriesOptionsQuery,
        fetchPolicy: 'no-cache',
        variables: { filters }
    });

    return items;
}

export async function getBookSeriesById(id: string): Promise<BookSeriesEntity> {
    return getItemById<BookSeriesEntity>(bookSeriesByIdQuery, id);
}
