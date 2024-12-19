import { Box, FormControlLabel, Grid, Radio, RadioGroup } from '@mui/material';
import { FormContainer } from 'react-hook-form-mui';
import React, { useState } from 'react';

import { borderRadius, primaryLightColor, styleVariables } from '@/constants/styles-variables';
import { isNovaPostSelected, isSelfPickup, isUkrPoshtaSelected } from '@/utils/utils';
import SettlementAutocompleteField from '@/components/form-fields/settlement-autocomplete-field';
import WarehouseAutocompleteField from '@/components/form-fields/warehouses-autocomplete-field';
import StreetAutocompleteField from '@/components/form-fields/street-autocomplete-field';
import CustomTextField from '@/components/form-fields/custom-text-field';
import { styled } from '@mui/material/styles';
import { DELIVERIES } from '@/constants/options';
import { NovaPoshtaSettlementEntity, NovaPoshtaStreetEntity, NovaPoshtaWarehouseEntity } from '@/lib/data/types';

export interface IAddressForm {
    isCourier: boolean,
    deliveryId: string,
    novaPoshtaWarehouseCityRef: string,
    novaPoshtaWarehouseCity: string,
    novaPoshtaWarehouseRegion: string,
    novaPoshtaWarehouseDistrict: string,
    novaPoshtaWarehouse: number,
    novaPoshtaCourierCity: string,
    novaPoshtaCourierRegion: string,
    novaPoshtaCourierDistrict: string,
    novaPoshtaCourierStreet: string,
    novaPoshtaCourierHouse: string,
    novaPoshtaCourierFlat: string,
    novaPoshtaCourierCityRef: string,
    city: string,
    district: string,
    region: string,
    warehouse: number
}

const DeliveryBoxOption = styled(Box)(() => ({
    borderRadius,
    border: `1px solid ${primaryLightColor}`
}));

const deliveryOptions: { title: string, value: string }[] = [
    { value: 'NOVA_POSHTA_WAREHOUSE', title: 'Нова пошта (відділення/поштомат)' },
    { value: 'NOVA_POSHTA_COURIER', title: 'Нова пошта (адресна доставка до дверей)' },
    { value: 'UKRPOSHTA', title: 'Укрпошта (відділення)' },
    { value: 'SELF_PICKUP', title: 'Самовивіз' }
];

export function getAddressFromForm(address: IAddressForm) {
    let city = null;
    let region = null;
    let district = null;
    let street = null;
    let house = null;
    let flat = null;
    let warehouse = null;

    if (isNovaPostSelected(address.deliveryId)) {
        if (address.isCourier) {
            city = address.novaPoshtaCourierCity;
            region = address.novaPoshtaCourierRegion;
            district = address.novaPoshtaCourierDistrict;
            street = address.novaPoshtaCourierStreet;
            house = address.novaPoshtaCourierHouse;
            flat = address.novaPoshtaCourierFlat;
        } else {
            city = address.novaPoshtaWarehouseCity;
            region = address.novaPoshtaWarehouseRegion;
            district = address.novaPoshtaWarehouseDistrict;
            warehouse = address.novaPoshtaWarehouse;
        }
    } else if (isUkrPoshtaSelected(address.deliveryId)) {
        city = address.city;
        region = address.region;
        district = address.district;
        warehouse = address.warehouse;
    }

    return { city, region, district, street, house, flat, warehouse, deliveryId: address.deliveryId };
}

