import { AuthorEntity } from '@/lib/data/types';
import Author from '@/lib/data/models/author';
import { GraphQLError } from 'graphql/error';
import { checkUsageInBook, getByName } from '@/lib/data/base';
import Book from '@/lib/data/models/book';

export async function getAuthors(orderBy: string, order: string) {
    return Author.find(null, null, { sort: { [orderBy]: order } });
}

export async function createAuthor(input: AuthorEntity)  {
    const item = await getByName(Author, input.name);

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
    const itemByName = await getByName(Author, input.name);

    if (itemByName && itemByName.id.toString() !== input.id) {
        throw new GraphQLError(`Author with name '${input.name}' already exists.`, {
            extensions: { code: 'DUPLICATE_ERROR' }
        });
    }
    await Author.findOneAndUpdate({ _id: input.id }, input);

    return input as AuthorEntity;
}

export async function getAuthorById(id: string) {
    return Author.findById(id);
}

export async function deleteAuthor(id: string) {
    await checkUsageInBook('authorId', [id], 'Author');
    await Author.findByIdAndDelete(id);

    return { id } as AuthorEntity;
}
