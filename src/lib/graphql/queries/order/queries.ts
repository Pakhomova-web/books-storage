import { gql } from '@apollo/client';

const orderFragment = gql`
    fragment Order on Order {
        id
        orderNumber
        firstName
        lastName
        phoneNumber
        trackingNumber
        isSent
        isDone
        isPaid
        isPartlyPaid
        comment
        region
        district
        city
        postcode
        novaPostOffice
        delivery {
            id
            name
            imageId
        }
        books {
            book {
                name
                bookSeries {
                    name
                    publishingHouse {
                        name
                    }
                    description
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
    query Orders($pageSettings: PageableInput, $filters: OrderSearchInput) {
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
            orderNumber
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
