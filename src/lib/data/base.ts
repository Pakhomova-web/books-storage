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
    return model.findOne({ name: new RegExp(`^${name}$`, "i") }) as T;
}

export async function getByEmail<T>(model: CustomModelType, value: string): Promise<T> {
    return model.findOne({ email: new RegExp(`^${value}$`, "i") }) as T;
}

export async function checkUsageInBook(propKey: keyof BookEntity, ids: string[], modelName: string) {
    const items = await Book.find({ [propKey]: ids });

    if (items?.length) {
        throw new GraphQLError(`This ${modelName} is used in Books.`, {
            extensions: { code: 'USAGE_ERROR' }
        });
    }
}

export function getValidFilters<T>(filters?: T) {
    const validFilters = {};

    if (filters) {
        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                if (key === 'name') {
                    validFilters[key] = { $regex: filters[key], $options: 'i' };
                } if (key === 'isInStock' && filters[key]) {
                    validFilters['numberInStock'] = { $gt: 0 };
                } else {
                    validFilters[key] = filters[key];
                }
            }
        });
    }

    return validFilters;
}
