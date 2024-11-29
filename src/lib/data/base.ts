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

    if (filters) {
        Object.keys(filters).forEach(key => {
            if (key === 'quickSearch') {
                return;
            }
            if (filters[key] !== null && filters[key] !== undefined) {
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
                } else if (key === 'ages') {
                    andFilters.push({ [key]: { $all: filters[key] } });
                } else if (key === 'tags') {
                    if (!!filters[key]?.length) {
                        andFilters.push({ [key]: { $in: filters[key].map(i => getCaseInsensitiveSubstringOption(i)) } });
                    }
                } else if (key === 'bookTypes') {
                    andFilters.push({ bookTypes: { $in: filters[key] } });
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
    }
    const items = await query.find();

    return { items, totalCount };
}
