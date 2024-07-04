import { BookTypeEntity } from '@/lib/data/types';
import { connection } from '@/lib/data/connection';

const getBookTypeTable = () => connection().table<BookTypeEntity>('bookType');

export async function getBookTypes(orderBy: string, order: string) {
    return await getBookTypeTable().select().orderBy(orderBy, order);
}

export async function getBookTypeById(id: string) {
    return await getBookTypeTable().first().where({ id });
}

export async function createBookType({ name })  {
    const item = await getBookTypeTable().first().where({ name });

    if (item) {
        return null;
    }

    await getBookTypeTable().insert({ name });
    const data = await getBookTypeTable().first().where({ name });

    return data as BookTypeEntity;
}

export async function updateBookType({ id, name }: BookTypeEntity) {
    if (!id) {
        return null;
    }
    const item = await getBookTypeTable().first().where({ id });
    if (!item) {
        return null;
    }

    await getBookTypeTable().update({ name }).where({ id });
    return { ...item, name } as BookTypeEntity;
}

export async function deleteBookType(id: string) {
    await getBookTypeTable().delete().where({ id });

    return { id } as BookTypeEntity;
}
