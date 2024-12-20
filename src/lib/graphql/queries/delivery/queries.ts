import { gql } from '@apollo/client';

export const deliveriesQuery = gql`
    query Deliveries($pageSettings: PageableInput, $filters: SearchByNameInput) {
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

export const deliveryOptionsQuery = gql`
    query DeliveryOptions {
        items: deliveryOptions {
            id
            name
            imageId
        }
    }
`;

export const ukrPoshtaWarehousesQuery = gql`
    query UkrPoshtaWarehouses {
        items: ukrPoshtaWarehouses {
            warehouse
            city
            region
            district
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
