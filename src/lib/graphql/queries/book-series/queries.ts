import { gql } from '@apollo/client';

const bookSeriesFragment = gql`
    fragment BookSeries on BookSeries {
        id
        name
        publishingHouse {
            id
            name
            tags
            imageId
        }
        default
        description
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

export const fullBookSeriesOptionsQuery = gql`
    query BookSeries($filters: BookSeriesSearchInput) {
        items: fullBookSeriesOptions(filters: $filters) {
            ...BookSeries
        }
    }
    ${bookSeriesFragment}
`;

export const bookSeriesOptionsQuery = gql`
    query BookSeries($filters: BookSeriesSearchInput) {
        items: bookSeriesOptions(filters: $filters) {
            id
            label: name
            description
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

export const bookSeriesByIdQuery = gql`
    query BookSeries($id: ID!) {
        item: bookSeriesByIdQuery(id: $id) {
            ...BookSeries
        }
    }
    ${bookSeriesFragment}
`;


export const createBookSeriesQuery = gql`
    mutation CreateBookSeries($input: BookSeriesCreateInput!) {
        item: createBookSeries(input: $input) {
            id
        }
    }
`;

export const updateBookSeriesQuery = gql`
    mutation UpdateBookSeries($input: BookSeriesUpdateInput!) {
        item: updateBookSeries(input: $input) {
            id
        }
    }
`;
