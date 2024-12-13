import { Box, Button, Grid, RadioGroup } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { useBooksByIds, useUpdateBookCountInBasket } from '@/lib/graphql/queries/book/hook';
import { priceStyles, primaryLightColor, styleVariables } from '@/constants/styles-variables';
import Loading from '@/components/loading';
import ErrorNotification from '@/components/error-notification';
import { useAuth } from '@/components/auth-context';
import { styled } from '@mui/material/styles';
import {
    isAdmin,
    isNovaPostSelected,
    isUkrPoshtaSelected,
    onCopyOrderClick,
    renderOrderNumber,
    renderPrice
} from '@/utils/utils';
import { useRouter } from 'next/router';
import { FormContainer, useForm } from 'react-hook-form-mui';
import CustomTextField from '@/components/form-fields/custom-text-field';
import { useDeliveries } from '@/lib/graphql/queries/delivery/hook';
import { useCreateOrder } from '@/lib/graphql/queries/order/hook';
import BasketBookItem from '@/components/basket-book-item';
import DeliveryRadioOption from '@/components/form-fields/delivery-radio-option';
import Head from 'next/head';
import IconWithText from '@/components/icon-with-text';
import {
    useGroupDiscountsByIds,
    useUpdateGroupDiscountCountInBasket
} from '@/lib/graphql/queries/group-discounts/hook';
import GroupDiscountBox from '@/components/group-discount-box';

const TitleBoxStyled = styled(Box)(({ theme }) => ({
    ...styleVariables.bigTitleFontSize(theme),
    borderBottom: `1px solid ${primaryLightColor}`,
    textAlign: 'center'
}));

