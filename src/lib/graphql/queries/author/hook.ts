import { AuthorEntity, IPageable } from '@/lib/data/types';
import { _useCreateItem, _useDeleteItemById, _useItems, _useUpdateItem } from '@/lib/graphql/base-hooks';
import {
    authorOptionsQuery,
    authorsQuery,
    createAuthorQuery,
    deleteAuthorQuery,
    updateAuthorQuery
} from '@/lib/graphql/queries/author/queries';

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
