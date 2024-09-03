import { BookEntity, IBookFilter, IPageable } from '@/lib/data/types';
import {
    _getAllItems,
    _useCreateItem,
    _useDeleteItemById,
    _usePageableItems,
    _useUpdateItem
} from '@/lib/graphql/base-hooks';
import { booksQuery, createBookQuery, deleteBookQuery, updateBookNumberInStockQuery } from '@/lib/graphql/queries/book/queries';

export function useBooks(pageSettings?: IPageable, filters?: IBookFilter) {
    return _usePageableItems<BookEntity>(booksQuery, 'books', pageSettings, filters);
}

export function getAllBooks(pageSettings?: IPageable, filters?: IBookFilter) {
    return _getAllItems<BookEntity>(booksQuery, 'books', pageSettings, filters);
}

export function useDeleteBook() {
    return _useDeleteItemById(deleteBookQuery);
}

export function useCreateBook() {
    return _useCreateItem<BookEntity>(createBookQuery);
}

export function useUpdateBook() {
    // @ts-ignore
    return _useUpdateItem<BookEntity>(updateBookQuery);
}

export function useUpdateBookNumberInStock() {
    return _useUpdateItem<BookEntity>(updateBookNumberInStockQuery);
}
