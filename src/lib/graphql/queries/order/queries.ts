import { gql } from '@apollo/client';

const orderFragment = gql`
    fragment Order on Order {
        id
        user {
            email
            instagramUsername
        }
        orderNumber
        firstName
        lastName
        phoneNumber
        trackingNumber
        instagramUsername
        isConfirmed
        isCanceled
        isSent
        isDone
        isPaid
        isPartlyPaid
        comment
        adminComment
        region
        district
        city
        street
        house
        flat
        warehouse
        delivery {
            id
            name
            imageId
        }
        books {
            groupDiscountId
            book {
                id
                name
                imageIds
                numberInStock
                languages {
                    name
                }
                bookSeries {
                    name
                    publishingHouse {
                        name
                    }
                    description
                }
                bookTypes {
                    name
                }
            }
            count
            discount
            price
        }
        date
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

export const sendEmailWithOrderQuery = gql`
    query SendEmailWithOrder($orderId: ID!) {
        sendEmailWithOrder(orderId: $orderId)
    }
`;

export const updateOrderQuery = gql`
    mutation UpdateOrder($input: OrderUpdateInput!) {
        item: updateOrder(input: $input) {
            id
        }
    }
`;

export const cancelOrderQuery = gql`
    mutation CancelOrder($input: ID!) {
        item: cancelOrder(id: $input) {
            id
        }
    }
`;
