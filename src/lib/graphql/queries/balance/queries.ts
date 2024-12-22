import { gql } from '@apollo/client';

export const updateBalanceQuery = gql`
    mutation UpdateBalance($input: Float!) {
        item: updateBalance(expense: $input)
    }
`;

export const balanceQuery = gql`
    query Balance {
        balance
    }
`;
