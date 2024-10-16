import { gql } from '@apollo/client';

const coverTypeFragment = gql`
    fragment CoverType on CoverType {
        id
        name
    }
`;

export const coverTypesQuery = gql`
    query CoverTypes($pageSettings: PageableInput, $filters: SearchByNameInput) {
        items: coverTypes(pageSettings: $pageSettings, filters: $filters) {
            ...CoverType
        }
    }
    ${coverTypeFragment}
`;

export const coverTypeOptionsQuery = gql`
    query CoverTypes($pageSettings: PageableInput, $filters: SearchByNameInput) {
        items: coverTypes(pageSettings: $pageSettings, filters: $filters) {
            id
            label: name
        }
    }
`;

export const deleteCoverTypeQuery = gql`
    mutation DeleteCoverType($id: ID!) {
        item: deleteCoverType(id: $id) {
            id
        }
    }
`;

export const createCoverTypeQuery = gql`
    mutation CreateCoverType($input: CoverTypeCreateInput!) {
        item: createCoverType(input: $input) {
            id
        }
    }
`;

export const updateCoverTypeQuery = gql`
    mutation UpdateCoverType($input: CoverTypeUpdateInput!) {
        item: updateCoverType(input: $input) {
            id
        }
    }
`;
