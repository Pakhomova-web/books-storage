import { gql } from '@apollo/client';

export const deliveriesQuery = gql`
    query Languages($pageSettings: PageableInput, $filters: SearchByNameInput) {
        deliveries(pageSettings: $pageSettings, filters: $filters) {
            items {
                id
                name
                imageId
            }
            totalCount
        }
    }
`;

export const createDeliveryQuery = gql`
    mutation CreateDelivery($input: DeliveryCreateInput!) {
        item: createDelivery(input: $input) {
            id
        }
    }
`;

export const updateDeliveryQuery = gql`
    mutation UpdateDelivery($input: DeliveryUpdateInput!) {
        item: updateDelivery(input: $input) {
            id
        }
    }
`;

export const deleteDeliveryQuery = gql`
    mutation DeleteDelivery($id: ID!) {
        item: deleteDelivery(id: $id) {
            id
        }
    }
`;
