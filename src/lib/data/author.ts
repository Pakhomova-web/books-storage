import { AuthorEntity, BookSeriesFilter, IOption, IPageable } from '@/lib/data/types';
import Author from '@/lib/data/models/author';
import { GraphQLError } from 'graphql/error';
import { checkUsageInBook, getByName, getDataByFiltersAndPageSettings, getValidFilters } from '@/lib/data/base';

export async function getAuthors(pageSettings?: IPageable, filters?: AuthorEntity) {
    const { andFilters } = getValidFilters(filters);
    return getDataByFiltersAndPageSettings(
        Author.find(),
        andFilters,
        pageSettings
    );
}

export async function getAuthorsOptions(filters?: BookSeriesFilter): Promise<IOption<string>[]> {
    const { andFilters } = getValidFilters(filters);
    const query = Author.find();

    if (!!andFilters.length) {
        query.and(andFilters);
    }
    const items = await query.sort({ name: 'asc' });

    return items.map(item => ({
        id: item.id,
        label: item.name
    }));
}

export async function createAuthor(input: AuthorEntity)  {
    const item = await getByName<AuthorEntity>(Author, input.name);

    if (item) {
        return null;
    } else {
        const item = new Author(input);

        await item.save();

        return { ...input, id: item.id } as AuthorEntity;
    }
}

export async function updateAuthor(input: AuthorEntity) {
    if (!input.id) {
        throw new GraphQLError(`Не вказан ідентифікатор.`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    const itemByName = await getByName<AuthorEntity>(Author, input.name);

    if (itemByName && itemByName.name.toLowerCase() === input.name.toLowerCase() && itemByName.id.toString() !== input.id) {
        throw new GraphQLError(`Автор з іменем '${input.name}' вже є.`, {
            extensions: { code: 'DUPLICATE_ERROR' }
        });
    }
    await Author.findByIdAndUpdate(input.id, input);

    return input as AuthorEntity;
}

export async function getAuthorById(id: string) {
    if (!id) {
        throw new GraphQLError(`Не вказан ідентифікатор.`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }

    return Author.findById(id);
}

export async function deleteAuthor(id: string) {
    await checkUsageInBook('authors', [id], 'Author');
    await Author.findByIdAndDelete(id);

    return { id } as AuthorEntity;
}
