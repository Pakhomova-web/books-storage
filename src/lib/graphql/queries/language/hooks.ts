import { IPageable, LanguageEntity } from '@/lib/data/types';
import {
    createLanguageQuery, deleteLanguageQuery,
    languageOptionsQuery,
    languagesQuery,
    updateLanguageQuery
} from '@/lib/graphql/queries/language/queries';
import { _useCreateItem, _useDeleteItemById, _useItems, _useUpdateItem } from '@/lib/graphql/base-hooks';

export function useLanguages(pageSettings?: IPageable, filters?: LanguageEntity) {
    return _useItems<LanguageEntity>(languagesQuery, pageSettings, filters);
}

export function useLanguageOptions<T>(pageSettings?: IPageable) {
    return _useItems<T>(languageOptionsQuery, pageSettings);
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
