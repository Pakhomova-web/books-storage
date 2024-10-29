import { BookEntity, BookFilter, CommentEntity, IPageable } from '@/lib/data/types';
import {
    _useAllItems,
    _useCreateItem,
    _useItemById,
    _usePageableItems,
    _useUpdateItem
} from '@/lib/graphql/base-hooks';
import {
    addBookCommentQuery,
    bookByIdQuery,
    bookCommentsQuery,
    booksQuery,
    createBookQuery,
    updateBookNumberInStockQuery,
    updateBookQuery
} from '@/lib/graphql/queries/book/queries';
import { useMutation, useQuery } from '@apollo/client';
import { apolloClient } from '@/lib/apollo';

export function useBooks(pageSettings?: IPageable, filters?: BookFilter) {
    const data = _usePageableItems<BookEntity>(booksQuery, 'books', pageSettings, filters);

    data.items = data.items.map(item => new BookEntity(item));
    return data;
}

export function useBook(id: string) {
    return _useItemById<BookEntity>(bookByIdQuery, 'bookById', id);
}

export async function getBookComments(id: string, page: number, rowsPerPage: number) {
    const { data: { items } } = await apolloClient.query({
        query: bookCommentsQuery,
        fetchPolicy: 'no-cache',
        variables: { id, page, rowsPerPage }
    });

    return items;
}

export function getAllBooks(pageSettings?: IPageable, filters?: BookFilter) {
    return _useAllItems<BookEntity>(booksQuery, 'books', pageSettings, filters);
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

export function useAddBookComment() {
    const [mutate, { loading, error }] = useMutation(addBookCommentQuery);

    return {
        addComment: async (id: string, input: CommentEntity) => {
            const { data: { item } } = await mutate({
                fetchPolicy: 'no-cache',
                variables: { id, input }
            });

            return item;
        },
        addingComment: loading,
        addingCommentError: error
    };
}
