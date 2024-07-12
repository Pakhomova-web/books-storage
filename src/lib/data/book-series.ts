import { BookSeriesEntity } from '@/lib/data/types';
import BookSeries from '@/lib/data/models/book-series';
import { GraphQLError } from 'graphql/error';
import { getByName } from '@/lib/data/base';

export async function getBookSeries(orderBy?: string, order?: string, filters?: { name?, publishingHouseId? }) {
    const validFilters = {};

    if (filters) {
        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                validFilters[key] = filters[key];
            }
        });
    }
    return BookSeries.find(validFilters, null, { sort: { [orderBy]: order } });
    // TODO: for sorting we need to get publishing house name
    // return connection()
    //     .select('bookSeries.id as id', 'bookSeries.name as name', 'publishingHouseId', 'publishingHouse.name as publishingHouseName')
    //     .from('bookSeries')
    //     .join('publishingHouse as publishingHouse', 'bookSeries.publishingHouseId', '=', 'publishingHouse.id')
    //     .where(validFilters)
    //     .orderBy(orderBy, order);
}

export async function getBookSeriesById(id: string) {
    return BookSeries.findById(id);
}

export async function createBookSeries(input: BookSeriesEntity) {
    const item = await getByName(BookSeries, input.name);

    if (item) {
        return null;
    } else {
        const itemsByPublishingHouseId = await BookSeries.find({
            publishingHouseId: input.publishingHouseId,
            name: new RegExp(`^${input.name}$`, "i")
        });

        if (itemsByPublishingHouseId.length) {
            throw new GraphQLError(`Book Series with name '${input.name}' already exists for selected Publishing House.`, {
                extensions: { code: 'DUPLICATE_ERROR' }
            });
        }
        const item = new BookSeries(input);

        await item.save();

        return { ...input, id: item.id } as BookSeriesEntity;
    }
}

export async function updateBookSeries(input: BookSeriesEntity) {
    if (!input.id) {
        throw new GraphQLError(`No Book Series found with id ${input.id}`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    const itemByName = await getByName(BookSeries, input.name);

    if (itemByName && itemByName.id.toString() !== input.id) {
        throw new GraphQLError(`Book Series with name '${name}' already exists.`, {
            extensions: { code: 'DUPLICATE_ERROR' }
        });
    }
    await BookSeries.findOneAndUpdate({ _id: input.id }, input);

    return input as BookSeriesEntity;
}

export async function deleteBookSeries(id: string) {
    await BookSeries.findByIdAndDelete(id);

    return { id } as BookSeriesEntity;
}
