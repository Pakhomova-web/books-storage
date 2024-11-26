import { gql } from '@apollo/client';

const publishingHouseFragment = gql`
    fragment PublishingHouse on PublishingHouse {
        id
        name
        tags
        imageId
    }
`;

export const publishingHousesQuery = gql`
    query PublishingHouses($pageSettings: PageableInput, $filters: SearchByNameInput) {
        publishingHouses(pageSettings: $pageSettings, filters: $filters) {
            items {
                ...PublishingHouse
            }
            totalCount
        }
    }
    ${publishingHouseFragment}
`;

export const publishingHouseByIdQuery = gql`
    query PublishingHouseById($id: ID!) {
        item: publishingHouseById(id: $id) {
            ...PublishingHouse
        }
    }
    ${publishingHouseFragment}
`;

export const publishingHouseOptionsQuery = gql`
    query PublishingHouses($pageSettings: PageableInput, $filters: SearchByNameInput) {
        publishingHouses(pageSettings: $pageSettings, filters: $filters) {
            items {
                id
                label: name
            }
        }
    }
`;

export const deletePublishingHouseQuery = gql`
    mutation DeletePublishingHouse($id: ID!) {
        item: deletePublishingHouse(id: $id) {
            id
        }
    }
`;

export const createPublishingHouseQuery = gql`
    mutation CreatePublishingHouse($input: PublishingHouseCreateInput!) {
        item: createPublishingHouse(input: $input) {
            ...PublishingHouse
        }
    }
    ${publishingHouseFragment}
`;

export const updatePublishingHouseQuery = gql`
    mutation UpdatePublishingHouse($input: PublishingHouseUpdateInput!) {
        item: updatePublishingHouse(input: $input) {
            ...PublishingHouse
        }
    }
    ${publishingHouseFragment}
`;
