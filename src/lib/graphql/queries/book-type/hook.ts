import { BookTypeEntity, IOption, IPageable, NameFilter } from '@/lib/data/types';
import {
    _useCreateItem,
    _useDeleteItemById,
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
    return _useItems<BookTypeEntity, NameFilter>(bookTypesQuery, pageSettings, filters);
}

export function getBookTypeById(id: string): Promise<BookTypeEntity> {
    return getItemById<BookTypeEntity>(bookTypeByIdQuery, id);
}

export function useBookTypeOptions() {
    return _useItems<IOption<string>, NameFilter>(bookTypeOptionsQuery);
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
