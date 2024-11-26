import { gql } from '@apollo/client';

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
        likedBookIds
        recentlyViewedBookIds
        postcode
        city
        region
        novaPostOffice
        phoneNumber
        preferredDeliveryId
        instagramUsername
    }
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
