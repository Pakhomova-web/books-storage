import { useMutation, useQuery } from '@apollo/client';
import { UserEntity } from '@/lib/data/types';
import { _useUpdateItem } from '@/lib/graphql/base-hooks';
import {
    activateUserQuery,
    changePasswordByTokenQuery,
    changePasswordQuery,
    checkResetPasswordTokenQuery,
    loginQuery,
    sendActivationLinkToQuery,
    sendUpdatePasswordLinkQuery,
    signInQuery,
    userQuery,
    userUpdateQuery
} from '@/lib/graphql/queries/auth/queries';
import { apolloClient } from '@/lib/apollo';

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

export function loginUser(email: string, password: string) {
    return apolloClient.query({ query: loginQuery, variables: { email, password }, fetchPolicy: 'network-only' });
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

export function useChangePasswordByToken() {
    const [mutate, { loading, error }] = useMutation(changePasswordByTokenQuery);

    return {
        changePassword: async (userId: string, password: string): Promise<any> => {
            const { data } = await mutate({ variables: { userId, password } });

            return data;
        },
        loading,
        error
    };
}

export function useChangePassword() {
    const [mutate, { loading, error }] = useMutation(changePasswordQuery);

    return {
        changePassword: async (password: string, newPassword: string): Promise<any> => {
            const { data } = await mutate({ variables: { newPassword, password } });

            return data;
        },
        changingPassword: loading,
        changingPasswordError: error
    };
}

export function useCheckResetPasswordToken(userId: string, token: string) {
    const { loading, error } = useQuery(checkResetPasswordTokenQuery, { variables: { userId, token } });

    return { loading, error };
}

export function useCurrentUser() {
    return _useUpdateItem<UserEntity>(userUpdateQuery);
}

export function useActivateUser(token: string) {
    return useQuery(activateUserQuery, { fetchPolicy: 'network-only', variables: { token } });
}

export function sendActivationLinkToUser() {
    return apolloClient.query({ query: sendActivationLinkToQuery, fetchPolicy: 'network-only' });
}
