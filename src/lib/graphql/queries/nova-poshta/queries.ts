import { gql } from '@apollo/client';

export const settlementsQuery = gql`
    query Settlements($searchValue: String!) {
        settlements(searchValue: $searchValue) {
            city
            region
            district
            title
            ref
        }
    }
`;

export const warehousesQuery = gql`
    query Warehouses($settlementRef: String!, $searchValue: String!) {
        warehouses(settlementRef: $settlementRef, searchValue: $searchValue) {
            number
            description
        }
    }
`;

export const streetsQuery = gql`
    query Streets($ref: String!, $searchValue: String!) {
        streets(ref: $ref, searchValue: $searchValue) {
            description
        }
    }
`;
