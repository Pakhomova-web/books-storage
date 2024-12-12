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

export const deleteGroupDiscountQuery = gql`
    mutation DeleteGroupDiscount($id: ID!) {
        item: deleteGroupDiscount(id: $id) {
            id
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
