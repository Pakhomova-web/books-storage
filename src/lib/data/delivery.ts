import { DeliveryEntity, IPageable, UkrPoshtaWarehouse } from '@/lib/data/types';
import Delivery from '@/lib/data/models/delivery';
import { GraphQLError } from 'graphql/error';
import { getByName, getValidFilters, getDataByFiltersAndPageSettings } from '@/lib/data/base';
import GoogleSheetsMapper from 'google-sheets-mapper';

export async function getDeliveries(pageSettings?: IPageable, filters?: DeliveryEntity) {
    const { andFilters } = getValidFilters(filters);
    return getDataByFiltersAndPageSettings(
        Delivery.find(),
        andFilters,
        pageSettings
    );
}

export async function getDeliveryOptions() {
    return Delivery.find().sort({ name: 'asc' });
}

export async function getUkrPoshtaWarehouses(): Promise<UkrPoshtaWarehouse[]> {
    return GoogleSheetsMapper.fetchGoogleSheetsData({
        sheetId: '1bEQ8a8PNVTrUIHylIceu8Ho7s1XImvzLWPVTCIPQL0s',
        apiKey: process.env.GOOGLE_API_KEY
    }).then(res => {
        let temp = res.find(({ id }) => id === 'postindex');

        return temp ? temp.data as UkrPoshtaWarehouse[] : [];
    });
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
