import { Box, Button, FormControlLabel, Grid, Radio, RadioGroup } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { FormContainer, useForm } from 'react-hook-form-mui';

import {
    isAdmin,
    isNovaPostSelected,
    isSelfPickup,
    isUkrPoshtaSelected,
    renderOrderNumber,
    renderPrice
} from '@/utils/utils';
import CustomModal from '@/components/modals/custom-modal';
import { DeliveryEntity, OrderEntity } from '@/lib/data/types';
import { priceStyles, primaryLightColor, styleVariables } from '@/constants/styles-variables';
import BasketItem from '@/components/basket-item';
import OrderDeliveryTrackingBox from '@/components/orders/order-delivery-tracking-box';
import CustomTextField from '@/components/form-fields/custom-text-field';
import OrderStatus from '@/components/orders/order-status';
import { useAuth } from '@/components/auth-context';
import { useUpdateOrder } from '@/lib/graphql/queries/order/hook';
import ErrorNotification from '@/components/error-notification';
import CustomImage from '@/components/custom-image';
import { useDeliveries } from '@/lib/graphql/queries/delivery/hook';

interface IProps {
    order: OrderEntity;
    open: boolean;
    onClose: (updated?: boolean) => void;
}

export default function OrderModal({ open, order, onClose }: IProps) {
    const { user } = useAuth();
    const [orderItem, setOrderItem] = useState<OrderEntity>(order);
    const [delivery, setDelivery] = useState<DeliveryEntity>(order.delivery);
    const { update, updating, updatingError } = useUpdateOrder();
    const { items: deliveries, loading: loadingDeliveries } = useDeliveries();
    const [submitDisabled, setSubmitDisabled] = useState<boolean>(false);
    const formContext = useForm({
        defaultValues: {
            ...orderItem,
            date: new Date(orderItem?.date).toLocaleDateString(),
            email: orderItem?.user.email,
            instagramUsername: orderItem?.user.instagramUsername
        }
    });
    const {
        phoneNumber,
        firstName,
        lastName,
        region,
        city,
        postcode,
        novaPostOffice,
        trackingNumber
    } = formContext.watch();

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

        if (isNovaPostSelected(delivery.id) && !novaPostOffice) {
            formContext.setError('novaPostOffice', { message: '№ відділення/поштомата обов\'язкове' });
            formContext.clearErrors('postcode');
            setSubmitDisabled(true);
            invalid = true;
        } else if (isUkrPoshtaSelected(delivery.id) && !postcode) {
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
    }, [delivery, phoneNumber, firstName, lastName, region, city, postcode, novaPostOffice]);

    function onChangeBookCount(bookId: string, count: number) {
        setOrderItem(new OrderEntity({
            ...orderItem,
            books: orderItem.books.map(bookOrder => ({
                ...bookOrder,
                count: bookOrder.book.id === bookId ? bookOrder.count + count : bookOrder.count
            }))
        }));
    }

    function onRemove(bookId: string) {
        setOrderItem(new OrderEntity({
            ...orderItem,
            books: orderItem.books.filter(({ book }) => book.id !== bookId)
        }));
    }

    function onSubmit() {
        const values = formContext.getValues();

        update({
            id: orderItem.id,
            comment: values.comment,
            adminComment: values.adminComment,
            region: values.region,
            district: values.district,
            city: values.city,
            phoneNumber: values.phoneNumber,
            postcode: values.postcode,
            novaPostOffice: values.novaPostOffice,
            firstName: values.firstName,
            lastName: values.lastName,
            deliveryId: delivery.id,
            books: orderItem.books.map(bookOrder => ({
                bookId: bookOrder.book.id,
                count: bookOrder.count,
                price: bookOrder.price,
                discount: bookOrder.discount
            }))
        })
            .then(() => onClose(true))
            .catch(() => {
            });
    }

    function onDeliveryChange(id: string) {
        setDelivery(deliveries.find(d => d.id === id));
    }

    function onConfirm() {
        // TODO
    }

    function onPay() {
        // TODO
    }

    function onPartlyPaid() {
        // todo
    }

    function onDoneClick() {
        // todo
    }

    function onSent() {
        // todo
    }

    function onCancel() {
        // todo
    }

    return (
        <CustomModal open={open} big={true}
                     title={'Замовлення № ' + renderOrderNumber(orderItem?.orderNumber)}
                     onClose={onClose}
                     isSubmitDisabled={submitDisabled}
                     onSubmit={isAdmin(user) ? onSubmit : null}
                     loading={!orderItem || updating || loadingDeliveries}>
            <OrderStatus status={orderItem.status}/>

            {isAdmin(user) && <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3} lg={2}>
                <Button variant="outlined" fullWidth disabled={orderItem.isConfirmed} onClick={onConfirm}>
                  Підтвердити замовлення
                </Button>
              </Grid>

              <Grid item xs={12} sm={6} md={3} lg={2}>
                <Button variant="outlined" fullWidth disabled={!orderItem.isConfirmed || orderItem.isPaid}
                        onClick={onPay}>
                  Замолення оплачене
                </Button>
              </Grid>

              <Grid item xs={12} sm={6} md={3} lg={2}>
                <Button variant="outlined" fullWidth disabled={!orderItem.isConfirmed || orderItem.isPartlyPaid}
                        onClick={onPartlyPaid}>
                  Зроблена передпалата</Button>
              </Grid>

              <Grid item xs={12} sm={6} md={3} lg={2}>
                <Button variant="outlined" fullWidth disabled={!orderItem.isConfirmed || orderItem.isSent}
                        onClick={onSent}>
                  Замовлення {isSelfPickup(delivery.id) ? 'вручене' : 'відправлене'}
                </Button>
              </Grid>

              <Grid item xs={12} sm={6} md={3} lg={2}>
                <Button variant="contained" fullWidth
                        disabled={!orderItem.isConfirmed || orderItem.isDone || !orderItem.isSent}
                        onClick={onDoneClick}>
                  Завершити замовлення
                </Button>
              </Grid>

              <Grid item xs={12} sm={6} md={3} lg={2}>
                <Button variant="outlined" fullWidth onClick={onCancel} color="warning">
                  Відмінити замовлення
                </Button>
              </Grid>
            </Grid>}

            <FormContainer formContext={formContext}>
                <Grid container alignItems="center" spacing={2} mt={1}>
                    <Grid item xs={12} md={6} lg={2}>
                        <CustomTextField name="date" label="Дата" disabled fullWidth/>
                    </Grid>

                    {!!delivery && <>
                      <Grid item xs={12} md={6}>
                        <OrderDeliveryTrackingBox delivery={delivery}
                                                  trackingNumber={trackingNumber}
                                                  editable={isAdmin(user)}/>
                      </Grid>

                        {isAdmin(user) && <Grid item xs={12}>
                          <RadioGroup defaultValue={delivery.id}
                                      onChange={(_, value) => onDeliveryChange(value)}>
                            <Grid container spacing={2}>
                                {deliveries.map((opt, index) => (
                                    <Grid key={index} item xs={12} sm={3} pl={2}>
                                        <Box p={1}>
                                            <FormControlLabel value={opt.id}
                                                              control={<Radio/>}
                                                              label={opt.imageId ?
                                                                  <Box sx={{ width: '100px', height: '50px' }}>
                                                                      <CustomImage imageId={opt.imageId}></CustomImage>
                                                                  </Box> : opt.name}/>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                          </RadioGroup>
                        </Grid>}
                    </>}

                    <Grid item xs={12}>
                        <CustomTextField name="comment" disabled={!isAdmin(user)} label="Коментар" fullWidth/>
                    </Grid>

                    {isAdmin(user) && <Grid item xs={12}>
                      <CustomTextField name="adminComment" label="Коментар адміністратора" fullWidth/>
                    </Grid>}
                </Grid>

                <Box sx={styleVariables.sectionTitle} p={1} my={2}>Особиста інформація</Box>

                <Grid container spacing={2} mb={2}>
                    <Grid item xs={12} md={6} lg={3}>
                        <CustomTextField name="firstName" required disabled={!isAdmin(user)} label="Ім'я" fullWidth/>
                    </Grid>

                    <Grid item xs={12} md={6} lg={3}>
                        <CustomTextField name="lastName" required disabled={!isAdmin(user)} label="Прізвище" fullWidth/>
                    </Grid>

                    <Grid item xs={12} md={6} lg={3}>
                        <CustomTextField name="phoneNumber" required disabled={!isAdmin(user)} label="Номер телефону"
                                         fullWidth/>
                    </Grid>

                    <Grid item xs={12} md={6} lg={3}>
                        <CustomTextField name="email" disabled required label="Ел. адреса" fullWidth/>
                    </Grid>

                    <Grid item xs={12} md={6} lg={3}>
                        <CustomTextField name="instagramUsername" disabled
                                         label="Нікнейм в інстаграм для зв'язку"
                                         fullWidth/>
                    </Grid>
                </Grid>

                <Box sx={styleVariables.sectionTitle} p={1} my={2}>Адреса</Box>
                <Grid container spacing={2} mb={2}>
                    <Grid item xs={12} md={6} lg={3}>
                        <CustomTextField name="region" required disabled={!isAdmin(user)} label="Область" fullWidth/>
                    </Grid>

                    <Grid item xs={12} md={6} lg={3}>
                        <CustomTextField name="district" disabled={!isAdmin(user)} label="Район" fullWidth/>
                    </Grid>

                    <Grid item xs={12} md={6} lg={3}>
                        <CustomTextField name="city" required disabled={!isAdmin(user)} label="Місто" fullWidth/>
                    </Grid>

                    {isUkrPoshtaSelected(delivery.id) && <Grid item xs={12} md={6} lg={3}>
                      <CustomTextField name="postcode"
                                       disabled={!isAdmin(user)}
                                       label="Індекс"
                                       required={isUkrPoshtaSelected(orderItem.delivery.id)}
                                       fullWidth/>
                    </Grid>}

                    {isNovaPostSelected(delivery.id) && <Grid item xs={12} md={6} lg={3}>
                      <CustomTextField name="novaPostOffice"
                                       disabled={!isAdmin(user)}
                                       required={isNovaPostSelected(orderItem.delivery.id)}
                                       label="№ відділення / поштомату"
                                       fullWidth/>
                    </Grid>}
                </Grid>
            </FormContainer>

            {orderItem?.books.map(({ book, count, price, discount }, index) => (
                <Box key={index}>
                    <BasketItem book={book}
                                count={count}
                                price={price}
                                discount={discount}
                                editable={isAdmin(user)}
                                onRemove={() => onRemove(book.id)}
                                onCountChange={(count: number) => onChangeBookCount(book.id, count)}/>
                </Box>
            ))}

            <Grid container spacing={1} alignItems="center" mt={1}>
                <Grid item xs={7} sm={8} md={9} display="flex" justifyContent="flex-end"
                      textAlign="end">
                    Сума замовлення без знижки:
                </Grid>
                <Grid item xs={5} sm={4} md={3} textAlign="center">
                    {renderPrice(orderItem?.finalSum)}
                </Grid>

                <Grid item xs={12}>
                    <Box borderTop={1} borderColor={primaryLightColor} width="100%"></Box>
                </Grid>

                <Grid item xs={7} sm={8} md={9} display="flex" justifyContent="flex-end"
                      textAlign="end">
                    Знижка:
                </Grid>
                <Grid item xs={5} sm={4} md={3} textAlign="center">
                    {renderPrice(orderItem?.finalSum - orderItem?.finalSumWithDiscounts)}
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
                         textAlign="center">{renderPrice(orderItem?.finalSumWithDiscounts)}</Box>
                </Grid>

                <Grid item xs={12}>
                    <Box borderTop={1} borderColor={primaryLightColor} width="100%"></Box>
                </Grid>
            </Grid>

            {!!updatingError && <ErrorNotification error={updatingError}/>}
        </CustomModal>
    );
}