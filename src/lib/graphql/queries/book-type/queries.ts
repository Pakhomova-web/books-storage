import { gql } from '@apollo/client';

const bookTypeFragment = gql`
    fragment BookType on BookType {
        id
        name
        imageId
    }
`;

export const bookTypesQuery = gql`
    query BookTypes($pageSettings: PageableInput, $filters: SearchByNameInput) {
        bookTypes(pageSettings: $pageSettings, filters: $filters) {
            items {
                ...BookType
            }
            totalCount
        }
    }
    ${bookTypeFragment}
`;

export const bookTypeByIdQuery = gql`
    query BookTypeById($id: ID!) {
        item: bookTypeById(id: $id) {
            ...BookType
        }
    }
    ${bookTypeFragment}
`;

export const bookTypeOptionsQuery = gql`
    query BookTypes($pageSettings: PageableInput, $filters: SearchByNameInput) {
        bookTypes(pageSettings: $pageSettings, filters: $filters) {
            items {
                id
                label: name
            }
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
            id
        }
    }
`;

export const updateBookTypeQuery = gql`
    mutation UpdateBookType($input: BookTypeUpdateInput!) {
        item: updateBookType(input: $input) {
            id
        }
    }
`;
