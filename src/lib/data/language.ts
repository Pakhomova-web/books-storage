import { LanguageEntity } from '@/lib/data/types';
import { connection } from '@/lib/data/connection';

const getLanguageTable = () => connection().table<LanguageEntity>('language');

export async function getLanguages(orderBy: string, order: string) {
    return await getLanguageTable().select().orderBy(orderBy, order);
}

export async function getLanguageById(id: string) {
    return await getLanguageTable().first().where({ id });
}

export async function createLanguage({ name })  {
    const language = await getLanguageTable().first().where({ name });

    if (language) {
        return null;
    }

    await getLanguageTable().insert({ name });
    const data = await getLanguageTable().first().where({ name });

    return data as LanguageEntity;
}

export async function updateLanguage({ id, name }: LanguageEntity) {
    if (!id) {
        return null;
    }
    const language = await getLanguageTable().first().where({ id });
    if (!language) {
        return null;
    }

    await getLanguageTable().update({ name }).where({ id });
    return { ...language, name } as LanguageEntity;
}

export async function deleteLanguage(id: string) {
    await getLanguageTable().delete().where({ id });

    return { id } as LanguageEntity;
}
