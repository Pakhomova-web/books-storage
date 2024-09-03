import { gql } from '@apollo/client';

const bookSeriesFragment = gql`
    fragment BookSeries on BookSeries {
        id
        name
        publishingHouse {
            id
            name
            tags
        }
    }
`;

export const bookSeriesQuery = gql`
    query BookSeries($pageSettings: PageableInput, $filters: BookSeriesSearchInput) {
        bookSeries(pageSettings: $pageSettings, filters: $filters) {
            items {
                ...BookSeries
            }
            totalCount
        }
    }
    ${bookSeriesFragment}
`;

export const bookSeriesOptionsQuery = gql`
    query BookSeries($filters: BookSeriesSearchInput) {
        items: bookSeriesOptions(filters: $filters) {
            id
            label: name
        }
    }
`;

export const deleteBookSeriesQuery = gql`
    mutation DeleteBookSeries($id: ID!) {
        item: deleteBookSeries(id: $id) {
            id
        }
    }
`;

export const createBookSeriesQuery = gql`
    mutation CreateBookSeries($input: BookSeriesCreateInput!) {
        item: createBookSeries(input: $input) {
            ...BookSeries
        }
    }
    ${bookSeriesFragment}
`;

export const updateBookSeriesQuery = gql`
    mutation UpdateBookSeries($input: BookSeriesUpdateInput!) {
        item: updateBookSeries(input: $input) {
            ...BookSeries
        }
    }
    ${bookSeriesFragment}
`;
