import { AuthorEntity, IAuthorFilter, IOption, IPageable } from '@/lib/data/types';
import {
    _useCreateItem,
    _useDeleteItemById,
    _useItems,
    _useOptions,
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
    return _usePageableItems<AuthorEntity>(authorsQuery, 'authors', pageSettings, filters);
}

export function useAuthorOptions() {
    return _useItems<IOption<string>, IAuthorFilter>(authorOptionsQuery);
}

export async function getAuthorOptions(filters?: IAuthorFilter): Promise<IOption<string>[]> {
    return _useOptions<IOption<string>>(authorOptionsQuery, filters);
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
