import { BookSeriesEntity, BookSeriesFilter, IPageable } from '@/lib/data/types';
import BookSeries from '@/lib/data/models/book-series';
import { GraphQLError } from 'graphql/error';
import {
    getByName,
    getCaseInsensitiveSubstringOption,
    getDataByFiltersAndPageSettings,
    getValidFilters
} from '@/lib/data/base';

export async function getBookSeries(pageSettings?: IPageable, filters?: BookSeriesFilter): Promise<{
    items: BookSeriesEntity[],
    totalCount: number
}> {
    const { andFilters } = getValidFilters(filters);
    return getDataByFiltersAndPageSettings(
        BookSeries
            .find({ default: { $ne: true } })
            .populate('publishingHouse'),
        andFilters,
        pageSettings
    );
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
        throw new GraphQLError(`Не вказан ідентифікатор.`, {
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
            throw new GraphQLError(`Серія з назвою '${input.name}' вже є для обраного видавництва.`, {
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
        throw new GraphQLError(`Не вказан ідентифікатор.`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    const itemsByName = await getUnique(input.id, input.name, input.publishingHouseId);

    if (itemsByName?.length && itemsByName.some(item => item.name.toLowerCase() === input.name.toLowerCase())) {
        throw new GraphQLError(`Серія з назвою '${input.name}' вже є у видавництві ${itemsByName[0].publishingHouse.name}.`, {
            extensions: { code: 'DUPLICATE_ERROR' }
        });
    }
    await BookSeries.findByIdAndUpdate(input.id, { ...input, publishingHouse: input.publishingHouseId });

    return input as BookSeriesEntity;
}

function getUnique(id: string, name: string, publishingHouseId: string) {
    return BookSeries.find({
        _id: { $ne: id },
        name: getCaseInsensitiveSubstringOption(name),
        publishingHouse: publishingHouseId
    }).populate('publishingHouse');
}

export async function deleteBookSeries(id: string) {
    await BookSeries.findByIdAndDelete(id);

    return { id } as BookSeriesEntity;
}
