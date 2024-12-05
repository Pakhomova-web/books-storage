import { ApolloError, DocumentNode, useMutation, useQuery } from '@apollo/client';
import { IPageable } from '@/lib/data/types';
import { apolloClient } from '@/lib/apollo';

export function _useItems<T, K>(query: DocumentNode, pageSettings?: IPageable, filters?: K): {
    items: T[],
    totalCount?: number,
    loading: boolean,
    gettingError: ApolloError,
    refetch: Function
} {
    const { data, error, loading, refetch } = useQuery(query, {
        fetchPolicy: 'no-cache',
        variables: { pageSettings, filters }
    });

    return { items: data?.items || [], totalCount: data?.totalCount, gettingError: error, loading, refetch };
}

export function _usePageableItems<T>(query: DocumentNode, key: string, pageSettings?: IPageable, filters?): {
    items: T[],
    totalCount: number,
    loading: boolean,
    gettingError: ApolloError,
    refetch: Function
} {
    const { data, error, loading, refetch } = useQuery(query, {
        fetchPolicy: 'no-cache',
        variables: { pageSettings, filters }
    });

    return {
        items: data && data[key] ? data[key].items : [],
        totalCount: data && data[key] ? data[key].totalCount : 0,
        gettingError: error,
        loading,
        refetch: (pageSettings?: IPageable, filters?) => refetch({ pageSettings, filters })
    };
}

export async function _useAllItems<T>(query: DocumentNode, key: string, pageSettings: IPageable, filters?) {
    const { data } = await apolloClient.query({
        query,
        fetchPolicy: 'no-cache',
        variables: { pageSettings, filters }
    });

    return data[key].items;
}

export function _useItemById<T>(query: DocumentNode, key: string, id: string) {
    const { data, loading, error, refetch } = useQuery(query, {
        fetchPolicy: 'no-cache',
        variables: { id }
    });

    return { loading, error, item: data ? data[key] as T : null, refetch };
}

export async function getItemById<T>(query: DocumentNode, id: string): Promise<T> {
    const { data } = await apolloClient.query({
        query,
        fetchPolicy: 'no-cache',
        variables: { id }
    });

    return data.item;
}

export function _useDeleteItemById(query: DocumentNode): {
    deleting: boolean,
    deletingError: ApolloError,
    deleteItem: Function
} {
    const [mutate, { loading, error }] = useMutation(query);

    return {
        deleteItem: async (id: string) => {
            const { data: { item } } = await mutate({
                fetchPolicy: 'no-cache',
                variables: { id }
            });

            return item;
        },
        deleting: loading,
        deletingError: error
    };
}

export function _useUpdateItem<K>(query: DocumentNode): {
    updating: boolean,
    updatingError: ApolloError,
    update: Function
} {
    const [mutate, { loading, error }] = useMutation(query);

    return {
        update: async (input: K) => {
            const { data: { item } } = await mutate({
                fetchPolicy: 'no-cache',
                variables: { input }
            });

            return item;
        },
        updating: loading,
        updatingError: error
    };
}

export function _useCreateItem<K>(query: DocumentNode): {
    creating: boolean,
    creatingError: ApolloError,
    create: Function
} {
    const [mutate, { loading, error }] = useMutation(query);

    return {
        create: async (input: K) => {
            const { data: { item } } = await mutate({
                fetchPolicy: 'no-cache',
                variables: { input }
            });

            return item;
        },
        creating: loading,
        creatingError: error
    };
}
