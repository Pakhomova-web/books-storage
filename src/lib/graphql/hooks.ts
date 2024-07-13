import { ApolloError, DocumentNode, useMutation, useQuery } from '@apollo/client';
import {
    authorOptionsQuery,
    authorsQuery,
    bookSeriesQuery,
    booksQuery,
    bookTypeOptionsQuery,
    bookTypesQuery,
    coverTypeOptionsQuery,
    coverTypesQuery,
    createAuthorQuery,
    createBookQuery,
    createBookSeriesQuery,
    createBookTypeQuery,
    createCoverTypeQuery,
    createLanguageQuery,
    createPageTypeQuery,
    createPublishingHouseQuery,
    deleteAuthorQuery,
    deleteBookQuery,
    deleteBookSeriesQuery,
    deleteBookTypeQuery,
    deleteCoverTypeQuery,
    deleteLanguageQuery,
    deletePageTypeQuery,
    deletePublishingHouseQuery,
    languageOptionsQuery,
    languagesQuery,
    pageTypeOptionsQuery,
    pageTypesQuery,
    publishingHouseOptionsQuery,
    publishingHousesQuery,
    updateAuthorQuery,
    updateBookQuery,
    updateBookSeriesQuery,
    updateBookTypeQuery,
    updateCoverTypeQuery,
    updateLanguageQuery,
    updatePageTypeQuery,
    updatePublishingHouseQuery
} from './queries';
import {
    AuthorEntity,
    BookEntity,
    BookSeriesEntity,
    BookTypeEntity,
    CoverTypeEntity,
    IPageable,
    LanguageEntity,
    PageTypeEntity,
    PublishingHouseEntity
} from '@/lib/data/types';
import { apolloClient } from '@/lib/apollo';

/** languages **/

export function useLanguages(pageSettings?: IPageable) {
    return _useItems<LanguageEntity>(languagesQuery, pageSettings);
}

export function useLanguageOptions<T>(pageSettings?: IPageable) {
    return _useItems<T>(languageOptionsQuery, pageSettings);
}

export function useUpdateLanguage() {
    return _useUpdateItem<LanguageEntity>(updateLanguageQuery);
}

export function useCreateLanguage() {
    return _useCreateItem<LanguageEntity>(createLanguageQuery);
}

export function useDeleteLanguage() {
    return _useDeleteItemById(deleteLanguageQuery);
}

/** publishing house **/

export function usePublishingHouses(pageSettings?: IPageable) {
    return _useItems<PublishingHouseEntity>(publishingHousesQuery, pageSettings);
}

export function usePublishingHouseOptions<T>(pageSettings?: IPageable) {
    return _useItems<T>(publishingHouseOptionsQuery, pageSettings);
}

export function useDeletePublishingHouse() {
    return _useDeleteItemById(deletePublishingHouseQuery);
}

export function useUpdatePublishingHouse() {
    return _useUpdateItem<PublishingHouseEntity>(updatePublishingHouseQuery);
}

export function useCreatePublishingHouse() {
    return _useCreateItem<PublishingHouseEntity>(createPublishingHouseQuery);
}

/** page type **/

export function usePageTypes(pageSettings?: IPageable) {
    return _useItems(pageTypesQuery, pageSettings);
}

export function usePageTypeOptions<T>(pageSettings?: IPageable) {
    return _useItems<T>(pageTypeOptionsQuery, pageSettings);
}

export function useCreatePageType() {
    return _useCreateItem<PageTypeEntity>(createPageTypeQuery);
}

export function useUpdatePageType() {
    return _useUpdateItem<PageTypeEntity>(updatePageTypeQuery);
}

export function useDeletePageType() {
    return _useDeleteItemById(deletePageTypeQuery);
}

/** author **/

