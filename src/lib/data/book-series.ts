import { BookSeriesEntity, BookSeriesFilter, IPageable } from '@/lib/data/types';
import BookSeries from '@/lib/data/models/book-series';
import { GraphQLError } from 'graphql/error';
import { getByName, getValidFilters, setFiltersAndPageSettingsToQuery } from '@/lib/data/base';

export async function getBookSeries(pageSettings?: IPageable, filters?: BookSeriesFilter): Promise<{
    items: BookSeriesEntity[],
    totalCount: number
}> {
    const { andFilters } = getValidFilters(filters);
    const query = setFiltersAndPageSettingsToQuery(
        BookSeries
            .find()
            .populate('publishingHouse'),
        andFilters,
        pageSettings
    );

    const items = await query;
    const totalCount = await query.countDocuments();

    return { items, totalCount };
}

export async function getBookSeriesOptions(filters?: BookSeriesFilter, fully = false): Promise<BookSeriesEntity[]> {
    const { andFilters } = getValidFilters(filters);
    const query = BookSeries.find();

    if (!!andFilters.length) {
        query.and(andFilters);
    }
    if (fully) {
        query.populate('publishingHouse')
    }
    return query.sort({ name: 'asc' });
}


export async function getBookSeriesById(id: string) {
    if (!id) {
        throw new GraphQLError(`No Book Series found with id ${id}`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }

    return BookSeries.findById(id).populate('publishingHouse');
}

export async function createBookSeries(input: BookSeriesEntity) {
    const item = await getByName<BookSeriesEntity>(BookSeries, input.name);

    if (item && item.publishingHouse.id === input.publishingHouseId) {
        return null;
    } else {
        const itemsByPublishingHouseId = await BookSeries.find({
            publishingHouse: input.publishingHouseId,
            name: new RegExp(`^${input.name}$`, "i")
        });

        if (itemsByPublishingHouseId.length) {
            throw new GraphQLError(`Book Series with name '${input.name}' already exists for selected Publishing House.`, {
                extensions: { code: 'DUPLICATE_ERROR' }
            });
        }
        const item = new BookSeries({ ...input, publishingHouse: input.publishingHouseId });

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
    const itemByName = await getByName<BookSeriesEntity>(BookSeries, input.name);

    if (itemByName && itemByName.name.toLowerCase() === input.name.toLowerCase() && itemByName.id.toString() !== input.id) {
        throw new GraphQLError(`Book Series with name '${input.name}' already exists.`, {
            extensions: { code: 'DUPLICATE_ERROR' }
        });
    }
    await BookSeries.findByIdAndUpdate(input.id, { ...input, publishingHouse: input.publishingHouseId });

    return input as BookSeriesEntity;
}

export async function deleteBookSeries(id: string) {
    await BookSeries.findByIdAndDelete(id);

    return { id } as BookSeriesEntity;
}
