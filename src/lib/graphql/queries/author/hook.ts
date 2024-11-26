import { AuthorEntity, IAuthorFilter, IOption, IPageable, NameFilter } from '@/lib/data/types';
import {
    _useCreateItem,
    _useDeleteItemById,
    _useItems,
    _usePageableItems,
    _useUpdateItem,
    getItemById
} from '@/lib/graphql/base-hooks';
import {
    authorByIdQuery,
    authorOptionsQuery,
    authorsQuery,
    createAuthorQuery,
    deleteAuthorQuery,
    updateAuthorQuery
} from '@/lib/graphql/queries/author/queries';

export function useAuthors(pageSettings?: IPageable, filters?: IAuthorFilter) {
    return _usePageableItems(authorsQuery, 'authors', pageSettings, filters);
}

export function useAuthorOptions() {
    return _useItems<IOption<string>, NameFilter>(authorOptionsQuery);
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