export function useAuthors(pageSettings?: IPageable) {
    return _useItems(authorsQuery, pageSettings);
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

/** book type **/

export function useBookTypes(pageSettings?: IPageable) {
    return _useItems<BookTypeEntity>(bookTypesQuery, pageSettings);
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

/** cover type **/

export function useCoverTypes(pageSettings?: IPageable) {
    return _useItems(coverTypesQuery, pageSettings);
}

export function useCoverTypeOptions<T>(pageSettings?: IPageable) {
    return _useItems<T>(coverTypeOptionsQuery, pageSettings);
}

export function useUpdateCoverType() {
    return _useUpdateItem<CoverTypeEntity>(updateCoverTypeQuery);
}

export function useCreateCoverType() {
    return _useCreateItem<CoverTypeEntity>(createCoverTypeQuery);
}

export function useDeleteCoverType() {
    return _useDeleteItemById(deleteCoverTypeQuery);
}

/** cover type **/

export function useBookSeries(pageSettings?: IPageable) {
    return _useItems(bookSeriesQuery, pageSettings);
}

export function useUpdateBookSeries() {
    return _useUpdateItem<BookSeriesEntity>(updateBookSeriesQuery);
}

export function useCreateBookSeries() {
    return _useCreateItem<BookSeriesEntity>(createBookSeriesQuery);
}

export function useDeleteBookSeries() {
    return _useDeleteItemById(deleteBookSeriesQuery);
}

export function useBookSeriesOptions(filters?: BookSeriesEntity) {
    const { items, loading, gettingError, refetch } = _useItems<BookSeriesEntity>(bookSeriesQuery, null, filters);

    return {
        refetch,
        items: items.map(item => ({ id: item.id, label: `${item.name} (${item.publishingHouse?.name})` })),
        loading,
        gettingError
    };
}

export async function getBookSeriesOptions(filters?: BookSeriesEntity) {
    const { data } = await apolloClient.query({
        query: bookSeriesQuery,
        variables: { filters }
    });

    return data.items.map(item => ({ id: item.id, label: `${item.name}` }));
}

/** books **/

export function useBooks(pageSettings: IPageable, filters?: BookEntity) {
    return _usePageableItems<BookEntity>(booksQuery, 'books', pageSettings, filters);
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

/** common **/

function _useItems<T>(query: DocumentNode, pageSettings?: IPageable, filters?: T): {
    items: T[],
    totalCount?: number,
    loading: boolean,
    gettingError: ApolloError,
    refetch: Function
} {
    const { data, error, loading, refetch } = useQuery(query, {
        fetchPolicy: 'no-cache',
        variables: { ...pageSettings, filters }
    });

    return { items: data?.items || [], totalCount: data?.totalCount, gettingError: error, loading, refetch };
}

function _usePageableItems<T>(query: DocumentNode, key: string, pageSettings: IPageable, filters?: T): {
    items: T[],
    totalCount: number,
    loading: boolean,
    gettingError: ApolloError,
    refetch: Function
} {
    const { data, error, loading, refetch } = useQuery(query, {
        fetchPolicy: 'no-cache',
        variables: { pageSettings, filters }
    });

    return {
        items: data && data[key] ? data[key].items : [],
        totalCount: data && data[key] ? data[key].totalCount : 0,
        gettingError: error,
        loading,
        refetch
    };
}

function _useDeleteItemById(query: DocumentNode): {
    deleting: boolean,
    deletingError: ApolloError,
    deleteItem: Function
} {
    const [mutate, { loading, error }] = useMutation(query);

    return {
        deleteItem: async (id: string) => {
            const { data: { item } } = await mutate({ variables: { id } });

            return item;
        },
        deleting: loading,
        deletingError: error
    };
}

function _useUpdateItem<K>(query: DocumentNode): { updating: boolean, updatingError: ApolloError, update: Function } {
    const [mutate, { loading, error }] = useMutation(query);

    return {
        update: async (input: K) => {
            const { data: { item } } = await mutate({ variables: { input } });

            return item;
        },
        updating: loading,
        updatingError: error
    };
}

function _useCreateItem<K>(query: DocumentNode): { creating: boolean, creatingError: ApolloError, create: Function } {
    const [mutate, { loading, error }] = useMutation(query);

    return {
        create: async (input: K) => {
            const { data: { item } } = await mutate({ variables: { input } });

            return item;
        },
        creating: loading,
        creatingError: error
    };
}
