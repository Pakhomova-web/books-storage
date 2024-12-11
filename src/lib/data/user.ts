import { GraphQLError } from 'graphql/error';

import { UserEntity } from '@/lib/data/types';
import { getByEmail } from '@/lib/data/base';
import User from '@/lib/data/models/user';
import ResetToken from '@/lib/data/models/reset-token';
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
import { getBooksByIds } from '@/lib/data/books';

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
        throw new GraphQLError(`Користувач з ел. адресою '${input.email}' вже зареєстрований.`, {
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

export async function login(email: string, password: string): Promise<{
    user: UserEntity,
    token: string,
    refreshToken: string
}> {
    if (!email || !password) {
        throw new GraphQLError(`Password and Email are required for logging.`, {
            extensions: { code: 'BAD_DATA' }
        });
    }
    const item = await getByEmail<UserEntity>(User, email);

    if (!item) {
        throw new GraphQLError(`Користувача не знайдено.`, {
            extensions: { code: 'NOT_AUTHORIZED' }
        });
    } else {
        const identical = await comparePassword(password, item.password);

        if (identical) {
            const token = createToken(item.id);
            const refreshToken = createRefreshToken(item.id);

            await setRecentlyViewedBooks(item);

            delete item.password;
            return { user: item, token, refreshToken };
        } else {
            throw new GraphQLError(`Ел. адреса чи пароль невірні.`, {
                extensions: { code: 'BAD_DATA' }
            });
        }
    }
}

export async function getNewToken(refreshToken: string) {
    try {
        verify(refreshToken, SECRET_JWT_KEY);
    } catch (_) {
        throw new GraphQLError(`Токен застарілий.`, {
            extensions: { code: 'UNAUTHORIZED' }
        });
    }
    const userId = getUserIdFromToken(refreshToken);
    const user = await getUserById(userId);

    await setRecentlyViewedBooks(user);

    delete user.password;
    return { user, token: createToken(userId), refreshToken: createRefreshToken(userId) };
}

export async function updateUser(input: UserEntity): Promise<UserEntity> {
    if (!input.id) {
        throw new GraphQLError(`Не вказан ідентифікатор.`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    const itemByEmail = await getByEmail<UserEntity>(User, input.email);

    if (itemByEmail && itemByEmail.id.toString() !== input.id) {
        throw new GraphQLError(`Ел. адреса '${input.email}' вже використовується.`, {
            extensions: { code: 'DUPLICATE_ERROR' }
        });
    }
    const item = await User.findByIdAndUpdate(input.id, input);

    await setRecentlyViewedBooks(item);

    return item as UserEntity;
}

export async function changePasswordByToken(userId: string, password: string): Promise<any> {
    if (!userId) {
        throw new GraphQLError(`Не вказан ідентифікатор.`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    const user = await User.findById(userId);

    if (!user) {
        throw new GraphQLError(`Такий користувач не зареєстрований.`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }

    user.password = await cryptPassword(password);

    await user.save();
    await ResetToken.findOneAndRemove({ userId });
    return 'OK';
}

export async function changePassword(userId: string, password: string, newPassword: string): Promise<any> {
    if (!userId) {
        throw new GraphQLError(`Не вказан ідентифікатор.`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    const user = await User.findById(userId);

    if (!user) {
        throw new GraphQLError(`Такий користувач не зареєстрований.`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    const identical = await comparePassword(password, user.password);

    if (identical) {
        user.password = await cryptPassword(newPassword);
        await user.save();

        return 'OK';
    } else {
        throw new GraphQLError(`Пароль невірний`, {
            extensions: { code: 'BAD_DATA' }
        });
    }
}

export async function getUserById(id: string): Promise<UserEntity> {
    const user = await User.findById(id);

    await setRecentlyViewedBooks(user);
    return user;
}

export async function likeBook(userId: string, bookId: string) {
    const user = await User.findById(userId);

    if (user.likedBookIds) {
        user.likedBookIds.push(bookId);
    } else {
        user.likedBookIds = [bookId];
    }
    await user.save();

    return user.likedBookIds;
}

export async function unlikeBook(userId: string, bookId: string) {
    const user = await User.findById(userId);

    if (user.likedBookIds) {
        user.likedBookIds = user.likedBookIds.filter(id => id !== bookId);
    } else {
        user.likedBookIds = [];
    }
    await user.save();

    return user.likedBookIds;
}

export async function changeRecentlyViewedBooks(userId: string, bookId: string) {
    const user = await User.findById(userId);

    if (user.recentlyViewedBookIds) {
        user.recentlyViewedBookIds = user.recentlyViewedBookIds.filter((id, index) => id !== bookId && index < 6);
        user.recentlyViewedBookIds = [bookId, ...user.recentlyViewedBookIds];
    } else {
        user.recentlyViewedBookIds = [bookId];
    }
    await user.save();

    const { items } = await getBooksByIds(user.recentlyViewedBookIds, { page: 0, rowsPerPage: user.recentlyViewedBookIds.length });

    return items;
}

export async function addBookInBasket(userId: string, bookId: string) {
    const user = await User.findById(userId);

    if (user.basketItems) {
        user.basketItems.push({ bookId, count: 1 });
    } else {
        user.basketItems = [{ bookId, count: 1 }];
    }
    await user.save();

    return user.basketItems;
}

export async function removeBookFromBasket(userId: string, bookId: string) {
    const user = await User.findById(userId);

    if (user.basketItems) {
        user.basketItems = user.basketItems.filter(item => item.bookId !== bookId);
    } else {
        user.basketItems = [];
    }
    await user.save();

    return user.basketItems;
}

export async function updateBookCountInBasket(userId: string, bookId: string, count: number) {
    const user = await User.findById(userId);
    const item = user.basketItems?.find(i => i.bookId === bookId);

    if (!!item) {
        item.count = count;
        await user.save();
    } else {
        throw new GraphQLError(`Немає такої книги в кошику.`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }

    return user.basketItems;
}

async function setRecentlyViewedBooks(item) {
    if (item.recentlyViewedBookIds?.length) {
        const { items } = await getBooksByIds(item.recentlyViewedBookIds, {
            page: 0,
            rowsPerPage: item.recentlyViewedBookIds.length
        });

        item.recentlyViewedBooks = items;
    }
}
