import { GraphQLError } from 'graphql/error';
import { verify } from 'jsonwebtoken';

import User from '@/lib/data/models/user';
import ResetToken from '@/lib/data/models/reset-token';
import { createToken, SECRET_JWT_KEY } from '@/lib/data/auth-utils';
import { createMailOptions, createMailTransport, mailButton, mailContainer } from '@/lib/data/base';

export async function checkResetPasswordToken(userId: string, token: string): Promise<any> {
    const resetToken = await ResetToken.findOne({ userId, token }).catch(() => {
        throw new GraphQLError(`Токен не валідний. Спробуйте скинути пароль ще раз за новим посиланням`, {
            extensions: { code: 'NOT_FOUND' }
        });
    });

    if (!resetToken) {
        throw new GraphQLError(`Щось не так із посиланням. Спробуйте скинути пароль ще раз за новим посиланням`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    try {
        verify(resetToken.token, SECRET_JWT_KEY);
    } catch (_) {
        throw new GraphQLError(`Посилання застаріле.`, {
            extensions: { code: 'INVALID_TOKEN' }
        });
    }

    return 'OK';
}

export async function sendUpdatePasswordLink(email: string): Promise<any> {
    const user = await User.findOne({ email });

    if (!user) {
        throw new GraphQLError(`Така ел. адреса не зареєстрована.`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    let item = await ResetToken.findOne({ userId: user.id });

    if (item) {
        item.createdAt = new Date().toISOString();
        item.expiresAt = new Date().toISOString();
        item.token = createToken(user.id);

        await item.save();
    } else {
        item = await ResetToken.create({
            userId: user.id,
            createdAt: new Date().toISOString(),
            expiresAt: new Date().toISOString(),
            token: createToken(user.id)
        });
    }

    try {
        return createMailTransport().sendMail(
            createMailOptions(
                email,
                'Посилання на скидання паролю',
                mailTemplate(`${process.env.FRONTEND_URL}/reset-password?id=${user.id}&token=${item.token}`)
            ), (err, info) => {
                if (err) {
                    throw new GraphQLError(`Щось пішло не так.`, {
                        extensions: { code: 'INVALID_DATA' }
                    });
                } else {
                    return 'OK';
                }
            });
    } catch (e) {
        throw new GraphQLError(`Щось пішло не так.`, {
            extensions: { code: 'INVALID_DATA' }
        });
    }
}

const mailTemplate = (buttonUrl: string) => {
    return mailContainer(`
        <p>Ми отримали запит на зміну пароля. Будь ласка скиньте свій пароль, використовуючи посилання нижче, щоб встановити новий.</p>
        <p>Якщо Ви не робили цього, то проігноруйте цей лист.</p>
        ${mailButton(buttonUrl, 'Скинути пароль')}
    `);
};
