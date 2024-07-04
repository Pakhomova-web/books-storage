import { PublishingHouseEntity } from '@/lib/data/types';
import { connection } from '@/lib/data/connection';
import { getBookSeriesTable } from '@/lib/data/book-series';

const getPublishingHouseTable = () => connection().table<PublishingHouseEntity>('publishingHouse');

export async function getPublishingHouses(orderBy: string, order: string) {
    return getPublishingHouseTable().select().orderBy(orderBy, order);
}

export async function getPublishingHouseById(id: string) {
    return getPublishingHouseTable().first().where({ id });
}

export async function getPublishingHousesByIds(ids: string[]) {
    return getPublishingHouseTable().select().whereIn('id', ids);
}

export async function createPublishingHouse({ name }) {
    const item = await getPublishingHouseTable().first().where({ name });

    if (item) {
        return null;
    }

    await getPublishingHouseTable().insert({ name });
    const data = await getPublishingHouseTable().first().where({ name });

    await getBookSeriesTable().insert({ name: '-', publishingHouseId: data.id });

    return data as PublishingHouseEntity;
}

export async function updatePublishingHouse({ id, name }: PublishingHouseEntity) {
    if (!id) {
        return null;
    }
    const item = await getPublishingHouseTable().first().where({ id });
    if (!item) {
        return null;
    }

    await getPublishingHouseTable().update({ name }).where({ id });
    return { ...item, name } as PublishingHouseEntity;
}

export async function deletePublishingHouse(id: string) {
    const data = await connection()
        .select('bookSeries.publishingHouseId as publishingHouseId')
        .from('book')
        .join('bookSeries', 'book.bookSeriesId', '=', 'bookSeries.id')
        .where({ publishingHouseId: id });

    if (data.length) {
     return null;
    }
    await getBookSeriesTable().delete().where({ publishingHouseId: id });
    await getPublishingHouseTable().delete().where({ id });

    return { id } as PublishingHouseEntity;
}
