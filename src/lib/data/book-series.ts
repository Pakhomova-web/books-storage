import { connection } from '@/lib/data/connection';
import { BookSeriesEntity } from '@/lib/data/types';

export const getBookSeriesTable = () => connection().table<BookSeriesEntity>('bookSeries');

export async function getBookSeries(orderBy?: string, order?: string, filters?: { name?, publishingHouseId? }) {
    const validFilters = {};

    if (filters) {
        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                validFilters[key] = filters[key];
            }
        });
    }
    return connection()
        .select('bookSeries.id as id', 'bookSeries.name as name', 'publishingHouseId', 'publishingHouse.name as publishingHouseName')
        .from('bookSeries')
        .join('publishingHouse as publishingHouse', 'bookSeries.publishingHouseId', '=', 'publishingHouse.id')
        .where(validFilters)
        .orderBy(orderBy, order);
}

export async function getBookSeriesById(id: string) {
    return getBookSeriesTable().first().where({ id });
}

export async function createBookSeries({ name, publishingHouseId }) {
    const item = await getBookSeriesTable().first().where({ name, publishingHouseId });

    if (item) {
        return null;
    }

    await getBookSeriesTable().insert({ name, publishingHouseId });
    const data = await getBookSeriesTable().first().where({ name, publishingHouseId });

    return data as BookSeriesEntity;
}

export async function updateBookSeries({ id, name, publishingHouseId }: BookSeriesEntity) {
    if (!id) {
        return null;
    }
    const item = await getBookSeriesTable().first().where({ id });
    if (!item) {
        return null;
    }

    await getBookSeriesTable().update({ name, publishingHouseId }).where({ id });
    return { ...item, name, publishingHouseId } as BookSeriesEntity;
}

export async function deleteBookSeries(id: string) {
    await getBookSeriesTable().delete().where({ id });

    return { id } as BookSeriesEntity;
}
