import { gql } from '@apollo/client';

const pageTypeFragment = gql`
    fragment PageType on PageType {
        id
        name
    }
`;

export const pageTypesQuery = gql`
    query PageTypes($pageSettings: PageableInput, $filters: SearchByNameInput) {
        items: pageTypes(pageSettings: $pageSettings, filters: $filters) {
            ...PageType
        }
    }
    ${pageTypeFragment}
`;

export const pageTypeOptionsQuery = gql`
    query PageTypes($pageSettings: PageableInput, $filters: SearchByNameInput) {
        items: pageTypes(pageSettings: $pageSettings, filters: $filters) {
            id
            label: name
        }
    }
`;

export const deletePageTypeQuery = gql`
    mutation DeletePageType($id: ID!) {
        item: deletePageType(id: $id) {
            id
        }
    }
`;

export const createPageTypeQuery = gql`
    mutation CreatePageType($input: PageTypeCreateInput!) {
        item: createPageType(input: $input) {
            ...PageType
        }
    }
    ${pageTypeFragment}
`;

export const updatePageTypeQuery = gql`
    mutation UpdatePageType($input: PageTypeUpdateInput!) {
        item: updatePageType(input: $input) {
            ...PageType
        }
    }
    ${pageTypeFragment}
`;