export default function Basket() {
    const router = useRouter();
    const { user, setUser, setGroupDiscountInBasket } = useAuth();
    const formContext = useForm({
        defaultValues: {
            userId: user?.id,
            email: user?.email,
            lastName: isAdmin(user) ? '' : user?.lastName,
            firstName: isAdmin(user) ? '' : user?.firstName,
            instagramUsername: isAdmin(user) ? '' : user?.instagramUsername,
            phoneNumber: isAdmin(user) ? '' : user?.phoneNumber,
            region: isAdmin(user) ? '' : user?.region,
            city: isAdmin(user) ? '' : user?.city,
            district: isAdmin(user) ? '' : user?.district,
            postcode: isAdmin(user) ? '' : user?.postcode,
            novaPostOffice: isAdmin(user) ? '' : user?.novaPostOffice,
            deliveryId: user?.preferredDeliveryId,
            comment: null
        }
    });
    const {
        deliveryId,
        phoneNumber,
        firstName,
        lastName,
        region,
        city,
        postcode,
        novaPostOffice
    } = formContext.watch();
    const { loading, error, items } = useBooksByIds(user?.basketItems?.map(({ bookId }) => bookId));
    const {
        loading: loadingGroups,
        error: errorGroups,
        items: groups
    } = useGroupDiscountsByIds(user?.basketGroupDiscounts?.map(({ groupDiscountId }) => groupDiscountId));
    const [countFields, setCountFields] = useState<Map<string, number>>(new Map());
    const [groupCountFields, setGroupCountFields] = useState<Map<string, number>>(new Map());
    const [finalFullSum, setFinalFullSum] = useState<number>();
    const [finalSumWithDiscounts, setFinalSumWithDiscounts] = useState<number>();
    const { updatingBook, updatingBookError, updateBook } = useUpdateBookCountInBasket();
    const { updatingGroup, updatingGroupError, updateGroup } = useUpdateGroupDiscountCountInBasket();
    const { items: deliveries, loading: loadingDeliveries } = useDeliveries();
    const [submitDisabled, setSubmitDisabled] = useState<boolean>(false);
    const [orderNumber, setOrderNumber] = useState<string>();
    const { create, creating, creatingError } = useCreateOrder();

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

        if (!region) {
            if (formContext.formState.touchedFields.region) {
                formContext.setError('region', { message: 'Область обов\'язкова' });
            }
            invalid = true;
        } else {
            formContext.clearErrors('region');
        }

        if (!city) {
            if (formContext.formState.touchedFields.city) {
                formContext.setError('city', { message: 'Місто обов\'язкове' });
            }
            invalid = true;
        } else {
            formContext.clearErrors('city');
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

        if (!deliveryId) {
            invalid = true;
        } else if (isNovaPostSelected(deliveryId) && !novaPostOffice) {
            if (formContext.formState.touchedFields.novaPostOffice) {
                formContext.setError('novaPostOffice', { message: '№ відділення/поштомата обов\'язкове' });
            }
            formContext.clearErrors('postcode');
            formContext.setValue('postcode', null);
            invalid = true;
        } else if (isUkrPoshtaSelected(deliveryId) && !postcode) {
            if (formContext.formState.touchedFields.postcode) {
                formContext.setError('postcode', { message: 'Індекс обов\'язковий' });
            }
            formContext.clearErrors('novaPostOffice');
            formContext.setValue('novaPostOffice', null);
            invalid = true;
        } else {
            formContext.clearErrors('postcode');
        }

        setSubmitDisabled(invalid);
    }, [deliveryId, phoneNumber, firstName, lastName, region, city, postcode, novaPostOffice, formContext]);

    useEffect(() => {
        if (!!items?.length || !!groups?.length) {
            const map = new Map();
            const groupMap = new Map();
            let finalSum = 0;
            let finalSumWithDiscounts = 0;

            items.forEach(({ id, price, discount }) => {
                const count = user.basketItems.find(({ bookId }) => bookId === id).count;

                map.set(id, count);
                finalSum += count * price;
                finalSumWithDiscounts += count * price * (100 - discount) / 100;
            });
            groups.forEach(({ id, books, discount }) => {
                books.forEach(({ price }) => {
                    const count = user.basketGroupDiscounts
                        .find(({ groupDiscountId }) => groupDiscountId === id).count;

                    groupMap.set(id, count);
                    finalSum += count * price;
                    finalSumWithDiscounts += count * price * (100 - discount) / 100;
                })
            });
            setCountFields(map);
            setGroupCountFields(groupMap);
            setFinalFullSum(finalSum);
            setFinalSumWithDiscounts(finalSumWithDiscounts);
        }
    }, [groups, items, user]);

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
            const { novaPostOffice, postcode, ...values } = formContext.getValues();

            create({
                ...values,
                postcode: postcode || null,
                novaPostOffice: novaPostOffice || null,
                books: [
                    ...items.map(book => ({
                        bookId: book.id,
                        count: countFields.get(book.id),
                        price: book.price,
                        discount: book.discount
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

    return (
        <>
            <Head>
                <title>Кошик{(user?.basketItems?.length || user?.basketGroupDiscounts.length) ? '' : ' (пустий)'}</title>
            </Head>

            <Loading show={loading || updatingBook || loadingDeliveries || creating || loadingGroups || updatingGroup}/>

            <TitleBoxStyled pb={1} m={1}>Кошик</TitleBoxStyled>

            <Box display="flex" flexDirection="column" gap={1} px={{ xs: 1 }}>
                {items.map((book, index) => (
                    <Box key={index}>
                        <BasketBookItem book={book} editable={true} count={countFields.get(book.id)}
                                        onCountChange={(count: number) => onChangeCountInBasket(book.id, count)}/>
                    </Box>
                ))}

                {!!groups?.length && (groups || []).map((group, index) => (
                    <Box key={index} mb={1}>
                        <GroupDiscountBox books={group.books} count={groupCountFields.get(group.id)}
                                          discount={group.discount}
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
                    <CustomTextField name="phoneNumber" required label="Номер телефону" fullWidth/>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <CustomTextField name="email" required label="Ел. адреса" disabled fullWidth/>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <CustomTextField name="instagramUsername"
                                     label="Нікнейм в інстаграм для зв'язку"
                                     fullWidth/>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={styleVariables.sectionTitle}>Спосіб доставки</Box>

                    <RadioGroup defaultValue={user?.preferredDeliveryId}
                                onChange={(_, value) => formContext.setValue('deliveryId', value)}>
                      <Grid container spacing={2}>
                          {deliveries.map((delivery, index) => (
                              <Grid key={index} item xs={12} sm={6} pl={2}>
                                  <Box p={1}>
                                      <DeliveryRadioOption option={delivery}/>
                                  </Box>
                              </Grid>
                          ))}
                      </Grid>
                    </RadioGroup>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={styleVariables.sectionTitle}>Адреса</Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <CustomTextField name="region" required label="Область" fullWidth/>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <CustomTextField name="district" label="Район" fullWidth/>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <CustomTextField name="city" required label="Місто" fullWidth/>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <CustomTextField name="novaPostOffice"
                                     required={isNovaPostSelected(deliveryId)}
                                     label="№ відділення/поштомату"
                                     type="number"
                                     fullWidth/>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <CustomTextField name="postcode"
                                     required={isUkrPoshtaSelected(deliveryId)}
                                     type="number"
                                     label="Індекс"
                                     fullWidth/>
                  </Grid>

                  <Grid item xs={12}>
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
                          disabled={submitDisabled || items.some(i => !i.numberInStock) || groups.some(group => group.books.some(b => !b.numberInStock))}
                          onClick={onSubmit}>
                    Підтвердити замовлення
                  </Button>
                </Grid>
              </Grid>
            </>}
        </>
    );
}
