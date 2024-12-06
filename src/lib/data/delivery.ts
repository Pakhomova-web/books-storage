import { DeliveryEntity, IPageable } from '@/lib/data/types';
import Delivery from '@/lib/data/models/delivery';
import { GraphQLError } from 'graphql/error';
import { getByName, getValidFilters, getDataByFiltersAndPageSettings } from '@/lib/data/base';

export async function getDeliveries(pageSettings?: IPageable, filters?: DeliveryEntity) {
    const { andFilters } = getValidFilters(filters);
    return getDataByFiltersAndPageSettings(
        Delivery.find(),
        andFilters,
        pageSettings
    );
}

export async function getDeliveryOptions() {
    return Delivery.find().sort({ name: 'asc'});
}

export async function createDelivery(input: DeliveryEntity) {
    const item = await getByName<DeliveryEntity>(Delivery, input.name);

    if (item) {
        return null;
    } else {
        const item = new Delivery(input);

        await item.save();

        return { ...input, id: item.id } as DeliveryEntity;
    }
}

export async function updateDelivery(input: DeliveryEntity) {
    if (!input.id) {
        throw new GraphQLError(`Не вказан ідентифікатор.`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    const itemByName = await getByName<DeliveryEntity>(Delivery, input.name);

    if (itemByName && itemByName.name.toLowerCase() === input.name.toLowerCase() && itemByName.id.toString() !== input.id) {
        throw new GraphQLError(`Спосіб доставки з назвою '${input.name}' вже є.`, {
            extensions: { code: 'DUPLICATE_ERROR' }
        });
    }
    await Delivery.findByIdAndUpdate(input.id, input);

    return input as DeliveryEntity;
}

export async function getDeliveryById(id: string) {
    return Delivery.findById(id);
}

export async function deleteDelivery(id: string) {
    // TODO check usage in orders await checkUsageInBook('delivery', [id], 'Delivery');
    await Delivery.findByIdAndDelete(id);

    return { id } as DeliveryEntity;
}
