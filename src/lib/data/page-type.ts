import { PageTypeEntity } from '@/lib/data/types';
import { connection } from '@/lib/data/connection';

const getPageTypeTable = () => connection().table<PageTypeEntity>('pageType');

export async function getPageTypes(orderBy: string, order: string) {
    return await getPageTypeTable().select().orderBy(orderBy, order);
}

export async function getPageTypeById(id: string) {
    return await getPageTypeTable().first().where({ id });
}

export async function createPageType({ name })  {
    const item = await getPageTypeTable().first().where({ name });

    if (item) {
        return null;
    }

    await getPageTypeTable().insert({ name });
    const data = await getPageTypeTable().first().where({ name });

    return data as PageTypeEntity;
}

export async function updatePageType({ id, name }: PageTypeEntity) {
    if (!id) {
        return null;
    }
    const item = await getPageTypeTable().first().where({ id });
    if (!item) {
        return null;
    }

    await getPageTypeTable().update({ name }).where({ id });
    return { ...item, name } as PageTypeEntity;
}

export async function deletePageType(id: string) {
    await getPageTypeTable().delete().where({ id });

    return { id } as PageTypeEntity;
}
