import { Box, Button, FormControlLabel, Grid, IconButton, Radio, RadioGroup } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import { useBooksByIds, useUpdateBookCountInBasket } from '@/lib/graphql/queries/book/hook';
import { borderRadius, boxPadding, primaryLightColor, styleVariables } from '@/constants/styles-variables';
import Loading from '@/components/loading';
import ErrorNotification from '@/components/error-notification';
import { useAuth } from '@/components/auth-context';
import { styled } from '@mui/material/styles';
import CustomImage from '@/components/custom-image';
import { BookEntity } from '@/lib/data/types';
import {
    getParamsQueryString,
    isAdmin,
    isNovaPostSelected,
    isUrkPoshtaSelected,
    renderOrderNumber,
    renderPrice
} from '@/utils/utils';
import CustomLink from '@/components/custom-link';
import { useRouter } from 'next/router';
import { FormContainer, useForm } from 'react-hook-form-mui';
import CustomTextField from '@/components/form-fields/custom-text-field';
import { useDeliveries } from '@/lib/graphql/queries/delivery/hook';
import { useCreateOrder } from '@/lib/graphql/queries/order/hook';

const StyledImageBox = styled(Box)(() => ({
    width: '150px',
    height: '150px'
}));

const TitleBoxStyled = styled(Box)(({ theme }) => ({
    ...styleVariables.bigTitleFontSize(theme),
    borderBottom: `1px solid ${primaryLightColor}`,
    textAlign: 'center'
}));

const priceStyles = (theme) => ({
    color: theme.palette.primary.main,
    fontSize: styleVariables.bigTitleFontSize(theme),
    borderRadius,
    padding: boxPadding,
    border: `1px solid ${primaryLightColor}`
});

const basketImageBoxStyles = {
    width: '100px',
    height: '100px',
    opacity: 0.5
};

