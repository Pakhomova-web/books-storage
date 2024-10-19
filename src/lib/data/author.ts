import { AuthorEntity, IPageable } from '@/lib/data/types';
import Author from '@/lib/data/models/author';
import { GraphQLError } from 'graphql/error';
import { checkUsageInBook, getByName, getValidFilters, setFiltersAndPageSettingsToQuery } from '@/lib/data/base';

export async function getAuthors(pageSettings?: IPageable, filters?: AuthorEntity) {
    const { andFilters } = getValidFilters(filters);

    return setFiltersAndPageSettingsToQuery(
        Author.find(),
        andFilters,
        pageSettings
    );
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
        throw new GraphQLError(`No Author found with id ${input.id}`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    const itemByName = await getByName<AuthorEntity>(Author, input.name);

    if (itemByName && itemByName.id.toString() !== input.id) {
        throw new GraphQLError(`Author with name '${input.name}' already exists.`, {
            extensions: { code: 'DUPLICATE_ERROR' }
        });
    }
    await Author.findByIdAndUpdate(input.id, input);

    return input as AuthorEntity;
}

export async function getAuthorById(id: string) {
    if (!id) {
        throw new GraphQLError(`No Author found with id ${id}`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }

    return Author.findById(id);
}

export async function deleteAuthor(id: string) {
    await checkUsageInBook('author', [id], 'Author');
    await Author.findByIdAndDelete(id);

    return { id } as AuthorEntity;
}