export default function AddressForm({ formContext, disabled = false }) {
    const {
        novaPoshtaWarehouseCity,
        novaPoshtaWarehouseRegion,
        novaPoshtaWarehouseDistrict,
        novaPoshtaWarehouseCityRef,
        novaPoshtaWarehouse,
        deliveryId,
        isCourier,
        novaPoshtaCourierCity,
        novaPoshtaCourierStreet,
        novaPoshtaCourierCityRef,
        novaPoshtaCourierDistrict,
        novaPoshtaCourierRegion
    } = formContext.watch();
    const [deliveryOption, setDeliveryOption] = useState<string>((isNovaPostSelected(deliveryId) ?
        deliveryOptions[isCourier ? 1 : 0] : deliveryOptions[isUkrPoshtaSelected(deliveryId) ? 2 : 3]).value);

    function onDeliveryOptionChange(value: string) {
        setDeliveryOption(value);
        switch (value) {
            case 'UKRPOSHTA':
                formContext.setValue('deliveryId', DELIVERIES.UKRPOSHTA);
                formContext.setValue('isCourier', false);
                break;
            case 'NOVA_POSHTA_WAREHOUSE':
                formContext.setValue('deliveryId', DELIVERIES.NOVA_POSHTA);
                formContext.setValue('isCourier', false);
                break;
            case 'NOVA_POSHTA_COURIER':
                formContext.setValue('deliveryId', DELIVERIES.NOVA_POSHTA);
                formContext.setValue('isCourier', true);
                break;
            case 'SELF_PICKUP':
                formContext.setValue('deliveryId', DELIVERIES.SELF_PICKUP);
                formContext.setValue('isCourier', false);
        }
    }

    function onNovaPoshtaWarehouseSelect(val: NovaPoshtaWarehouseEntity, refreshData = false) {
        if (refreshData) {
            formContext.setValue('novaPoshtaWarehouse', val?.number);
        }
    }

    function onNovaPoshtaSettlementSelect(val: NovaPoshtaSettlementEntity, refreshData = false) {
        if (refreshData) {
            formContext.setValue('novaPoshtaWarehouseCity', val?.city || '');
            formContext.setValue('novaPoshtaWarehouseRegion', val?.region || '');
            formContext.setValue('novaPoshtaWarehouseDistrict', val?.district || '');
            if (!val) {
                formContext.setValue('novaPoshtaWarehouse', null);
            }
        }
        formContext.setValue('novaPoshtaWarehouseCityRef', val?.ref || '');
    }

    function onNovaPoshtaCourierCitySelect(val: NovaPoshtaSettlementEntity, refreshData = false) {
        if (refreshData) {
            formContext.setValue('novaPoshtaCourierCity', val?.city || '');
            formContext.setValue('novaPoshtaCourierRegion', val?.region || '');
            formContext.setValue('novaPoshtaCourierDistrict', val?.district || '');
            if (!val) {
                formContext.setValue('novaPoshtaCourierStreet', null);
            }
        }
        formContext.setValue('novaPoshtaCourierCityRef', val?.ref || '');
    }

    function onNovaPoshtaCourierStreetSelect(val: NovaPoshtaStreetEntity, refreshData = false) {
        if (refreshData) {
            formContext.setValue('novaPoshtaCourierStreet', val?.description);
        }
    }

    return (
        <FormContainer formContext={formContext}>
            <Grid container spacing={2} mt={1}>
                <Grid item xs={12}>
                    <Box sx={styleVariables.sectionTitle}>Спосіб доставки</Box>
                </Grid>

                <Grid item xs={12}>
                    <RadioGroup value={deliveryOption}
                                onChange={(_, value: string) => onDeliveryOptionChange(value)}>
                        <Box display="flex" flexDirection="column" gap={1}>
                            {deliveryOptions.map((option, index) => (
                                <DeliveryBoxOption p={1} key={index}>
                                    <FormControlLabel value={option.value}
                                                      disabled={disabled}
                                                      control={<Radio/>}
                                                      label={option.title}/>

                                    {option.value === 'NOVA_POSHTA_WAREHOUSE' &&
                                      <Grid container spacing={2} mt={0}
                                            display={deliveryOption === option.value ? 'flex' : 'none'}>
                                        <Grid item xs={12} sm={6}>
                                          <SettlementAutocompleteField onSelect={(v, refresh) => onNovaPoshtaSettlementSelect(v, refresh)}
                                                                       disabled={disabled}
                                                                       city={novaPoshtaWarehouseCity}
                                                                       region={novaPoshtaWarehouseRegion}
                                                                       district={novaPoshtaWarehouseDistrict}/>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                          <WarehouseAutocompleteField settlementRef={novaPoshtaWarehouseCityRef}
                                                                      disabled={disabled}
                                                                      warehouse={novaPoshtaWarehouse}
                                                                      onSelect={(val: NovaPoshtaWarehouseEntity, refresh: boolean) => onNovaPoshtaWarehouseSelect(val, refresh)}/>
                                        </Grid>
                                      </Grid>}

                                    {option.value === 'NOVA_POSHTA_COURIER' &&
                                      <Grid container spacing={2} mt={0}
                                            display={deliveryOption === option.value ? 'flex' : 'none'}>
                                        <Grid item xs={12} sm={6}>
                                          <SettlementAutocompleteField onSelect={onNovaPoshtaCourierCitySelect}
                                                                       disabled={disabled}
                                                                       city={novaPoshtaCourierCity}
                                                                       region={novaPoshtaCourierRegion}
                                                                       district={novaPoshtaCourierDistrict}/>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                          <StreetAutocompleteField onSelect={onNovaPoshtaCourierStreetSelect}
                                                                   disabled={disabled}
                                                                   settlementRef={novaPoshtaCourierCityRef}
                                                                   street={novaPoshtaCourierStreet}/>
                                        </Grid>

                                        <Grid item xs={6}>
                                          <CustomTextField name="novaPoshtaCourierHouse" label="Будинок" required={true}
                                                           disabled={disabled}
                                                           fullWidth/>
                                        </Grid>

                                        <Grid item xs={6}>
                                          <CustomTextField name="novaPoshtaCourierFlat" label="Квартира" fullWidth
                                                           disabled={disabled}/>
                                        </Grid>
                                      </Grid>}

                                    {option.value === 'UKRPOSHTA' &&
                                      <Grid container spacing={2} mt={0}
                                            display={deliveryOption === option.value ? 'flex' : 'none'}>
                                        <Grid item xs={12} md={6}>
                                          <CustomTextField name="region" label="Область" required={true} fullWidth
                                                           disabled={disabled}/>
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                          <CustomTextField name="district" label="Район" fullWidth disabled={disabled}/>
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                          <CustomTextField name="city" label="Місто" required={true} fullWidth
                                                           disabled={disabled}/>
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                          <CustomTextField name="warehouse" label="Відділення (індекс)" required={true}
                                                           disabled={disabled}
                                                           fullWidth/>
                                        </Grid>
                                      </Grid>}

                                    {option.value === 'SELF_PICKUP' &&
                                      <Box mt={1} justifyContent="center"
                                           display={deliveryOption === option.value ? 'flex' : 'none'}>
                                        Самовивіз за адресою: м. Харків, проспект Героїв Харкова, 162 (лише після
                                        дзвінка-підтвердження).
                                      </Box>}
                                </DeliveryBoxOption>
                            ))}
                        </Box>
                    </RadioGroup>
                </Grid>
            </Grid>
        </FormContainer>
    );
}
