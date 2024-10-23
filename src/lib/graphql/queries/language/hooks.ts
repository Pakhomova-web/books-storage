import { IOption, IPageable, LanguageEntity, NameFilter } from '@/lib/data/types';
import {
    createLanguageQuery,
    deleteLanguageQuery,
    languageByIdQuery,
    languageOptionsQuery,
    languagesQuery,
    updateLanguageQuery
} from '@/lib/graphql/queries/language/queries';
import { _useCreateItem, _useDeleteItemById, _useItems, _useUpdateItem, getItemById } from '@/lib/graphql/base-hooks';

export function useLanguages(pageSettings?: IPageable, filters?: LanguageEntity) {
    return _useItems<LanguageEntity, NameFilter>(languagesQuery, pageSettings, filters);
}

export function useLanguageOptions() {
    return _useItems<IOption<string>, NameFilter>(languageOptionsQuery);
}

export function useUpdateLanguage() {
    return _useUpdateItem<LanguageEntity>(updateLanguageQuery);
}

export function useCreateLanguage() {
    return _useCreateItem<LanguageEntity>(createLanguageQuery);
}

export function useDeleteLanguage() {
    return _useDeleteItemById(deleteLanguageQuery);
}

export function getLanguageById(id: string): Promise<LanguageEntity> {
    return getItemById<LanguageEntity>(languageByIdQuery, id);
}
