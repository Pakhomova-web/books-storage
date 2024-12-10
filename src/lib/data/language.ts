import { IPageable, LanguageEntity } from '@/lib/data/types';
import Language from './models/language';
import { GraphQLError } from 'graphql/error';
import { checkUsageInBook, getByName, getValidFilters, getDataByFiltersAndPageSettings } from '@/lib/data/base';

export async function getLanguages(pageSettings?: IPageable, filters?: LanguageEntity) {
    const { andFilters } = getValidFilters(filters);
    return getDataByFiltersAndPageSettings(
        Language.find(),
        andFilters,
        pageSettings
    );
}

export async function createLanguage(input: LanguageEntity) {
    const item = await getByName<LanguageEntity>(Language, input.name);

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
        throw new GraphQLError(`Не вказан ідентифікатор.`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    const itemByName = await getByName<LanguageEntity>(Language, input.name);

    if (itemByName && itemByName.name.toLowerCase() === input.name.toLowerCase() && itemByName.id.toString() !== input.id) {
        throw new GraphQLError(`Мова '${input.name}' вже є.`, {
            extensions: { code: 'DUPLICATE_ERROR' }
        });
    }
    await Language.findByIdAndUpdate(input.id, input);

    return input as LanguageEntity;
}

export async function getLanguageById(id: string) {
    if (!id) {
        throw new GraphQLError(`Не вказан ідентифікатор.`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }

    return await Language.findById(id);
}

export async function deleteLanguage(id: string) {
    await checkUsageInBook('languages', [id], 'Language');
    await Language.findByIdAndDelete(id);

    return { id } as LanguageEntity;
}
