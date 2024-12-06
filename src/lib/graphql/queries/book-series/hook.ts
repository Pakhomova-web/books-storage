import { BookSeriesEntity, BookSeriesFilter, IOption, IPageable } from '@/lib/data/types';
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

export function useBookSeriesOptions(filters?: BookSeriesFilter) {
    return _useItems<IOption<string>, BookSeriesFilter>(bookSeriesOptionsQuery, null, filters);
}

export async function getBookSeriesOptions(filters?: BookSeriesFilter) {
    return _useItems<IOption<string>, BookSeriesFilter>(bookSeriesOptionsQuery, null, filters);
}

export async function getBookSeriesById(id: string): Promise<BookSeriesEntity> {
    return getItemById<BookSeriesEntity>(bookSeriesByIdQuery, id);
}
