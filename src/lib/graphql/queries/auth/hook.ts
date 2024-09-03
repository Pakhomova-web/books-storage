import { useMutation } from '@apollo/client';
import { UserEntity } from '@/lib/data/types';
import { _useUpdateItem } from '@/lib/graphql/base-hooks';
import { loginQuery, signInQuery, userQuery, userUpdateQuery } from '@/lib/graphql/queries/auth/queries';

export function useSignIn() {
    const [mutate, { loading, error }] = useMutation(signInQuery);

    return {
        signIn: async (input: UserEntity) => {
            const { data: { item } } = await mutate({ variables: { input } });

            return item;
        },
        loading,
        error
    };
}

export function useLogin() {
    const [mutate, { loading, error }] = useMutation(loginQuery);

    return {
        loginUser: async (email: string, password: string): Promise<{ token: string, user: UserEntity, refreshToken: string }> => {
            const { data: { login } } = await mutate({ variables: { email, password } });

            return login;
        },
        loading,
        error
    };
}

export function useUser() {
    const [mutate, { loading, error }] = useMutation(userQuery);

    return {
        fetchUser: async (): Promise<UserEntity> => {
            const { data: { user } } = await mutate();

            return user;
        },
        loading,
        error
    };
}

export function useCurrentUser() {
    return _useUpdateItem<UserEntity>(userUpdateQuery);
}
