import { Box, Button, FormControlLabel, Grid, Radio, RadioGroup } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { MuiTelInput } from 'mui-tel-input';
import { styled } from '@mui/material/styles';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FormContainer, useForm } from 'react-hook-form-mui';

import { useBooksByIds, useUpdateBookCountInBasket } from '@/lib/graphql/queries/book/hook';
import { borderRadius, priceStyles, primaryLightColor, styleVariables } from '@/constants/styles-variables';
import Loading from '@/components/loading';
import ErrorNotification from '@/components/error-notification';
import { useAuth } from '@/components/auth-context';
import {
    isAdmin,
    isNovaPostSelected,
    isSelfPickup,
    isUkrPoshtaSelected,
    onCopyOrderClick,
    renderOrderNumber,
    renderPrice,
    validatePhoneNumber
} from '@/utils/utils';
import CustomTextField from '@/components/form-fields/custom-text-field';
import { useCreateOrder } from '@/lib/graphql/queries/order/hook';
import BasketBookItem from '@/components/basket-book-item';
import IconWithText from '@/components/icon-with-text';
import {
    useGroupDiscountsByIds,
    useUpdateGroupDiscountCountInBasket
} from '@/lib/graphql/queries/group-discounts/hook';
import GroupDiscountBox from '@/components/group-discount-box';
import { DELIVERIES } from '@/constants/options';
import SettlementAutocompleteField from '@/components/form-fields/settlement-autocomplete-field';
import WarehouseAutocompleteField from '@/components/form-fields/warehouses-autocomplete-field';
import { NovaPoshtaSettlementEntity, NovaPoshtaStreetEntity, NovaPoshtaWarehouseEntity } from '@/lib/data/types';
import StreetAutocompleteField from '@/components/form-fields/street-autocomplete-field';

const TitleBoxStyled = styled(Box)(({ theme }) => ({
    ...styleVariables.bigTitleFontSize(theme),
    borderBottom: `1px solid ${primaryLightColor}`,
    textAlign: 'center'
}));

