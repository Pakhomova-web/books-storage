import { apolloClient } from '@/lib/apollo';
import { settlementsQuery, streetsQuery, warehousesQuery } from '@/lib/graphql/queries/nova-poshta/queries';

export async function getSettlements(searchValue: string) {
    const { data } = await apolloClient.query({
        query: settlementsQuery,
        variables: { searchValue },
        fetchPolicy: 'no-cache'
    });

    return data['settlements'];
}

export async function getWarehouses(settlementRef: string, searchValue: string) {
    const { data } = await apolloClient.query({
        query: warehousesQuery,
        variables: { settlementRef, searchValue },
        fetchPolicy: 'no-cache'
    });

    return data['warehouses'];
}

export async function getStreets(ref: string, searchValue: string) {
    const { data } = await apolloClient.query({
        query: streetsQuery,
        variables: { ref, searchValue },
        fetchPolicy: 'no-cache'
    });

    return data['streets'];
}
