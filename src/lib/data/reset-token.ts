import { GraphQLError } from 'graphql/error';
import { createTransport } from 'nodemailer';
import { verify } from 'jsonwebtoken';

import User from '@/lib/data/models/user';
import ResetToken from '@/lib/data/models/reset-token';
import { createToken, SECRET_JWT_KEY } from '@/lib/data/auth-utils';

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
        const transporter = createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_ID,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOption = {
            from: process.env.EMAIL_ID,
            to: email,
            subject: 'Посилання на скидання паролю',
            html: mailTemplate(
                "Ми отримали запит на зміну пароля. Будь ласка скиньте свій пароль, використовуючи посилання нижче, щоб встановити новий.",
                `${process.env.FRONTEND_URL}/reset-password?id=${user.id}&token=${item.token}`,
                "Скинути пароль"
            )
        };

        return transporter.sendMail(mailOption, (err, info) => {
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

const mailTemplate = (content, buttonUrl, buttonText) => {
    return `
<!DOCTYPE html>
  <html>
  <body style="text-align: center; font-family: 'Verdana', serif; color: #000;">
    <div style="max-width: 400px;
        margin: 10px;
        background-color: #fafafa;
        padding: 25px;
        border-radius: 20px">
        
        <p style="text-align: left">${content}</p>
          <a href="${buttonUrl}" target="_blank">
            <buttonstyle="background-color: #444394; border: 0; width: 200px; height: 30px; border-radius: 6px; color: #fff">
              ${buttonText}
            </button>
          </a>
          <p style="text-align: left">
            Якщо ви не можете натиснути кнопку вище, скопіюйте наведену нижче URL-адресу в адресний рядок:
          </p>
          <a href="${buttonUrl}" target="_blank">
              <p style="margin: 0; text-align: left; font-size: 10px; text-decoration: none;">
                ${buttonUrl}
              </p>
          </a>
    </div>
  </body>
</html>
`;
};
