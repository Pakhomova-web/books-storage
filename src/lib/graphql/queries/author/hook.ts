import { AuthorEntity, BookTypeEntity, IPageable } from '@/lib/data/types';
import { _useCreateItem, _useDeleteItemById, _useItems, _useUpdateItem, getItemById } from '@/lib/graphql/base-hooks';
import {
    authorByIdQuery,
    authorOptionsQuery,
    authorsQuery,
    createAuthorQuery,
    deleteAuthorQuery,
    updateAuthorQuery
} from '@/lib/graphql/queries/author/queries';
import { bookTypeByIdQuery } from '@/lib/graphql/queries/book-type/queries';

export function useAuthors(pageSettings?: IPageable, filters?: AuthorEntity) {
    return _useItems(authorsQuery, pageSettings, filters);
}

export function useAuthorOptions<T>(pageSettings?: IPageable) {
    return _useItems<T>(authorOptionsQuery, pageSettings);
}

export function useCreateAuthor() {
    return _useCreateItem<AuthorEntity>(createAuthorQuery);
}

export function useUpdateAuthor() {
    return _useUpdateItem<AuthorEntity>(updateAuthorQuery);
}

export function useDeleteAuthor() {
    return _useDeleteItemById(deleteAuthorQuery);
}

export function getAuthorById(id: string): Promise<AuthorEntity> {
    return getItemById<AuthorEntity>(authorByIdQuery, id);
}
