import { gql } from '@apollo/client';

const groupDiscountFragment = gql`
    fragment GroupDiscount on GroupDiscount {
        id
        discount
        books {
            id
            name
            imageIds
            price
            numberInStock
            bookSeries {
                name
                publishingHouse {
                    name
                }
            }
            languages {
                name
            }
        }
    }
`;

export const groupDiscountsQuery = gql`
    query GroupDiscounts($pageSettings: PageableInput, $filters: GroupDiscountSearchInput) {
        groupDiscounts(pageSettings: $pageSettings, filters: $filters) {
            items {
                ...GroupDiscount
            }
            totalCount
        }
    }
    ${groupDiscountFragment}
`;



export const groupDiscountsByIdsQuery = gql`
    query GroupDiscountsByIds($ids: [ID!], $pageSettings: PageableInput) {
        groupDiscountsByIds(ids: $ids, pageSettings: $pageSettings) {
            items {
                ...GroupDiscount
            }
            totalCount
        }
    }
    ${groupDiscountFragment}
`;

export const deleteGroupDiscountQuery = gql`
    mutation DeleteGroupDiscount($id: ID!) {
        item: deleteGroupDiscount(id: $id) {
            id
        }
    }
`;

export const updateGroupDiscountCountInBasket = gql`
    mutation UpdateGroupDiscountCountIn($id: ID!, $count: Int!) {
        items: updateGroupDiscountCountInBasket(id: $id, count: $count) {
            groupDiscountId
            count
        }
    }
`;

export const createGroupDiscountQuery = gql`
    mutation CreateGroupDiscount($input: GroupDiscountCreateInput!) {
        item: createGroupDiscount(input: $input) {
            id
        }
    }
`;

export const updateGroupDiscountQuery = gql`
    mutation GroupDiscountAuthor($input: GroupDiscountUpdateInput!) {
        item: updateGroupDiscount(input: $input) {
            id
        }
    }
`;
