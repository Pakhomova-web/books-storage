import { gql } from '@apollo/client';
import { bookListFragment } from '@/lib/graphql/queries/book/queries';

const userFragment = gql`
    fragment User on User {
        id
        firstName
        lastName
        email
        role
        basketItems {
            bookId
            count
        }
        basketGroupDiscounts {
            groupDiscountId
            count
        }
        likedBookIds
        recentlyViewedBookIds
        recentlyViewedBooks {
            ...BookList
        }
        postcode
        city
        region
        novaPostOffice
        phoneNumber
        preferredDeliveryId
        instagramUsername
    }
    ${bookListFragment}
`;

export const signInQuery = gql`
    mutation CreateUser($input: UserCreateInput!) {
        item: createUser(input: $input) {
            ...User
        }
    }
    ${userFragment}
`;

export const loginQuery = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            refreshToken
            user {
                ...User
            }
        }
    }
    ${userFragment}
`;

export const sendUpdatePasswordLinkQuery = gql`
    mutation SendUpdatePasswordLink($email: String!) {
        sendUpdatePasswordLink(email: $email)
    }
`;

export const userQuery = gql`
    mutation User {
        user {
            ...User
        }
    }
    ${userFragment}
`;

export const userUpdateQuery = gql`
    mutation UpdateUser($input: UserUpdateInput!) {
        item: updateUser(input: $input) {
            ...User
        }
    }
    ${userFragment}
`;

export const changePasswordByTokenQuery = gql`
    mutation ChangePasswordByToken($userId: String!, $password: String!) {
        changePasswordByToken(userId: $userId, password: $password)
    }
`;

export const changePasswordQuery = gql`
    mutation ChangePassword($password: String!, $newPassword: String!) {
        changePassword(password: $password, newPassword: $newPassword)
    }
`;

export const checkResetPasswordTokenQuery = gql`
    query CheckResetPasswordToken($userId: String!, $token: String!) {
        checkResetPasswordToken(userId: $userId, token: $token)
    }
`;

export const refreshTokenQuery = gql`
    query RefreshToken($refreshToken: String!) {
        login: refreshToken(refreshToken: $refreshToken) {
            token
            refreshToken
            user {
                ...User
            }
        }
    }
    ${userFragment}
`;
