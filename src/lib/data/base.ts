import { Model } from 'mongoose';
import {
    AuthorEntity, BookEntity,
    BookSeriesEntity,
    BookTypeEntity, CoverTypeEntity,
    LanguageEntity, PageTypeEntity,
    PublishingHouseEntity
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
    BookEntity
>;

export function getByName(model: CustomModelType, name: string) {
    return model.findOne({ name: new RegExp(`^${name}$`, "i") });
}

export async function checkUsageInBook(propKey: keyof BookEntity, ids: string[], modelName: string) {
    const items = await Book.find({ [propKey]: ids });

    if (items?.length) {
        throw new GraphQLError(`This ${modelName} is used in Books.`, {
            extensions: { code: 'USAGE_ERROR' }
        });
    }
}
