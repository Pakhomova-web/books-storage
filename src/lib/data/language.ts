import { IPageable, LanguageEntity } from '@/lib/data/types';
import Language from './models/language';
import { GraphQLError } from 'graphql/error';
import { checkUsageInBook, getByName, getValidFilters } from '@/lib/data/base';

export async function getLanguages(pageSettings: IPageable, filters?: LanguageEntity) {
    return Language.find(getValidFilters(filters), null).sort({ [pageSettings.orderBy || 'name']: pageSettings.order || 'asc' });
}

export async function createLanguage(input: LanguageEntity) {
    const item = await getByName(Language, input.name);

    if (item) {
        return null;
    } else {
        const item = new Language(input);

        await item.save();

        return { ...input, id: item.id } as LanguageEntity;
    }
}

export async function updateLanguage(input: LanguageEntity) {
    if (!input.id) {
        throw new GraphQLError(`No Language found with id ${input.id}`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    const itemByName = await getByName(Language, input.name);

    if (itemByName && itemByName.id.toString() !== input.id) {
        throw new GraphQLError(`Language with name '${input.name}' already exists.`, {
            extensions: { code: 'DUPLICATE_ERROR' }
        });
    }
    await Language.findOneAndUpdate({ _id: input.id }, input);

    return input as LanguageEntity;
}

export async function getLanguageById(id: string) {
    return await Language.findById(id);
}

export async function deleteLanguage(id: string) {
    await checkUsageInBook('languageId', [id], 'Language');
    await Language.findByIdAndDelete(id);

    return { id } as LanguageEntity;
}
