import { GraphQLError } from 'graphql/error';
import { IPageable, PublishingHouseEntity } from '@/lib/data/types';
import PublishingHouse from '@/lib/data/models/publishing-house';
import BookSeries from '@/lib/data/models/book-series';
import { checkUsageInBook, getByName, getValidFilters, setFiltersAndPageSettingsToQuery } from '@/lib/data/base';

export async function getPublishingHouses(pageSettings?: IPageable, filters?: PublishingHouseEntity) {
    const { andFilters } = getValidFilters(filters);

    return setFiltersAndPageSettingsToQuery(
        PublishingHouse.find(),
        andFilters,
        pageSettings
    );
}

export async function getPublishingHouseById(id: string) {
    if (!id) {
        throw new GraphQLError(`No Publishing House found with id ${id}`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }

    return PublishingHouse.findById(id);
}

export async function getPublishingHousesByIds(ids: string[]) {
    return PublishingHouse.find({ id: ids });
}

export async function createPublishingHouse(input: PublishingHouseEntity) {
    const item = await getByName<PublishingHouseEntity>(PublishingHouse, input.name);

    if (item) {
        return null;
    } else {
        const bookSeries = new BookSeries({
            name: '-',
            publishingHouse: new PublishingHouse(input)
        });

        await bookSeries.publishingHouse.save();
        await bookSeries.save();

        return { ...input, id: bookSeries.publishingHouse.id } as PublishingHouseEntity;
    }
}

export async function updatePublishingHouse(input: PublishingHouseEntity) {
    if (!input.id) {
        throw new GraphQLError(`No Publishing House found with id ${input.id}`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    const itemByName = await getByName<PublishingHouseEntity>(PublishingHouse, input.name);

    if (itemByName && itemByName.id.toString() !== input.id) {
        throw new GraphQLError(`Publishing House with name '${input.name}' already exists.`, {
            extensions: { code: 'DUPLICATE_ERROR' }
        });
    }
    await PublishingHouse.findByIdAndUpdate(input.id, input);

    return input as PublishingHouseEntity;
}

export async function deletePublishingHouse(id: string) {
    const bookSeriesIds = await BookSeries.find({ publishingHouse: id });

    if (bookSeriesIds) {
        await checkUsageInBook('bookSeries', bookSeriesIds, 'Publishing House');
        await BookSeries.deleteMany({ _id: bookSeriesIds });
    }

    await PublishingHouse.findByIdAndDelete(id);

    return { id } as PublishingHouseEntity;
}
