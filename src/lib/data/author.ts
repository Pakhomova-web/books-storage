import { AuthorEntity } from '@/lib/data/types';
import { connection } from '@/lib/data/connection';

const getAuthorTable = () => connection().table<AuthorEntity>('author');

export async function getAuthors(orderBy: string, order: string) {
    return await getAuthorTable().select().orderBy(orderBy, order);
}

export async function getAuthorById(id: string) {
    return await getAuthorTable().first().where({ id });
}

export async function createAuthor({ name })  {
    const item = await getAuthorTable().first().where({ name });

    if (item) {
        return null;
    }

    await getAuthorTable().insert({ name });
    const data = await getAuthorTable().first().where({ name });

    return data as AuthorEntity;
}

export async function updateAuthor({ id, name }: AuthorEntity) {
    if (!id) {
        return null;
    }
    const item = await getAuthorTable().first().where({ id });
    if (!item) {
        return null;
    }

    await getAuthorTable().update({ name }).where({ id });
    return { ...item, name } as AuthorEntity;
}

export async function deleteAuthor(id: string) {
    await getAuthorTable().delete().where({ id });

    return { id } as AuthorEntity;
}
