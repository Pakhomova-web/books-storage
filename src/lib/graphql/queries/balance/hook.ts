import { _useUpdateItem } from '@/lib/graphql/base-hooks';
import { balanceQuery, updateBalanceQuery } from '@/lib/graphql/queries/balance/queries';
import { apolloClient } from '@/lib/apollo';

export function useUpdateBalance() {
    return _useUpdateItem<number>(updateBalanceQuery);
}

export async function getBalance() {
    const { data } = await apolloClient.query({
        query: balanceQuery,
        fetchPolicy: 'no-cache'
    });

    return data.balance;
}
