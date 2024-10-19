import { BookTypeEntity, IPageable } from '@/lib/data/types';
import {
    _useCreateItem,
    _useDeleteItemById,
    _useItemById,
    _useItems,
    _useUpdateItem,
    getItemById
} from '@/lib/graphql/base-hooks';
import {
    bookTypeByIdQuery,
    bookTypeOptionsQuery, bookTypesQuery,
    createBookTypeQuery,
    deleteBookTypeQuery,
    updateBookTypeQuery
} from '@/lib/graphql/queries/book-type/queries';

export function useBookTypes(pageSettings?: IPageable, filters?: BookTypeEntity) {
    return _useItems<BookTypeEntity>(bookTypesQuery, pageSettings, filters);
}

export function getBookTypeById(id: string): Promise<BookTypeEntity> {
    return getItemById<BookTypeEntity>(bookTypeByIdQuery, id);
}

export function useBookTypeOptions<T>(pageSettings?: IPageable) {
    return _useItems<T>(bookTypeOptionsQuery, pageSettings);
}

export function useUpdateBookType() {
    return _useUpdateItem<BookTypeEntity>(updateBookTypeQuery);
}

export function useCreateBookType() {
    return _useCreateItem<BookTypeEntity>(createBookTypeQuery);
}

export function useDeleteBookType() {
    return _useDeleteItemById(deleteBookTypeQuery);
}
