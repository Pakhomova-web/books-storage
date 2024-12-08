import { useMutation, useQuery } from '@apollo/client';
import { UserEntity } from '@/lib/data/types';
import { _useUpdateItem } from '@/lib/graphql/base-hooks';
import {
    changePasswordQuery, checkResetPasswordTokenQuery,
    loginQuery,
    sendUpdatePasswordLinkQuery,
    signInQuery,
    userQuery,
    userUpdateQuery
} from '@/lib/graphql/queries/auth/queries';

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
        loginUser: async (email: string, password: string): Promise<{
            token: string,
            user: UserEntity,
            refreshToken: string
        }> => {
            const { data: { login } } = await mutate({ variables: { email, password } });

            return login;
        },
        loading,
        error
    };
}

export function useSendResetPasswordLink() {
    const [mutate, { loading, error }] = useMutation(sendUpdatePasswordLinkQuery);

    return {
        sendResetPasswordLink: async (email: string): Promise<any> => mutate({ variables: { email } }),
        sendingResetPasswordLink: loading,
        errorSendingResetPasswordLink: error
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

export function useChangePassword() {
    const [mutate, { loading, error }] = useMutation(changePasswordQuery);

    return {
        changePassword: async (userId: string, password: string): Promise<any> => {
            const { data } = await mutate({ variables: { userId, password } });

            return data;
        },
        loading,
        error
    };
}

export function useCheckResetPasswordToken(userId: string, token: string) {
    const { loading, error } = useQuery(checkResetPasswordTokenQuery, { variables: { userId, token } });

    return { loading, error };
}

export function useCurrentUser() {
    return _useUpdateItem<UserEntity>(userUpdateQuery);
}
