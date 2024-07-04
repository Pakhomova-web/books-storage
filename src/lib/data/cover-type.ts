import { CoverTypeEntity } from '@/lib/data/types';
import { connection } from '@/lib/data/connection';

const getCoverTypeTable = () => connection().table<CoverTypeEntity>('coverType');

export async function getCoverTypes(orderBy: string, order: string) {
    return await getCoverTypeTable().select().orderBy(orderBy, order);
}

export async function getCoverTypeById(id: string) {
    return await getCoverTypeTable().first().where({ id });
}

export async function createCoverType({ name })  {
    const item = await getCoverTypeTable().first().where({ name });

    if (item) {
        return null;
    }

    await getCoverTypeTable().insert({ name });
    const data = await getCoverTypeTable().first().where({ name });

    return data as CoverTypeEntity;
}

export async function updateCoverType({ id, name }: CoverTypeEntity) {
    if (!id) {
        return null;
    }
    const item = await getCoverTypeTable().first().where({ id });
    if (!item) {
        return null;
    }

    await getCoverTypeTable().update({ name }).where({ id });
    return { ...item, name } as CoverTypeEntity;
}

export async function deleteCoverType(id: string) {
    await getCoverTypeTable().delete().where({ id });

    return { id } as CoverTypeEntity;
}
