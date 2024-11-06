import { GraphQLError } from 'graphql/error';

import { UserEntity } from '@/lib/data/types';
import { getByEmail } from '@/lib/data/base';
import User from '@/lib/data/models/user';
import { ROLES } from '@/constants/roles';
import {
    comparePassword,
    createRefreshToken,
    createToken,
    cryptPassword,
    getUserIdFromToken,
    SECRET_JWT_KEY
} from '@/lib/data/auth-utils';
import { verify } from 'jsonwebtoken';

const ADMIN_EMAILS: string[] = [
    'pakhomov.business@gmail.com'
];

export async function createUser(input: UserEntity) {
    if (!input.email || !input.password) {
        throw new GraphQLError(`Password and Email are required for creating account.`, {
            extensions: { code: 'BAD_DATA' }
        });
    }
    const item = await getByEmail(User, input.email);

    if (item) {
        throw new GraphQLError(`User with email ${input.email} already exists.`, {
            extensions: { code: 'DUPLICATE_ERROR' }
        });
    } else {
        const hashPassword = await cryptPassword(input.password);
        const item = new User({
            ...input,
            password: hashPassword,
            role: ADMIN_EMAILS.includes(input.email) ? ROLES.admin : ROLES.user
        });

        await item.save();

        return { ...input, id: item.id } as UserEntity;
    }
}

export async function login(email: string, password: string): Promise<{ user: UserEntity, token: string, refreshToken: string }> {
    if (!email || !password) {
        throw new GraphQLError(`Password and Email are required for logging.`, {
            extensions: { code: 'BAD_DATA' }
        });
    }
    const item = await getByEmail<UserEntity>(User, email);

    if (!item) {
        throw new GraphQLError(`User with email ${email} doesn't exist.`, {
            extensions: { code: 'NOT_AUTHORIZED' }
        });
    } else {
        const identical = await comparePassword(password, item.password);

        if (identical) {
            const token = createToken(item.id);
            const refreshToken = createRefreshToken(item.id);

            delete item.password;
            return { user: item, token, refreshToken };
        } else {
            throw new GraphQLError(`Password or Email is wrong.`, {
                extensions: { code: 'BAD_DATA' }
            });
        }
    }
}

export async function getNewToken(refreshToken: string) {
    try {
        verify(refreshToken, SECRET_JWT_KEY);
    } catch (_) {
        throw new GraphQLError(`Token is invalid.`, {
            extensions: { code: 'UNAUTHORIZED' }
        });
    }
    const userId = getUserIdFromToken(refreshToken);
    const user = await getUserById(userId);

    delete user.password;
    return { user, token: createToken(userId), refreshToken: createRefreshToken(userId) };
}

export async function updateUser(input: UserEntity): Promise<UserEntity> {
    if (!input.id) {
        throw new GraphQLError(`No User found with id ${input.id}`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    const itemByEmail = await getByEmail<UserEntity>(User, input.email);

    if (itemByEmail && itemByEmail.id.toString() !== input.id) {
        throw new GraphQLError(`Email '${input.email}' is used.`, {
            extensions: { code: 'DUPLICATE_ERROR' }
        });
    }
    await User.findByIdAndUpdate(input.id, input);

    return input as UserEntity;
}

export async function getUserById(id: string): Promise<UserEntity> {
    return User.findById(id);
}

export async function likeBook(userId: string, bookId: string) {
    const user =  await User.findById(userId);

    if (user.likedBookIds) {
        user.likedBookIds.push(bookId);
    } else {
        user.likedBookIds = [bookId];
    }
    await user.save();

    return user.likedBookIds;
}

export async function unlikeBook(userId: string, bookId: string) {
    const user =  await User.findById(userId);

    if (user.likedBookIds) {
        user.likedBookIds = user.likedBookIds.filter(id => id !== bookId);
    } else {
        user.likedBookIds = [];
    }
    await user.save();

    return user.likedBookIds;
}

export async function addBookInBasket(userId: string, bookId: string) {
    const user =  await User.findById(userId);

    if (user.basketItems) {
        user.basketItems.push({ bookId, count: 1 });
    } else {
        user.basketItems = [{ bookId, count: 1 }];
    }
    await user.save();

    return user.basketItems;
}

export async function removeBookFromBasket(userId: string, bookId: string) {
    const user =  await User.findById(userId);

    if (user.basketItems) {
        user.basketItems = user.basketItems.filter(item => item.bookId !== bookId);
    } else {
        user.basketItems = [];
    }
    await user.save();

    return user.basketItems;
}
