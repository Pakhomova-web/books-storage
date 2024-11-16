import { gql } from '@apollo/client';

export const deliveriesQuery = gql`
    query Languages($pageSettings: PageableInput, $filters: SearchByNameInput) {
        items: deliveries(pageSettings: $pageSettings, filters: $filters) {
            id
            name
            imageId
        }
    }
`;

export const deliveryOptionsQuery = gql`
    query Deliveries($pageSettings: PageableInput, $filters: SearchByNameInput) {
        items: deliveries(pageSettings: $pageSettings, filters: $filters) {
            id
            label: name
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
