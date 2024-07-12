import { GraphQLError } from 'graphql/error';
import { PublishingHouseEntity } from '@/lib/data/types';
import PublishingHouse from '@/lib/data/models/publishing-house';
import BookSeries from '@/lib/data/models/book-series';
import { checkUsageInBook, getByName } from '@/lib/data/base';
import Book from '@/lib/data/models/book';

export async function getPublishingHouses(orderBy: string, order: string) {
    return PublishingHouse.find(null, null, { sort: { [orderBy]: order } });
}

export async function getPublishingHouseById(id: string) {
    return PublishingHouse.findById(id);
}

export async function getPublishingHousesByIds(ids: string[]) {
    return PublishingHouse.find({ id: ids });
}

export async function createPublishingHouse(input: PublishingHouseEntity) {
    const item = await getByName(PublishingHouse, input.name);

    if (item) {
        return null;
    } else {
        const item = new PublishingHouse(input);

        console.log(item);
        await item.save();
        const bookSeries = new BookSeries({ name: '-', publishingHouseId: item.id });

        await bookSeries.save();

        return { ...input, id: item.id } as PublishingHouseEntity;
    }
}

export async function updatePublishingHouse(input: PublishingHouseEntity) {
    if (!input.id) {
        throw new GraphQLError(`No Publishing House found with id ${input.id}`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    const itemByName = await getByName(PublishingHouse, input.name);

    if (itemByName && itemByName.id.toString() !== input.id) {
        throw new GraphQLError(`Publishing House with name '${input.name}' already exists.`, {
            extensions: { code: 'DUPLICATE_ERROR' }
        });
    }
    await PublishingHouse.findOneAndUpdate({ _id: input.id }, input);

    return input as PublishingHouseEntity;
}

export async function deletePublishingHouse(id: string) {
    const bookSeriesIds = await BookSeries.find({ publishingHouseId: id });

    if (bookSeriesIds) {
        await checkUsageInBook('bookSeriesId', bookSeriesIds, 'Publishing House');
        await BookSeries.deleteMany({ _id: bookSeriesIds });
    }

    await PublishingHouse.findByIdAndDelete(id);

    return { id } as PublishingHouseEntity;
}