export default function Basket() {
    const router = useRouter();
    const { user, setUser, setBookInBasket } = useAuth();
    const formContext = useForm({
        defaultValues: {
            userId: user?.id,
            email: user?.email,
            lastName: user?.lastName,
            firstName: user?.firstName,
            instagramUsername: user?.instagramUsername,
            phoneNumber: user?.phoneNumber,
            region: user?.region,
            city: user?.city,
            district: user?.district,
            postcode: user?.postcode,
            novaPostOffice: user?.novaPostOffice,
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
    const { loading, error, items } = useBooksByIds(user?.basketItems.map(({ bookId }) => bookId));
    const [countFields, setCountFields] = useState<Map<string, number>>(new Map());
    const [finalFullSum, setFinalFullSum] = useState<number>();
    const [finalSumWithDiscounts, setFinalSumWithDiscounts] = useState<number>();
    const { updating, updatingError, update } = useUpdateBookCountInBasket();
    const { items: deliveries, loading: loadingDeliveries } = useDeliveries();
    const [submitDisabled, setSubmitDisabled] = useState<boolean>(false);
    const [orderNumber, setOrderNumber] = useState<string>();
    const { create, creating, creatingError } = useCreateOrder();

    useEffect(() => {
        let invalid = false;

        if (!phoneNumber) {
            formContext.setError('phoneNumber', { message: 'Номер телефону обов\'язковий' });
            setSubmitDisabled(true);
            invalid = true;
        } else {
            formContext.clearErrors('phoneNumber');
        }

        if (!region) {
            formContext.setError('region', { message: 'Область обов\'язкова' });
            setSubmitDisabled(true);
            invalid = true;
        } else {
            formContext.clearErrors('region');
        }

        if (!city) {
            formContext.setError('city', { message: 'Місто обов\'язкове' });
            setSubmitDisabled(true);
            invalid = true;
        } else {
            formContext.clearErrors('city');
        }

        if (!firstName) {
            formContext.setError('firstName', { message: 'Ім\'я обов\'язкове' });
            setSubmitDisabled(true);
            invalid = true;
        } else {
            formContext.clearErrors('firstName');
        }

        if (!lastName) {
            formContext.setError('lastName', { message: 'Прізвище обов\'язкове' });
            setSubmitDisabled(true);
            invalid = true;
        } else {
            formContext.clearErrors('lastName');
        }

        if (isNovaPostSelected(deliveryId) && !novaPostOffice) {
            formContext.setError('novaPostOffice', { message: '№ відділення/поштомата обов\'язкове' });
            formContext.clearErrors('postcode');
            setSubmitDisabled(true);
            invalid = true;
        } else if (isUrkPoshtaSelected(deliveryId) && !postcode) {
            formContext.setError('postcode', { message: 'Індекс обов\'язковий' });
            formContext.clearErrors('novaPostOffice');
            setSubmitDisabled(true);
            invalid = true;
        } else {
            formContext.clearErrors('novaPostOffice');
            formContext.clearErrors('postcode');
        }

        if (!invalid) {
            setSubmitDisabled(false);
        }
    }, [deliveryId, phoneNumber, firstName, lastName, region, city, postcode, novaPostOffice]);

    useEffect(() => {
        if (!!items?.length) {
            const map = new Map();
            let finalSum = 0;
            let finalSumWithDiscounts = 0;

            items.forEach(({ id, price, discount }) => {
                const count = user.basketItems.find(({ bookId }) => bookId === id).count;

                map.set(id, count);
                finalSum += count * price;
                finalSumWithDiscounts += count * price * (100 - discount) / 100;
            });
            setCountFields(map);
            setFinalFullSum(finalSum);
            setFinalSumWithDiscounts(finalSumWithDiscounts);
        }
    }, [items, user]);

    function onRemoveBook(book: BookEntity) {
        setBookInBasket(book.id);
    }

    function onChangeCountInBasket(bookId: string, count: number) {
        const newCount = countFields.get(bookId) + count;

        update(bookId, newCount)
            .then(items => setUser({ ...user, basketItems: items }))
            .catch(() => {
            });
    }

    function onBookClick(book: BookEntity) {
        router.push(`/books/details?${getParamsQueryString({ id: book.id, pageUrl: '/basket' })}`);
    }

    function onCopyOrderClick() {
        let value = items
            .map((item, i) =>
                `${!item.bookSeries.default ?
                    `${!i || item.bookSeries.id !== items[i - 1].bookSeries.id ? `${item.bookSeries.name} (${item.bookSeries.publishingHouse.name})\n\t` : '\t'}` : ''
                }${item.name} (${countFields.get(item.id)} шт по ${renderPrice(item.price)})`)
            .join('\n');
        const selBox = document.createElement('textarea');

        value = `${value}\n\nСума замовлення: ${renderPrice(finalFullSum)}`;
        if (finalSumWithDiscounts) {
            value = `${value}\nЗнижка: ${renderPrice(finalFullSum - finalSumWithDiscounts)}`;
            value = `${value}\nКінцева сума замовлення зі знижкою: ${renderPrice(finalSumWithDiscounts)}`;
        }
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = value;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
    }

    function onSubmit() {
        if (!submitDisabled) {
            create({
                ...formContext.getValues(),
                books: items.map(book => ({
                    bookId: book.id,
                    count: countFields.get(book.id),
                    price: book.price,
                    discount: book.discount
                }))
            })
                .then(order => {
                    setOrderNumber(renderOrderNumber(order.orderNumber));
                    setUser({ ...user, basketItems: [] });
                })
                .catch(() => {
                });
        }
    }

    return (
        <>
            <Loading show={loading || updating || loadingDeliveries || creating}/>

            <TitleBoxStyled pb={1} m={1}>Кошик</TitleBoxStyled>

            <Box display="flex" flexDirection="column" gap={1} px={{ xs: 1 }}>
                {items.map((book, index) => (
                    <Box key={index}>
                        <Grid container spacing={1} position="relative">
                            {!book.numberInStock &&
                              <Box sx={styleVariables.fixedInStockBox(false)} ml={2}>
                                Немає в наявності
                              </Box>}

                            <Grid item sm={4} md={2} lg={1}
                                  display={{ xs: 'none', md: 'flex' }}
                                  alignItems="center"
                                  justifyContent="center">
                                <IconButton onClick={() => onRemoveBook(book)}>
                                    <ClearIcon color={!book.numberInStock ? 'warning' : 'inherit'}/>
                                </IconButton>
                            </Grid>

                            <Grid item xs={3} md={2} display="flex" alignItems="center"
                                  justifyContent="center">
                                <StyledImageBox>
                                    <CustomImage imageId={book.imageIds[0]} isBookDetails={true}></CustomImage>
                                </StyledImageBox>
                            </Grid>

                            <Grid item xs={9} md={4} lg={5}>
                                <Grid container spacing={1}>
                                    <Grid item xs={10} mt={{ xs: 2, sm: 0 }}
                                          display="flex" flexDirection="column" gap={1}
                                          position="relative" alignItems={{ xs: 'center', sm: 'flex-start' }}>
                                        <Box sx={styleVariables.hintFontSize}>
                                            {book.bookSeries.publishingHouse.name}. {book.bookSeries.name}
                                        </Box>
                                        <Box sx={styleVariables.titleFontSize} textAlign="center">
                                            <CustomLink
                                                onClick={() => onBookClick(book)}><b>{book.name}</b></CustomLink>
                                        </Box>
                                        <Box>{book.language.name}</Box>

                                        {!!book.discount &&
                                          <Box display="flex"><Box sx={styleVariables.discountBoxStyles}>
                                            Знижка: {book.discount}%
                                          </Box></Box>}

                                        <Box>{renderPrice(book.price)}</Box>
                                    </Grid>

                                    <Grid item xs={2} display={{ md: 'none', xs: 'flex' }} alignItems="start"
                                          justifyContent="center">
                                        <IconButton onClick={() => onRemoveBook(book)}>
                                            <ClearIcon color={!book.numberInStock ? 'warning' : 'inherit'}/>
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={6} md={2} mt={{ xs: 2, sm: 0 }} display="flex"
                                  flexDirection="column" gap={1}
                                  alignItems="center">
                                Кількість
                                <Grid container spacing={1} display="flex" flexWrap="nowrap" alignItems="center"
                                      justifyContent="center">
                                    <Grid item>
                                        <IconButton
                                            disabled={!book.numberInStock || countFields.get(book.id) === 1}
                                            onClick={() => onChangeCountInBasket(book.id, -1)}>
                                            <RemoveCircleOutlineIcon fontSize="large"/>
                                        </IconButton>
                                    </Grid>
                                    <Grid item
                                          sx={styleVariables.titleFontSize}>{countFields.get(book.id)}</Grid>
                                    <Grid item>
                                        <IconButton
                                            disabled={!book.numberInStock || countFields.get(book.id) === book.numberInStock}
                                            onClick={() => onChangeCountInBasket(book.id, 1)}>
                                            <AddCircleOutlineIcon fontSize="large"/>
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={6} md={2} mt={{ xs: 2, sm: 0 }} display="flex"
                                  flexDirection="column" gap={1}
                                  alignItems="center">
                                Кінцева ціна
                                <Box sx={priceStyles} textAlign="center">
                                    {renderPrice(countFields.get(book.id) * book.price, book.discount)}
                                </Box>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} mt={1}>
                            <Box borderTop={1} borderColor={primaryLightColor} width="100%"></Box>
                        </Grid>
                    </Box>
                ))}

                <Grid container display="flex" alignItems="center" spacing={1}>
                    {!loading && (!!items?.length ?
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
                        </> : <Grid item xs={12} display="flex" alignItems="center" flexDirection="column"
                                    gap={2} mt={3}>
                            {orderNumber ?
                                <>
                                    <Box sx={basketImageBoxStyles}>
                                        <CustomImage imageLink="/completed_order.png"></CustomImage>
                                    </Box>
                                    <Box sx={styleVariables.titleFontSize}>Дякуємо!</Box>
                                    <Box display="flex">
                                        Ваше замовлення
                                        <Box mx={1} sx={styleVariables.orderNumberStyles}>№{orderNumber}</Box>
                                        оформлене!
                                    </Box>
                                    <Box>Чекайте повідомлення від менеджера.</Box>

                                    <Button variant="outlined" onClick={() => router.push('/')}>
                                        На головну сторінку
                                    </Button>
                                </> :
                                <>
                                    <Box sx={basketImageBoxStyles}>
                                        <CustomImage imageLink="/empty_basket.png"></CustomImage>
                                    </Box>
                                    <Box sx={styleVariables.titleFontSize}>Кошик пустий</Box>
                                    <Button variant="outlined" onClick={() => router.push('/')}>
                                        До вибору книг
                                    </Button>
                                </>}
                        </Grid>)
                    }
                </Grid>
            </Box>

            {error && <ErrorNotification error={error}/>}
            {updatingError && <ErrorNotification error={updatingError}/>}

            {!!items.length && <>
              <FormContainer formContext={formContext}>
                <Grid container spacing={2} px={1} mt={1}>
                  <Grid item xs={12}>
                    <Box sx={styleVariables.sectionTitle} p={1}>Основна інформація</Box>
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
                    <Box sx={styleVariables.sectionTitle} p={1}>Спосіб доставки</Box>

                    <RadioGroup defaultValue={user?.preferredDeliveryId}
                                onChange={(_, value) => formContext.setValue('deliveryId', value)}>
                      <Grid container spacing={2}>
                          {deliveries.map((delivery, index) => (
                              <Grid key={index} item xs={12} sm={6} pl={2}>
                                  <Box p={1}>
                                      <FormControlLabel value={delivery.id}
                                                        control={<Radio/>}
                                                        label={<Box sx={{ width: '100px', height: '50px' }}>
                                                            <CustomImage
                                                                imageId={delivery.imageId}></CustomImage>
                                                        </Box>}/>
                                  </Box>
                              </Grid>
                          ))}
                      </Grid>
                    </RadioGroup>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={styleVariables.sectionTitle} p={1}>Адреса</Box>
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
                                     required={isUrkPoshtaSelected(deliveryId)}
                                     type="number" label="Індекс"
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
                    {isAdmin(user) && !!items.length &&
                      <Button variant="outlined" onClick={onCopyOrderClick}>Скопіювати зміст замовлення</Button>}
                  <Button type="submit" variant="contained"
                          disabled={submitDisabled || items.some(i => !i.numberInStock)} onClick={onSubmit}>
                    Підтвердити замовлення
                  </Button>
                </Grid>
              </Grid>
            </>}
        </>
    );
}
