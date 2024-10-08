import { gql } from '@apollo/client';

const bookTypeFragment = gql`
    fragment BookType on BookType {
        id
        name
    }
`;

export const bookTypesQuery = gql`
    query BookTypes($pageSettings: PageableInput, $filters: SearchByNameInput) {
        items: bookTypes(pageSettings: $pageSettings, filters: $filters) {
            ...BookType
        }
    }
    ${bookTypeFragment}
`;

export const bookTypeOptionsQuery = gql`
    query BookTypes($pageSettings: PageableInput, $filters: SearchByNameInput) {
        items: bookTypes(pageSettings: $pageSettings, filters: $filters) {
            id
            label: name
        }
    }
`;

export const deleteBookTypeQuery = gql`
    mutation DeleteBookType($id: ID!) {
        item: deleteBookType(id: $id) {
            id
        }
    }
`;

export const createBookTypeQuery = gql`
    mutation CreateBookType($input: BookTypeCreateInput!) {
        item: createBookType(input: $input) {
            ...BookType
        }
    }
    ${bookTypeFragment}
`;

export const updateBookTypeQuery = gql`
    mutation UpdateBookType($input: BookTypeUpdateInput!) {
        item: updateBookType(input: $input) {
            ...BookType
        }
    }
    ${bookTypeFragment}
`;
