import { CoverTypeEntity, IPageable } from '@/lib/data/types';
import { GraphQLError } from 'graphql/error';
import CoverType from '@/lib/data/models/cover-type';
import { checkUsageInBook, getByName, getValidFilters } from '@/lib/data/base';
import Book from '@/lib/data/models/book';

export async function getCoverTypes(pageSettings?: IPageable, filters?: CoverTypeEntity) {
    return CoverType.find(getValidFilters(filters), null).sort({ [pageSettings?.orderBy || 'name']: pageSettings?.order || 'asc' });
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
        throw new GraphQLError(`No Cover Type found with id ${input.id}`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    const itemByName = await getByName<CoverTypeEntity>(CoverType, input.name);

    if (itemByName && itemByName.id.toString() !== input.id) {
        throw new GraphQLError(`Cover Type with name '${input.name}' already exists.`, {
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
    await checkUsageInBook('coverTypeId', [id], 'Cover Type');
    await CoverType.findByIdAndDelete(id);

    return { id } as CoverTypeEntity;
}
