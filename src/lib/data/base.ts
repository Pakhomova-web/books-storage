import { Model } from 'mongoose';
import {
    AuthorEntity, BookEntity,
    BookSeriesEntity,
    BookTypeEntity, CoverTypeEntity,
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
            if (filters[key] !== null) {
                if (key === 'name') {
                    andFilters.push({ [key]: getCaseInsensitiveSubstringOption(filters[key]) });
                } else if (key === 'isInStock') {
                    andFilters.push({ numberInStock: { $gt: 0 } });
                } else if (key === 'withDiscount') {
                    andFilters.push({ discount: { $gt: 0 } });
                } else if (key === 'archived') {
                    andFilters.push({ archived: { $in: [null, false] } });
                } else if (key === 'ages') {
                    andFilters.push({ [key]: { $all: filters[key] } });
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
    return new RegExp(`${value}`, 'i');
}

export function setFiltersAndPageSettingsToQuery(query, andFilters, pageSettings) {
    if (andFilters?.length) {
        query.and(andFilters);
    }
    if (pageSettings) {
        if (pageSettings.rowsPerPage && pageSettings.page !== undefined) {
            query
                .skip(pageSettings.rowsPerPage * pageSettings.page)
                .limit(pageSettings.rowsPerPage);
        }

        query.sort({ [pageSettings.orderBy || 'name']: pageSettings.order || 'asc' })
    }

    return query;
}
