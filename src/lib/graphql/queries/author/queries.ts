import { gql } from '@apollo/client';

const authorFragment = gql`
    fragment Author on Author {
        id
        name
        description
    }
`;

export const authorsQuery = gql`
    query Authors($pageSettings: PageableInput, $filters: SearchByNameInput) {
        items: authors(pageSettings: $pageSettings, filters: $filters) {
            ...Author
        }
    }
    ${authorFragment}
`;

export const authorOptionsQuery = gql`
    query Authors($pageSettings: PageableInput, $filters: SearchByNameInput) {
        items: authors(pageSettings: $pageSettings, filters: $filters) {
            id
            label: name
        }
    }
`;

export const deleteAuthorQuery = gql`
    mutation DeleteAuthor($id: ID!) {
        item: deleteAuthor(id: $id) {
            id
        }
    }
`;

export const createAuthorQuery = gql`
    mutation CreateAuthor($input: AuthorCreateInput!) {
        item: createAuthor(input: $input) {
            id
        }
    }
`;

export const updateAuthorQuery = gql`
    mutation UpdateAuthor($input: AuthorUpdateInput!) {
        item: updateAuthor(input: $input) {
            id
        }
    }
`;
