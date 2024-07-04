import { DocumentNode, useMutation, useQuery } from '@apollo/client';
import {
    authorOptionsQuery,
    authorsQuery,
    bookSeriesQuery,
    booksQuery, bookTypeOptionsQuery,
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
import { TableSort } from '@/components/table/table-key';
import {
    AuthorEntity,
    BookEntity,
    BookSeriesEntity,
    BookTypeEntity,
    CoverTypeEntity,
    LanguageEntity,
    PageTypeEntity,
    PublishingHouseEntity
} from '@/lib/data/types';
import { apolloClient } from '@/lib/apollo';


/** languages **/

export function useLanguages(sort?: TableSort) {
    return _useItems(languagesQuery, sort);
}

export function useLanguageOptions(sort?: TableSort) {
    return _useItems(languageOptionsQuery, sort);
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

export function usePublishingHouses(sort?: TableSort) {
    return _useItems(publishingHousesQuery, sort);
}

export function usePublishingHouseOptions(sort?: TableSort) {
    return _useItems(publishingHouseOptionsQuery, sort);
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

export function usePageTypes(sort?: TableSort) {
    return _useItems(pageTypesQuery, sort);
}

export function usePageTypeOptions(sort?: TableSort) {
    return _useItems(pageTypeOptionsQuery, sort);
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

export function useAuthors(sort?: TableSort) {
    return _useItems(authorsQuery, sort);
}

export function useAuthorOptions(sort?: TableSort) {
    return _useItems(authorOptionsQuery, sort);
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

export function useBookTypes(sort?: TableSort) {
    return _useItems(bookTypesQuery, sort);
}

export function useBookTypeOptions(sort?: TableSort) {
    return _useItems(bookTypeOptionsQuery, sort);
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

export function useCoverTypes(sort?: TableSort) {
    return _useItems(coverTypesQuery, sort);
}

export function useCoverTypeOptions(sort?: TableSort) {
    return _useItems(coverTypeOptionsQuery, sort);
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

export function useBookSeries(sort?: TableSort) {
    return _useItems(bookSeriesQuery, sort);
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
    const { items, loading, error, refetch } = _useItems(bookSeriesQuery, null, filters);

    return {
        refetch,
        items: items.map(item => ({ id: item.id, label: `${item.name} (${item.publishingHouse?.name})` })),
        loading,
        error
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

export function useBooks(sort?: TableSort) {
    return _useItems(booksQuery, sort);
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

function _useItems(query: DocumentNode, sort?: TableSort, filters?) {
    const { data, error, loading, refetch } = useQuery(query, {
        variables: { ...sort, filters }
    });

    return { items: data?.items || [], error: Boolean(error), loading, refetch };
}

function _useDeleteItemById(query: DocumentNode) {
    const [mutate, { loading }] = useMutation(query);

    return {
        deleteItem: async (id: string) => {
            const { data: { item } } = await mutate({ variables: { id } });

            return item;
        },
        loading
    };
}

function _useUpdateItem<K>(query: DocumentNode) {
    const [mutate, { loading, error }] = useMutation(query);

    return {
        update: async (input: K) => {
            const { data: { item } } = await mutate({ variables: { input } });

            return item;
        },
        loading,
        error
    };
}

function _useCreateItem<K>(query: DocumentNode) {
    const [mutate, { loading, error }] = useMutation(query);

    return {
        create: async (input: K) => {
            const { data: { item } } = await mutate({ variables: { input } });

            return item;
        },
        loading,
        error
    };
}
