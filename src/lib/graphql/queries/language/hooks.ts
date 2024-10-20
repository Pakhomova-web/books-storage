import { IPageable, LanguageEntity } from '@/lib/data/types';
import {
    createLanguageQuery,
    deleteLanguageQuery, languageByIdQuery,
    languageOptionsQuery,
    languagesQuery,
    updateLanguageQuery
} from '@/lib/graphql/queries/language/queries';
import { _useCreateItem, _useDeleteItemById, _useItems, _useUpdateItem, getItemById } from '@/lib/graphql/base-hooks';
import { bookTypeByIdQuery } from '@/lib/graphql/queries/book-type/queries';

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

export function getLanguageById(id: string): Promise<LanguageEntity> {
    return getItemById<LanguageEntity>(languageByIdQuery, id);
}
