import { IPageable, PageTypeEntity } from '@/lib/data/types';
import { GraphQLError } from 'graphql/error';
import PageType from '@/lib/data/models/page-type';
import { checkUsageInBook, getByName, getValidFilters, getDataByFiltersAndPageSettings } from '@/lib/data/base';
import Language from '@/lib/data/models/language';

export async function getPageTypes(pageSettings?: IPageable, filters?: PageTypeEntity) {
    const { andFilters } = getValidFilters(filters);
    return getDataByFiltersAndPageSettings(
        PageType.find(),
        andFilters,
        pageSettings
    );
}

export async function createPageType(input: PageTypeEntity) {
    const item = await getByName<PageTypeEntity>(PageType, input.name);

    if (item) {
        return null;
    } else {
        const item = new PageType(input);

        await item.save();

        return { ...input, id: item.id } as PageTypeEntity;
    }
}

export async function updatePageType(input: PageTypeEntity) {
    if (!input.id) {
        throw new GraphQLError(`Не вказан ідентифікатор.`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    const itemByName = await getByName<PageTypeEntity>(PageType, input.name);

    if (itemByName && itemByName.name.toLowerCase() === input.name.toLowerCase() && itemByName.id.toString() !== input.id) {
        throw new GraphQLError(`Тип сторінок з назвою '${input.name}' вже є.`, {
            extensions: { code: 'DUPLICATE_ERROR' }
        });
    }
    await PageType.findByIdAndUpdate(input.id, input);

    return input as PageTypeEntity;
}

export async function getPageTypeById(id: string) {
    return PageType.findById(id);
}

export async function deletePageType(id: string) {
    await checkUsageInBook('pageType', [id], 'Page Type');
    await PageType.findByIdAndDelete(id);

    return { id } as PageTypeEntity;
}
