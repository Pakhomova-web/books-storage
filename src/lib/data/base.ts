import { Model } from 'mongoose';
import {
    AuthorEntity, BookEntity,
    BookSeriesEntity,
    BookTypeEntity, CoverTypeEntity, IPageable,
    LanguageEntity, PageTypeEntity,
    PublishingHouseEntity, UserEntity
} from '@/lib/data/types';
import Book from '@/lib/data/models/book';
import { GraphQLError } from 'graphql/error';
import { createTransport } from 'nodemailer';
import { borderRadius, primaryLightColor } from '@/constants/styles-variables';

type CustomModelType = Model<
    PublishingHouseEntity |
    BookSeriesEntity |
    LanguageEntity |
    AuthorEntity |
    BookTypeEntity |
    PageTypeEntity |
    CoverTypeEntity |
    BookEntity |
    UserEntity
>;

export async function getByName<T>(model: CustomModelType, name: string): Promise<T> {
    return model.findOne({ name: getCaseInsensitiveSubstringOption(name) }) as T;
}

export async function getByEmail<T>(model: CustomModelType, value: string): Promise<T> {
    return model.findOne({ email: getCaseInsensitiveSubstringOption(value) }) as T;
}

export async function checkUsageInBook(propKey: keyof BookEntity, ids: string[], modelName: string) {
    const items = await Book.find({ [propKey]: ids });

    if (items?.length) {
        throw new GraphQLError(`This ${modelName} is used in Books.`, {
            extensions: { code: 'USAGE_ERROR' }
        });
    }
}

export function getValidFilters<T>(filters?: T): { quickSearch: RegExp, andFilters: any[] } {
    const andFilters = [];
    const orFilters = [];

    if (filters) {
        Object.keys(filters).forEach(key => {
            if (key === 'quickSearch') {
                return;
            }
            if (filters[key] !== null && filters[key] !== undefined && (typeof filters[key] === 'boolean' || filters[key].length > 0)) {
                if (key === 'name') {
                    andFilters.push({ [key]: getCaseInsensitiveSubstringOption(filters[key]) });
                } else if (key === 'isInStock') {
                    andFilters.push({ numberInStock: { $gt: 0 } });
                } else if (key === 'withDiscount') {
                    if (!!filters[key]) {
                        andFilters.push({ discount: { $gt: 0 } });
                    }
                } else if (key === 'archived') {
                    andFilters.push({ archived: !!filters[key] ? true : { $in: [null, false] } });
                } else if (key === 'authors') {
                    orFilters.push({ authors: { $in: filters[key] } });
                    orFilters.push({ illustrators: { $in: filters[key] } });
                } else if (key === 'tags') {
                    andFilters.push({ [key]: { $in: filters[key].map(i => getCaseInsensitiveSubstringOption(i)) } });
                } else if (['bookTypes', 'bookSeries', 'languages', 'ages', 'books'].includes(key)) {
                    andFilters.push({ [key]: { $in: filters[key] } });
                } else if (key === 'priceMin') {
                    andFilters.push({ price: { $gt: filters[key] } });
                } else if (key === 'priceMax') {
                    andFilters.push({ price: { $lte: filters[key] } });
                } else {
                    andFilters.push({ [key]: filters[key] });
                }
            }
        });
    }

    return {
        quickSearch: filters && filters['quickSearch'] ? getCaseInsensitiveSubstringOption(filters['quickSearch']) : null,
        andFilters
    };
}

export function getCaseInsensitiveSubstringOption(value: string): RegExp {
    return new RegExp(`${value.trim()}`, 'i');
}

export async function getDataByFiltersAndPageSettings(query, andFilters, pageSettings: IPageable) {
    if (andFilters?.length) {
        query.and(andFilters);
    }
    const totalCount = await query.countDocuments();

    if (pageSettings) {
        if (pageSettings.rowsPerPage && pageSettings.page !== undefined) {
            query
                .skip(pageSettings.rowsPerPage * pageSettings.page)
                .limit(pageSettings.rowsPerPage);
        }

        query.sort({ [pageSettings.orderBy || 'name']: pageSettings.order || 'asc' })
    } else {
        query.sort({ name: 'asc' })
    }
    const items = await query.find();

    return { items, totalCount };
}

export function createMailOptions(emailTo: string, subject: string, html: string, attachments = []) {
    return {
        from: process.env.EMAIL_ID,
        to: emailTo,
        subject,
        html,
        attachments: [
            {
                filename: 'logo.png',
                path: process.env.NODE_ENV === 'development' ?`${process.cwd()}/public/logo.png` : `${process.env.FRONTEND_URL}/logo.png`,
                cid: 'logo'
            },
            ...attachments
        ]
    };
}

export function createMailTransport() {
    return createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_ID,
            pass: process.env.EMAIL_PASSWORD
        }
    });
}

export function mailContainer(content: string): string {
    return `
<!DOCTYPE html>
  <html>
  <body style="text-align: center; font-family: 'Tomes New Roman', serif; color: #000;">
    <div style="max-width: 95%;
        margin: 10px auto;
        background-color: #fafafa;
        padding: 10px;
        border-radius: ${borderRadius}">
        <a href="${process.env.FRONTEND_URL}" target="_blank">
            <img src="cid:logo" alt="logo" style="width: 200px; margin-bottom: 10px"/>
        </a>
        
        ${content}
    </div>
  </body>
</html>
`;
}

export function mailButton(url: string, title): string {
    return `
        <a href="${url}" target="_blank">
            <button style="background-color: #448AFF; border: 0; width: 200px; height: 30px; border-radius: 6px; color: #fff">
              ${title}
            </button>
        </a>
        
        <p>Якщо ви не можете натиснути кнопку вище, скопіюйте наведену нижче URL-адресу в адресний рядок:</p>
        <a href="${url}" target="_blank" style="text-decoration: none">
            <p style="margin: 0; font-size: 10px">
                ${url}
            </p>
        </a>
    `;
}

export function mailDivider(double = false): string {
    return `<div style="margin-bottom: 5px; width: 100%; border-top: ${double ? 2 : 1}px solid ${primaryLightColor}"></div>`;
}

export function rowDivider(colspan = 1) {
    return `
        <tr>
            <td colspan="${colspan}">
                ${mailDivider()}
            </td>
        </tr>
    `;
}
