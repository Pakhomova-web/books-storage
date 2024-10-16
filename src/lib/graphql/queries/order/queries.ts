import { gql } from '@apollo/client';

const orderFragment = gql`
    fragment Order on Order {
        id
        customerFirstName
        customerLastName
        customerPhoneNumber
        trackingNumber
        isSent
        isDone
        isPaid
        isPartlyPaid
        description
        address {
            region
            district
            city
            postcode
        }
        delivery {
            name
        }
        books {
            book {
                name
                bookSeries {
                    name
                    publishingHouse {
                        name
                    }
                }
                bookType {
                    name
                }
            }
            count
            discount
            price
        }
    }
`;

export const ordersQuery = gql`
    query Orders($pageSettings: PageableInput, $filters: SearchByNameInput) {
        orders(pageSettings: $pageSettings, filters: $filters) {
            items {
                ...Order
            }
            totalCount
        }
    }
    ${orderFragment}
`;

export const createOrderQuery = gql`
    mutation CreateOrder($input: OrderCreateInput!) {
        item: createOrder(input: $input) {
            id
        }
    }
`;

export const updateOrderQuery = gql`
    mutation UpdateOrder($input: OrderUpdateInput!) {
        item: updateOrder(input: $input) {
            id
        }
    }
`;

export const deleteOrderQuery = gql`
    mutation DeleteOrder($id: ID!) {
        item: deleteOrder(id: $id) {
            id
        }
    }
`;
