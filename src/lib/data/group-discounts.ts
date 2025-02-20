import { GroupDiscountEntity, IGroupDiscountFilter, IPageable } from '@/lib/data/types';
import GroupDiscount from '@/lib/data/models/group-discount';
import { GraphQLError } from 'graphql/error';
import { getDataByFiltersAndPageSettings, getValidFilters } from '@/lib/data/base';

export async function getGroupDiscounts(pageSettings?: IPageable, filters?: IGroupDiscountFilter) {
    const isInStock = !!filters?.isInStock;

    if (filters) {
        delete filters.isInStock;
    }
    const { andFilters } = getValidFilters(filters);

    const data = await getDataByFiltersAndPageSettings(
        GroupDiscount.find()
            .populate({
                path: 'books',
                populate: [
                    { path: 'languages' },
                    {
                        path: 'bookSeries',
                        populate: {
                            path: 'publishingHouse'
                        }
                    }
                ]
            }),
        andFilters,
        pageSettings
    );

    return !!isInStock ? { ...data, items: data.items.filter(group => group.books.every(b => !!b.numberInStock)) } : data;
}

export async function getGroupDiscountsByIds(ids: string[], pageSettings: IPageable) {
    if (!ids?.length) {
        return { items: [], totalCount: 0 };
    }

    const query = GroupDiscount
        .find({ _id: ids })
        .populate({
            path: 'books',
            populate: [
                { path: 'languages' },
                {
                    path: 'bookSeries',
                    populate: {
                        path: 'publishingHouse'
                    }
                }
            ]
        });

    if (pageSettings && pageSettings.rowsPerPage && pageSettings.page !== undefined) {
        query
            .skip(pageSettings.rowsPerPage * pageSettings.page)
            .limit(pageSettings.rowsPerPage);
    }
    query.sort({ bookSeries: 'desc', numberInStock: 'desc' });

    const totalCount = await query.countDocuments();
    const items = await query.find();

    return { items, totalCount };
}

export async function createGroupDiscount(input: GroupDiscountEntity) {
    const items = await GroupDiscount.find({ books: { $all: input.bookIds } });

    if (items.some(item => item.books.length === input.bookIds.length)) {
        throw new GraphQLError(`Знижка для такої комбінації книжок вже є.`, {
            extensions: { code: 'DUPLICATE_ERROR' }
        });
    }
    const item = new GroupDiscount({
        discount: input.discount,
        books: input.bookIds
    });

    await item.save();

    return { ...input, id: item.id } as GroupDiscountEntity;
}

export async function updateGroupDiscount(input: GroupDiscountEntity) {
    if (!input.id) {
        throw new GraphQLError(`Не вказан ідентифікатор.`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    const items = await GroupDiscount.find({ books: { $all: input.bookIds } });

    if (items.some(item => item.id !== input.id && item.books.length === input.bookIds.length)) {
        throw new GraphQLError(`Знижка для такої комбінації книжок вже є.`, {
            extensions: { code: 'DUPLICATE_ERROR' }
        });
    }
    await GroupDiscount.findByIdAndUpdate(input.id, {
        discount: input.discount,
        books: input.bookIds
    });

    return input as GroupDiscountEntity;
}

export async function deleteGroupDiscount(id: string) {
    await GroupDiscount.findByIdAndDelete(id);

    return { id } as GroupDiscountEntity;
}
