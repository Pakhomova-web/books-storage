const API_URL = 'https://api.novaposhta.ua/v2.0/json/';

export async function getSettlements(searchValue: string) {
    const { data } = await getRequest('searchSettlements', { CityName: searchValue });

    return data.length ? data[0].Addresses.map(item => ({
        ref: item.Ref,
        city: item.MainDescription,
        region: item.Area,
        district: item.Region,
        title: item.Present
    })) : [];
}

export async function getWarehouses(ref: string, searchValue: string) {
    const { data } = await getRequest('getWarehouses', { SettlementRef: ref, FindByString: searchValue });

    return data.length ? data.map(item => ({
        number: item.Number,
        description: item.Description
    })) : [];
}

export async function getStreets(ref: string, searchValue: string) {
    const { data } = await getRequest('searchSettlementStreets', {
        SettlementRef: ref,
        StreetName: searchValue
    }, false);

    return data.length ? data[0].Addresses.map(item => ({
        description: item.Present
    })) : [];
}

async function getRequest(calledMethod: string, methodProperties: any, withPage = true) {
    const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({
            apiKey: process.env.NOVA_POSHTA_API_KEY,
            modelName: 'AddressGeneral',
            calledMethod,
            methodProperties: { ...methodProperties, Limit: 50, ...(withPage ? { Page: 1 } : {}) }
        })
    });

    return response.json();
}
