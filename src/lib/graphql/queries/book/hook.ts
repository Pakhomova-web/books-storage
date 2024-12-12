import { BookEntity, BookFilter, CommentEntity, IPageable } from '@/lib/data/types';
import {
    _useAllItems,
    _useCreateItem,
    _useItemById,
    _usePageableItems,
    _useUpdateItem, getItemById
} from '@/lib/graphql/base-hooks';
import {
    addBookCommentQuery,
    addBookInBasketQuery,
    approveComment,
    bookByIdQuery,
    bookCommentsQuery,
    booksByAuthorQuery,
    booksByIdsQuery,
    booksFromSeries,
    booksNameByQuickSearchQuery,
    booksQuery,
    booksWithDiscountQuery,
    booksWithNotApprovedCommentsQuery,
    changeRecentlyViewedBooksQuery,
    createBookQuery,
    likeBookQuery,
    removeBookFromBasketQuery,
    removeComment,
    topOfSoldBooksQuery,
    unlikeBookQuery,
    updateBookCountInBasketQuery,
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

export async function getBookNamesByQuickSearch(quickSearch: string) {
    const { data: { items } } = await apolloClient.query({
        query: booksNameByQuickSearchQuery,
        fetchPolicy: 'no-cache',
        variables: { quickSearch }
    });

    return items;
}

export async function getBooksFromSeries(bookId: string, rowsPerPage: number) {
    const { data: { items } } = await apolloClient.query({
        query: booksFromSeries,
        fetchPolicy: 'no-cache',
        variables: { bookId, rowsPerPage }
    });

    return items;
}

export async function getBooksByAuthors(authorId: string, rowsPerPage: number, excludeBookSeriesId?: string) {
    const { data: { items } } = await apolloClient.query({
        query: booksByAuthorQuery,
        fetchPolicy: 'no-cache',
        variables: { authorId, rowsPerPage, excludeBookSeriesId }
    });

    return items;
}

export function useBooksWithDiscount(rowsPerPage: number) {
    const { data, loading, error } = useQuery(booksWithDiscountQuery, {
        fetchPolicy: 'no-cache',
        variables: { rowsPerPage }
    });

    return { items: data?.items ? data.items : [], loading, error };
}

export function useTopOfSoldBooks(rowsPerPage: number) {
    const { data, loading, error } = useQuery(topOfSoldBooksQuery, {
        fetchPolicy: 'no-cache',
        variables: { rowsPerPage }
    });

    return { items: data?.items ? data.items : [], loading, error };
}

export function getAllBooks(pageSettings?: IPageable, filters?: BookFilter) {
    return _useAllItems<BookEntity>(booksQuery, 'books', pageSettings, filters);
}

export function useBooksByIds(ids: string[], pageSettings?: IPageable) {
    const { data, loading, error, refetch } = useQuery(booksByIdsQuery, {
        fetchPolicy: 'no-cache',
        variables: { ids, pageSettings: pageSettings ? pageSettings : { page: 0, rowsPerPage: (ids || []).length } }
    });

    return {
        items: data ? data.booksByIds.items : [],
        totalCount: data ? data.booksByIds.totalCount : 0,
        loading,
        error,
        refetch
    };
}

export function useBooksComments(pageSettings?: IPageable) {
    return _usePageableItems<BookEntity>(booksWithNotApprovedCommentsQuery, 'booksWithNotApprovedComments', pageSettings);
}

export function useCreateBook() {
    return _useCreateItem<BookEntity>(createBookQuery);
}

export function useUpdateBook() {
    const [mutate, { loading, error }] = useMutation(updateBookQuery);

    return {
        update: async (input, updateAllBooksInSeries?: boolean) => {
            const { data: { item } } = await mutate({
                fetchPolicy: 'no-cache',
                variables: { input, updateAllBooksInSeries }
            });

            return item;
        },
        updating: loading,
        updatingError: error
    };
}

export function useUpdateBookNumberInStock() {
    return _useUpdateItem<BookEntity>(updateBookNumberInStockQuery);
}

export function useApproveComment() {
    return _useUpdateItem<BookEntity>(approveComment);
}

export function useRemoveComment() {
    return _useUpdateItem<BookEntity>(removeComment);
}

export function getBookById(id: string) {
    return getItemById<BookEntity>(bookByIdQuery, id, 'bookById');
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

export async function likeBook(id: string): Promise<string[]> {
    const { data: { ids } } = await apolloClient.mutate({ mutation: likeBookQuery, variables: { id } });

    return ids;
}

export async function unlikeBook(id: string): Promise<string[]> {
    const { data: { ids } } = await apolloClient.mutate({ mutation: unlikeBookQuery, variables: { id } });

    return ids;
}

export async function changeRecentlyViewedBooks(id: string): Promise<BookEntity[]> {
    const { data: { books } } = await apolloClient.mutate({
        mutation: changeRecentlyViewedBooksQuery,
        variables: { id }
    });

    return books;
}

export async function addBookInBasket(id: string): Promise<string[]> {
    const { data: { items } } = await apolloClient.mutate({ mutation: addBookInBasketQuery, variables: { id } });

    return items;
}

export async function removeBookFromBasket(id: string): Promise<string[]> {
    const { data: { items } } = await apolloClient.mutate({ mutation: removeBookFromBasketQuery, variables: { id } });

    return items;
}

export function useUpdateBookCountInBasket() {
    const [mutate, { loading, error }] = useMutation(updateBookCountInBasketQuery);

    return {
        update: async (id: string, count: number) => {
            const { data: { items } } = await mutate({
                fetchPolicy: 'no-cache',
                variables: { id, count }
            });

            return items;
        },
        updating: loading,
        updatingError: error
    };
}
