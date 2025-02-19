import { CoverTypeEntity, IPageable } from '@/lib/data/types';
import { GraphQLError } from 'graphql/error';
import CoverType from '@/lib/data/models/cover-type';
import { checkUsageInBook, getByName, getValidFilters, getDataByFiltersAndPageSettings } from '@/lib/data/base';

export async function getCoverTypes(pageSettings?: IPageable, filters?: CoverTypeEntity) {
    const { andFilters } = getValidFilters(filters);
    return getDataByFiltersAndPageSettings(
        CoverType.find(),
        andFilters,
        pageSettings
    );
}

export async function createCoverType(input: CoverTypeEntity)  {
    const item = await getByName<CoverTypeEntity>(CoverType, input.name);

    if (item) {
        return null;
    } else {
        const item = new CoverType(input);

        await item.save();

        return { ...input, id: item.id } as CoverTypeEntity;
    }
}

export async function updateCoverType(input: CoverTypeEntity) {
    if (!input.id) {
        throw new GraphQLError(`Не вказан ідентифікатор.`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    const itemByName = await getByName<CoverTypeEntity>(CoverType, input.name);

    if (itemByName && itemByName.name.toLowerCase() === input.name.toLowerCase() && itemByName.id.toString() !== input.id) {
        throw new GraphQLError(`Обкладинка з назвою '${input.name}' вже є.`, {
            extensions: { code: 'DUPLICATE_ERROR' }
        });
    }
    await CoverType.findByIdAndUpdate(input.id, input);

    return input as CoverTypeEntity;
}

export async function getCoverTypeById(id: string) {
    return CoverType.findById(id);
}

export async function deleteCoverType(id: string) {
    await checkUsageInBook('coverType', [id], 'Cover Type');
    await CoverType.findByIdAndDelete(id);

    return { id } as CoverTypeEntity;
}
