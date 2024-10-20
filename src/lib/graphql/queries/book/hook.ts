import { BookEntity, BookFilter, IPageable } from '@/lib/data/types';
import {
    _useAllItems, _useItemById,
    _useCreateItem,
    _useDeleteItemById,
    _usePageableItems,
    _useUpdateItem
} from '@/lib/graphql/base-hooks';
import {
    bookByIdQuery,
    booksQuery,
    createBookQuery,
    deleteBookQuery,
    updateBookNumberInStockQuery,
    updateBookQuery
} from '@/lib/graphql/queries/book/queries';
import { GraphQLError } from 'graphql/error';

export function useBooks(pageSettings?: IPageable, filters?: BookFilter) {
    return _usePageableItems<BookEntity>(booksQuery, 'books', pageSettings, filters);
}

export function useBook(id: string) {
    return _useItemById<BookEntity>(bookByIdQuery, 'bookById', id);
}

export function getAllBooks(pageSettings?: IPageable, filters?: BookFilter) {
    return _useAllItems<BookEntity>(booksQuery, 'books', pageSettings, filters);
}

export function useDeleteBook() {
    return _useDeleteItemById(deleteBookQuery);
}

export function useCreateBook() {
    return _useCreateItem<BookEntity>(createBookQuery);
}

export function useUpdateBook() {
    return _useUpdateItem<BookEntity>(updateBookQuery);
}

export function useUpdateBookNumberInStock() {
    return _useUpdateItem<BookEntity>(updateBookNumberInStockQuery);
}