interface IForm {
    userId: string,
    email: string,
    lastName: string,
    firstName: string,
    instagramUsername: string,
    phoneNumber: string,
    comment: string
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

export default function Basket() {
    const router = useRouter();
    const { user, setUser, setGroupDiscountInBasket } = useAuth();
    const formContext = useForm<IForm>({
        defaultValues: {
            userId: user?.id,
            email: user?.email,
            lastName: isAdmin(user) ? '' : user?.lastName,
            firstName: isAdmin(user) ? '' : user?.firstName,
            instagramUsername: isAdmin(user) ? '' : user?.instagramUsername,
            phoneNumber: isAdmin(user) ? '' : user?.phoneNumber,
            comment: null
        }
    });
    const { phoneNumber, firstName, lastName } = formContext.watch();
    const { loading, error, items } = useBooksByIds(user?.basketItems?.map(({ bookId }) => bookId));
    const {
        loading: loadingGroups,
        error: errorGroups,
        items: groups
    } = useGroupDiscountsByIds(user?.basketGroupDiscounts?.map(({ groupDiscountId }) => groupDiscountId));
    const [countFields, setCountFields] = useState<Map<string, number>>(new Map());
    const [discountFields, setDiscountFields] = useState<Map<string, number>>(new Map());
    const [groupCountFields, setGroupCountFields] = useState<Map<string, number>>(new Map());
    const [finalFullSum, setFinalFullSum] = useState<number>();
    const [finalSumWithDiscounts, setFinalSumWithDiscounts] = useState<number>();
    const { updatingBook, updatingBookError, updateBook } = useUpdateBookCountInBasket();
    const { updatingGroup, updatingGroupError, updateGroup } = useUpdateGroupDiscountCountInBasket();
    const [submitDisabled, setSubmitDisabled] = useState<boolean>(false);
    const [orderNumber, setOrderNumber] = useState<string>();
    const { create, creating, creatingError } = useCreateOrder();
    const addressFormContext = useForm({
        defaultValues: {
            isCourier: false,
            deliveryId: DELIVERIES.NOVA_POSHTA,
            novaPoshtaWarehouseCityRef: '',
            novaPoshtaWarehouseCity: user?.novaPoshtaWarehouseAddress?.city,
            novaPoshtaWarehouseRegion: user?.novaPoshtaWarehouseAddress?.region,
            novaPoshtaWarehouseDistrict: user?.novaPoshtaWarehouseAddress?.district,
            novaPoshtaWarehouse: user?.novaPoshtaWarehouseAddress?.warehouse,
            novaPoshtaCourierCity: user?.novaPoshtaCourierAddress?.city,
            novaPoshtaCourierRegion: user?.novaPoshtaCourierAddress?.region,
            novaPoshtaCourierDistrict: user?.novaPoshtaCourierAddress?.district,
            novaPoshtaCourierStreet: user?.novaPoshtaCourierAddress?.street,
            novaPoshtaCourierHouse: user?.novaPoshtaCourierAddress?.house,
            novaPoshtaCourierFlat: user?.novaPoshtaCourierAddress?.flat,
            novaPoshtaCourierCityRef: '',
            city: user?.ukrPoshtaWarehouseAddress?.city,
            district: user?.ukrPoshtaWarehouseAddress?.district,
            region: user?.ukrPoshtaWarehouseAddress?.region,
            warehouse: user?.ukrPoshtaWarehouseAddress?.warehouse
        }
    });
    const {
        city,
        region,
        warehouse,
        novaPoshtaWarehouseCity,
        novaPoshtaWarehouseRegion,
        novaPoshtaWarehouseDistrict,
        novaPoshtaWarehouseCityRef,
        novaPoshtaWarehouse,
        deliveryId,
        isCourier,
        novaPoshtaCourierCity,
        novaPoshtaCourierStreet,
        novaPoshtaCourierHouse,
        novaPoshtaCourierCityRef,
        novaPoshtaCourierDistrict,
        novaPoshtaCourierRegion
    } = addressFormContext.watch();

    useEffect(() => {
        let invalid = false;

        if (!phoneNumber) {
            if (formContext.formState.touchedFields.phoneNumber) {
                formContext.setError('phoneNumber', { message: 'Номер телефону обов\'язковий' });
            }
            invalid = true;
        } else {
            formContext.clearErrors('phoneNumber');
        }

        if (!firstName) {
            if (formContext.formState.touchedFields.firstName) {
                formContext.setError('firstName', { message: 'Ім\'я обов\'язкове' });
            }
            invalid = true;
        } else {
            formContext.clearErrors('firstName');
        }

        if (!lastName) {
            if (formContext.formState.touchedFields.lastName) {
                formContext.setError('lastName', { message: 'Прізвище обов\'язкове' });
            }
            invalid = true;
        } else {
            formContext.clearErrors('lastName');
        }

        setSubmitDisabled(invalid);
    }, [phoneNumber, firstName, lastName, formContext]);

    useEffect(() => {
        if (!!items?.length || !!groups?.length) {
            const map = new Map();
            const discountMap = new Map();
            const groupMap = new Map();

            items.forEach(({ id, discount }) => {
                const count = user.basketItems.find(({ bookId }) => bookId === id).count;

                map.set(id, count);
                discountMap.set(id, discount || 0);
            });
            groups.forEach(({ id, books }) => {
                books.forEach(() => {
                    const count = user.basketGroupDiscounts
                        .find(({ groupDiscountId }) => groupDiscountId === id).count;

                    groupMap.set(id, count);
                })
            });
            setDiscountFields(discountMap);
            setCountFields(map);
            setGroupCountFields(groupMap);
            recalculateSum(discountMap);
        }
    }, [groups, items, user]);

    function recalculateSum(discountMap: Map<string, number>) {
        let finalSum = 0;
        let sumWithDiscounts = 0;

        items.forEach(({ id, price }) => {
            const count = user.basketItems.find(({ bookId }) => bookId === id).count;

            finalSum += count * price;
            sumWithDiscounts += count * price * (100 - discountMap.get(id)) / 100;
        });
        groups.forEach(({ id, books, discount }) => {
            books.forEach(({ price }) => {
                const count = user.basketGroupDiscounts
                    .find(({ groupDiscountId }) => groupDiscountId === id).count;

                finalSum += count * price;
                sumWithDiscounts += count * price * (100 - discount) / 100;
            })
        });
        setFinalFullSum(finalSum);
        setFinalSumWithDiscounts(sumWithDiscounts);
    }

    function onChangeCountInBasket(bookId: string, count: number) {
        const newCount = countFields.get(bookId) + count;

        updateBook(bookId, newCount)
            .then(items => setUser({ ...user, basketItems: items }))
            .catch(() => {
            });
    }

    function onChangeCountGroupInBasket(groupId: string, count: number) {
        const newCount = groupCountFields.get(groupId) + count;

        updateGroup(groupId, newCount)
            .then(items => setUser({ ...user, basketGroupDiscounts: items }))
            .catch(() => {
            });
    }

    function onDeleteGroupDiscount(groupDiscountId: string) {
        setGroupDiscountInBasket(groupDiscountId);
    }

    function onSubmit() {
        if (!submitDisabled) {
            const mainInfo = formContext.getValues();
            const address = addressFormContext.getValues();
            let city = null;
            let region = null;
            let district = null;
            let street = null;
            let house = null;
            let flat = null;
            let warehouse = null;

            if (isNovaPostSelected(deliveryId)) {
                if (isCourier) {
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
            } else if (isUkrPoshtaSelected(deliveryId)) {
                city = address.city;
                region = address.region;
                district = address.district;
                warehouse = address.warehouse;
            }
            create({
                ...mainInfo,
                deliveryId: address.deliveryId,
                city,
                region,
                district,
                street,
                flat,
                house,
                warehouse,
                books: [
                    ...items.map(book => ({
                        bookId: book.id,
                        count: countFields.get(book.id),
                        price: book.price,
                        discount: discountFields.get(book.id)
                    })),
                    ...groups.reduce((arr, group) => [...arr, ...group.books.map(book => ({
                        bookId: book.id,
                        count: groupCountFields.get(group.id),
                        price: book.price,
                        discount: group.discount,
                        groupDiscountId: group.id
                    }))], [])
                ]
            })
                .then(order => {
                    setOrderNumber(renderOrderNumber(order.orderNumber));
                    setUser({ ...user, basketItems: [], basketGroupDiscounts: [] });
                })
                .catch(() => {
                });
        }
    }

    function onDiscountChange(bookId: string, discount: number) {
        discountFields.set(bookId, discount);
        recalculateSum(discountFields);
    }

    function handlePhoneNumberChange(value: string) {
        validatePhoneNumber(formContext, value);
    }

    function onDeliveryOptionChange(value: string) {
        switch (value) {
            case 'UKRPOSHTA':
                addressFormContext.setValue('deliveryId', DELIVERIES.UKRPOSHTA);
                addressFormContext.setValue('isCourier', false);
                break;
            case 'NOVA_POSHTA_WAREHOUSE':
                addressFormContext.setValue('deliveryId', DELIVERIES.NOVA_POSHTA);
                addressFormContext.setValue('isCourier', false);
                break;
            case 'NOVA_POSHTA_COURIER':
                addressFormContext.setValue('deliveryId', DELIVERIES.NOVA_POSHTA);
                addressFormContext.setValue('isCourier', true);
                break;
            case 'SELF_PICKUP':
                addressFormContext.setValue('deliveryId', DELIVERIES.SELF_PICKUP);
                addressFormContext.setValue('isCourier', false);
        }
    }

    function onNovaPoshtaWarehouseSelect(val: NovaPoshtaWarehouseEntity, refreshData = false) {
        if (refreshData) {
            addressFormContext.setValue('novaPoshtaWarehouse', val?.number);
        }
    }

    function onNovaPoshtaSettlementSelect(val: NovaPoshtaSettlementEntity, refreshData = false) {
        if (refreshData) {
            addressFormContext.setValue('novaPoshtaWarehouseCity', val?.city || '');
            addressFormContext.setValue('novaPoshtaWarehouseRegion', val?.region || '');
            addressFormContext.setValue('novaPoshtaWarehouseDistrict', val?.district || '');
            if (!val) {
                addressFormContext.setValue('novaPoshtaWarehouse', null);
            }
        }
        addressFormContext.setValue('novaPoshtaWarehouseCityRef', val?.ref || '');
    }

    function onNovaPoshtaCourierCitySelect(val: NovaPoshtaSettlementEntity, refreshData = false) {
        if (refreshData) {
            addressFormContext.setValue('novaPoshtaCourierCity', val?.city || '');
            addressFormContext.setValue('novaPoshtaCourierRegion', val?.region || '');
            addressFormContext.setValue('novaPoshtaCourierDistrict', val?.district || '');
            if (!val) {
                addressFormContext.setValue('novaPoshtaCourierStreet', null);
            }
        }
        addressFormContext.setValue('novaPoshtaCourierCityRef', val?.ref || '');
    }

    function onNovaPoshtaCourierStreetSelect(val: NovaPoshtaStreetEntity, refreshData = false) {
        if (refreshData) {
            addressFormContext.setValue('novaPoshtaCourierStreet', val?.description);
        }
    }

    function isSubmitDisabled() {
        if (!firstName || !lastName || !phoneNumber || !deliveryId ||
            items.some(i => !i.numberInStock) || groups.some(({ books }) => books.some(b => !b.numberInStock))) {
            return true;
        }

        if (isNovaPostSelected(deliveryId)) {
            if (isCourier) {
                return !novaPoshtaCourierCity || !novaPoshtaCourierRegion ||
                    !novaPoshtaCourierStreet || !novaPoshtaCourierHouse;
            } else {
                return !novaPoshtaWarehouseCity || !novaPoshtaWarehouseRegion || !novaPoshtaWarehouse;
            }
        } else if (isUkrPoshtaSelected(deliveryId)) {
            return !city || !region || !warehouse;
        }
        return false;
    }

    return (
        <>
            <Head>
                <title>Кошик{(user?.basketItems?.length || user?.basketGroupDiscounts.length) ? '' : ' (пустий)'}</title>
            </Head>

            <Loading show={loading || updatingBook || creating || loadingGroups || updatingGroup}/>

            <TitleBoxStyled pb={1} m={1}>Кошик</TitleBoxStyled>

            <Box display="flex" flexDirection="column" gap={1} px={{ xs: 1 }}>
                {items.map((book, index) => (
                    <Box key={index}>
                        <BasketBookItem book={book} editable={true} count={countFields.get(book.id)}
                                        onCountChange={(count: number) => onChangeCountInBasket(book.id, count)}
                                        discount={discountFields.get(book.id)}
                                        onDiscountChange={isAdmin(user) ? (discount => onDiscountChange(book.id, discount)) : null}/>
                    </Box>
                ))}

                {!!groups?.length && (groups || []).map((group, index) => (
                    <Box key={index} mb={1}>
                        <GroupDiscountBox books={group.books} count={groupCountFields.get(group.id)}
                                          discount={group.discount}
                                          editable={true}
                                          onDeleteGroupClick={() => onDeleteGroupDiscount(group.id)}
                                          onCountChange={(count: number) => onChangeCountGroupInBasket(group.id, count)}/>
                    </Box>
                ))}

                <Grid container display="flex" alignItems="center" spacing={1}>
                    {!loading && (!!items?.length || !!groups.length ?
                        <>
                            <Grid item xs={7} sm={8} md={9} display="flex" justifyContent="flex-end"
                                  textAlign="end">
                                Сума замовлення без знижки:
                            </Grid>
                            <Grid item xs={5} sm={4} md={3} textAlign="center">
                                {renderPrice(finalFullSum)}
                            </Grid>

                            <Grid item xs={12}>
                                <Box borderTop={1} borderColor={primaryLightColor} width="100%"></Box>
                            </Grid>

                            <Grid item xs={7} sm={8} md={9} display="flex" justifyContent="flex-end"
                                  textAlign="end">
                                Знижка:
                            </Grid>
                            <Grid item xs={5} sm={4} md={3} textAlign="center">
                                {renderPrice(finalFullSum - finalSumWithDiscounts)}
                            </Grid>

                            <Grid item xs={12}>
                                <Box borderTop={1} borderColor={primaryLightColor} width="100%"></Box>
                            </Grid>

                            <Grid item xs={7} sm={8} md={9} display="flex" justifyContent="flex-end"
                                  sx={styleVariables.titleFontSize} textAlign="end">
                                <b>Кінцева сума замовлення:</b>
                            </Grid>
                            <Grid item xs={5} sm={4} md={3} display="flex" justifyContent="center">
                                <Box sx={priceStyles}
                                     textAlign="center">{renderPrice(finalSumWithDiscounts)}</Box>
                            </Grid>

                            <Grid item xs={12}>
                                <Box borderTop={1} borderColor={primaryLightColor} width="100%"></Box>
                            </Grid>
                        </> : <Grid item xs={12} display="flex" alignItems="center" flexDirection="column">
                            {orderNumber ?
                                <>
                                    <IconWithText imageLink="/completed_order.png" text="Дякуємо!"/>
                                    <Box display="flex">
                                        Ваше замовлення
                                        <Box mx={1} sx={styleVariables.orderNumberStyles}>№{orderNumber}</Box>
                                        оформлене!
                                    </Box>

                                    <Box my={2}>Чекайте повідомлення від менеджера.</Box>

                                    <Button variant="outlined" onClick={() => router.push('/')}>
                                        На головну сторінку
                                    </Button>
                                </> :
                                <>
                                    <IconWithText imageLink="/empty_basket.png" text="Кошик пустий!"/>
                                    <Button variant="outlined" onClick={() => router.push('/')}>
                                        До вибору книг
                                    </Button>
                                </>}
                        </Grid>)
                    }
                </Grid>
            </Box>

            {error && <ErrorNotification error={error}/>}
            {updatingBookError && <ErrorNotification error={updatingBookError}/>}
            {updatingGroupError && <ErrorNotification error={updatingGroupError}/>}
            {errorGroups && <ErrorNotification error={errorGroups}/>}

            {(!!items?.length || !!groups?.length) && <>
              <FormContainer formContext={formContext}>
                <Grid container spacing={2} px={1} mt={1}>
                  <Grid item xs={12}>
                    <Box sx={styleVariables.sectionTitle}>Основна інформація</Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <CustomTextField name="lastName" required label="Прізвище" fullWidth/>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <CustomTextField name="firstName" required label="Ім'я" fullWidth/>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <MuiTelInput value={phoneNumber}
                                 required={true}
                                 defaultCountry="UA"
                                 onChange={handlePhoneNumberChange}
                                 label="Номер телефону"
                                 error={!!formContext.formState.errors.phoneNumber}
                                 fullWidth/>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <CustomTextField name="email" required label="Ел. адреса" disabled fullWidth/>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <CustomTextField name="instagramUsername"
                                     label="Нікнейм в інстаграм для зв'язку"
                                     fullWidth/>
                  </Grid>
                </Grid>
              </FormContainer>

              <FormContainer formContext={addressFormContext}>
                <Grid container spacing={2} px={1} mt={1}>
                  <Grid item xs={12}>
                    <Box sx={styleVariables.sectionTitle}>Спосіб доставки</Box>
                  </Grid>

                  <Grid item xs={12}>
                    <RadioGroup defaultValue={deliveryOptions[0].value}
                                onChange={(_, value: string) => onDeliveryOptionChange(value)}>
                      <Box display="flex" flexDirection="column" gap={1}>
                          {deliveryOptions.map((option, index) => (
                              <DeliveryBoxOption p={1} key={index}>
                                  <FormControlLabel value={option.value}
                                                    control={<Radio/>}
                                                    label={option.title}/>

                                  {option.value === 'NOVA_POSHTA_WAREHOUSE' &&
                                    <Grid container spacing={2} mt={0}
                                          display={isNovaPostSelected(deliveryId) && !isCourier ? 'flex' : 'none'}>
                                      <Grid item xs={12} sm={6}>
                                        <SettlementAutocompleteField onSelect={onNovaPoshtaSettlementSelect}
                                                                     city={novaPoshtaWarehouseCity}
                                                                     region={novaPoshtaWarehouseRegion}
                                                                     district={novaPoshtaWarehouseDistrict}/>
                                      </Grid>

                                      <Grid item xs={12} sm={6}>
                                        <WarehouseAutocompleteField settlementRef={novaPoshtaWarehouseCityRef}
                                                                    warehouse={novaPoshtaWarehouse}
                                                                    onSelect={onNovaPoshtaWarehouseSelect}/>
                                      </Grid>
                                    </Grid>}

                                  {option.value === 'NOVA_POSHTA_COURIER' &&
                                    <Grid container spacing={2} mt={0}
                                          display={isNovaPostSelected(deliveryId) && isCourier ? 'flex' : 'none'}>
                                      <Grid item xs={12} sm={6}>
                                        <SettlementAutocompleteField onSelect={onNovaPoshtaCourierCitySelect}
                                                                     city={novaPoshtaCourierCity}
                                                                     region={novaPoshtaCourierRegion}
                                                                     district={novaPoshtaCourierDistrict}/>
                                      </Grid>

                                      <Grid item xs={12} sm={6}>
                                        <StreetAutocompleteField onSelect={onNovaPoshtaCourierStreetSelect}
                                                                 settlementRef={novaPoshtaCourierCityRef}
                                                                 street={novaPoshtaCourierStreet}/>
                                      </Grid>

                                      <Grid item xs={6}>
                                        <CustomTextField name="novaPoshtaCourierHouse" label="Будинок" required={true}
                                                         fullWidth/>
                                      </Grid>

                                      <Grid item xs={6}>
                                        <CustomTextField name="novaPoshtaCourierFlat" label="Квартира" fullWidth/>
                                      </Grid>
                                    </Grid>}

                                  {option.value === 'UKRPOSHTA' &&
                                    <Grid container spacing={2} mt={0}
                                          display={isUkrPoshtaSelected(deliveryId) ? 'flex' : 'none'}>
                                      <Grid item xs={12} md={6}>
                                        <CustomTextField name="region" label="Область" required={true} fullWidth/>
                                      </Grid>

                                      <Grid item xs={12} md={6}>
                                        <CustomTextField name="district" label="Район" fullWidth/>
                                      </Grid>

                                      <Grid item xs={12} md={6}>
                                        <CustomTextField name="city" label="Місто" required={true} fullWidth/>
                                      </Grid>

                                      <Grid item xs={12} md={6}>
                                        <CustomTextField name="warehouse" label="Відділення (індекс)" required={true}
                                                         fullWidth/>
                                      </Grid>
                                    </Grid>}

                                  {option.value === 'SELF_PICKUP' &&
                                    <Box mt={1} justifyContent="center"
                                         display={isSelfPickup(deliveryId) ? 'flex' : 'none'}>
                                      Самовивіз за адресою: м. Харків, проспект Героїв Харкова, 162 (лише після дзвінка-підтвердження).
                                    </Box>}
                              </DeliveryBoxOption>
                          ))}
                      </Box>
                    </RadioGroup>
                  </Grid>

                  <Grid item xs={12} mt={2}>
                    <CustomTextField name="comment" label="Коментар" multiline fullWidth/>
                  </Grid>
                </Grid>
              </FormContainer>

                {creatingError && <ErrorNotification error={creatingError}/>}

              <Grid container spacing={2} mt={1} mb={3} p={1}>
                <Grid item xs={12} display="flex" flexWrap="wrap"
                      gap={1} justifyContent={{ xs: 'center', md: 'flex-end' }} alignItems="center">
                    {isAdmin(user) && (!!items?.length || !!groups?.length) &&
                      <Button variant="outlined" onClick={() => onCopyOrderClick(items.map(book => ({
                          book,
                          price: book.price,
                          count: countFields.get(book.id)
                      })), finalFullSum, finalSumWithDiscounts)}>
                        Скопіювати зміст замовлення
                      </Button>}
                  <Button type="submit" variant="contained"
                          disabled={isSubmitDisabled()}
                          onClick={onSubmit}>
                    Підтвердити замовлення
                  </Button>
                </Grid>
              </Grid>
            </>}
        </>
    );
}
