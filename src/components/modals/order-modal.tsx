import { Box, Button, Grid, RadioGroup } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { FormContainer, useForm } from 'react-hook-form-mui';

import {
    isAdmin,
    isNovaPostSelected,
    isSelfPickup,
    isUkrPoshtaSelected,
    onCopyOrderClick,
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
import { useCancelOrder, useUpdateOrder } from '@/lib/graphql/queries/order/hook';
import ErrorNotification from '@/components/error-notification';
import { useDeliveries } from '@/lib/graphql/queries/delivery/hook';
import DeliveryRadioOption from '@/components/form-fields/delivery-radio-option';
import CustomCheckbox from '@/components/form-fields/custom-checkbox';

interface IProps {
    order: OrderEntity;
    open: boolean;
    onClose: (updated?: boolean) => void;
}

class Form extends OrderEntity {
    email: string;
}

export default function OrderModal({ open, order, onClose }: IProps) {
    const { user } = useAuth();
    const [orderItem, setOrderItem] = useState<OrderEntity>(order);
    const [delivery, setDelivery] = useState<DeliveryEntity>(order.delivery);
    const { update, updating, updatingError } = useUpdateOrder();
    const { update: cancel, updating: canceling, updatingError: cancelingError } = useCancelOrder();
    const { items: deliveries, loading: loadingDeliveries } = useDeliveries();
    const [submitDisabled, setSubmitDisabled] = useState<boolean>(false);
    const formContext = useForm<Form>({
        defaultValues: {
            ...orderItem,
            date: new Date(orderItem?.date).toLocaleDateString(),
            email: orderItem?.user.email,
            instagramUsername: orderItem?.instagramUsername || orderItem?.user.instagramUsername
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
        trackingNumber,
        isConfirmed,
        isSent,
        isPaid,
        isPartlyPaid,
        isDone
    } = formContext.watch();

    useEffect(() => {
        let invalid = false;

        if (!isAdmin(user) || orderItem.isDone || orderItem.isCanceled) {
            setSubmitDisabled(false);
            return;
        }
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
            postcode: values.postcode ? +values.postcode : null,
            novaPostOffice: values.novaPostOffice ? +values.novaPostOffice : null,
            firstName: values.firstName,
            lastName: values.lastName,
            deliveryId: delivery.id,
            ...(values.isDone ? {
                isConfirmed: true,
                isPaid: orderItem.isPaid,
                isPartlyPaid: orderItem.isPartlyPaid,
                isSent: true
            } : {
                isConfirmed: values.isConfirmed,
                isPaid: values.isPaid,
                isPartlyPaid: values.isPartlyPaid,
                isSent: values.isSent
            }),
            isDone: values.isDone,
            trackingNumber: values.trackingNumber,
            instagramUsername: values.instagramUsername !== user?.instagramUsername ? values.instagramUsername : null,
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

    function onCancel() {
        cancel(orderItem.id)
            .then(() => onClose(true))
            .catch(() => {
            });
    }

    return (
        <CustomModal open={open} big={true}
                     title={'Замовлення № ' + renderOrderNumber(orderItem?.orderNumber)}
                     onClose={() => onClose()}
                     isSubmitDisabled={submitDisabled}
                     onSubmit={isAdmin(user) && !orderItem.isDone && !orderItem.isCanceled ? onSubmit : null}
                     loading={!orderItem || updating || loadingDeliveries || canceling}>
            <FormContainer formContext={formContext}>
                <Grid container alignItems="center" display="flex" spacing={2} justifyContent="space-between" mb={2}>
                    <Grid item xs={12} sm={6} md={8} lg={10} display="flex"
                          justifyContent={{ xs: 'center', sm: 'flex-start' }}>
                        <OrderStatus status={orderItem.status}/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} lg={2}>
                        <CustomTextField name="date" label="Дата" disabled fullWidth/>
                    </Grid>
                </Grid>

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <CustomTextField name="comment"
                                         disabled={!isAdmin(user) || orderItem.isDone || orderItem.isCanceled}
                                         label="Коментар" fullWidth/>
                    </Grid>

                    {isAdmin(user) && <Grid item xs={12}>
                      <CustomTextField name="adminComment" disabled={orderItem.isDone || orderItem.isCanceled}
                                       label="Коментар адміністратора" fullWidth/>
                    </Grid>}

                    {!!delivery && <>
                      <Grid item xs={12} md={6}>
                        <OrderDeliveryTrackingBox delivery={delivery}
                                                  trackingNumber={trackingNumber}
                                                  editable={isAdmin(user)}
                                                  disabled={orderItem.isDone}/>
                      </Grid>

                      <Grid item xs={12}>
                        <Box sx={styleVariables.sectionTitle}>Спосіб доставки</Box>
                      </Grid>

                      <Grid item xs={12}>
                        <RadioGroup defaultValue={delivery.id}
                                    onChange={(_, value) => onDeliveryChange(value)}>
                          <Grid container spacing={2}>
                              {deliveries.map((opt, index) => (
                                  <Grid key={index} item xs={12} sm={4} md={3} pl={2}>
                                      <Box p={1}>
                                          <DeliveryRadioOption
                                              disabled={!isAdmin(user) || orderItem.isDone || orderItem.isCanceled}
                                              option={opt}/>
                                      </Box>
                                  </Grid>
                              ))}
                          </Grid>
                        </RadioGroup>
                      </Grid>
                    </>}

                    <Grid item xs={12}>
                        <Box sx={styleVariables.sectionTitle}>Особиста інформація</Box>
                    </Grid>

                    <Grid item xs={12} md={6} lg={3}>
                        <CustomTextField name="firstName" required
                                         disabled={!isAdmin(user) || orderItem.isDone || orderItem.isCanceled}
                                         label="Ім'я" fullWidth/>
                    </Grid>

                    <Grid item xs={12} md={6} lg={3}>
                        <CustomTextField name="lastName" required
                                         disabled={!isAdmin(user) || orderItem.isDone || orderItem.isCanceled}
                                         label="Прізвище" fullWidth/>
                    </Grid>

                    <Grid item xs={12} md={6} lg={3}>
                        <CustomTextField name="phoneNumber" required
                                         disabled={!isAdmin(user) || orderItem.isDone || orderItem.isCanceled}
                                         label="Номер телефону"
                                         fullWidth/>
                    </Grid>

                    <Grid item xs={12} md={6} lg={3}>
                        <CustomTextField name="email" disabled required label="Ел. адреса" fullWidth/>
                    </Grid>

                    <Grid item xs={12} md={6} lg={3}>
                        <CustomTextField name="instagramUsername"
                                         disabled={orderItem.isDone || orderItem.isCanceled}
                                         label="Нікнейм в інстаграм для зв'язку"
                                         fullWidth/>
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={styleVariables.sectionTitle}>Адреса</Box>
                    </Grid>

                    <Grid item xs={12} md={6} lg={3}>
                        <CustomTextField name="region" required
                                         disabled={!isAdmin(user) || orderItem.isDone || orderItem.isCanceled}
                                         label="Область" fullWidth/>
                    </Grid>

                    <Grid item xs={12} md={6} lg={3}>
                        <CustomTextField name="district"
                                         disabled={!isAdmin(user) || orderItem.isDone || orderItem.isCanceled}
                                         label="Район"
                                         fullWidth/>
                    </Grid>

                    <Grid item xs={12} md={6} lg={3}>
                        <CustomTextField name="city" required
                                         disabled={!isAdmin(user) || orderItem.isDone || orderItem.isCanceled}
                                         label="Місто" fullWidth/>
                    </Grid>

                    {isUkrPoshtaSelected(delivery.id) &&
                      <Grid item xs={12} md={6} lg={3}>
                        <CustomTextField name="postcode"
                                         type="number"
                                         disabled={!isAdmin(user) || orderItem.isDone || orderItem.isCanceled}
                                         label="Індекс"
                                         required={isUkrPoshtaSelected(orderItem.delivery.id)}
                                         fullWidth/>
                      </Grid>}

                    {isNovaPostSelected(delivery.id) &&
                      <Grid item xs={12} md={6} lg={3}>
                        <CustomTextField name="novaPostOffice"
                                         type="number"
                                         disabled={!isAdmin(user) || orderItem.isDone || orderItem.isCanceled}
                                         required={isNovaPostSelected(orderItem.delivery.id)}
                                         label="№ відділення / поштомату"
                                         fullWidth/>
                      </Grid>}

                    {orderItem?.books.map(({ book, count, price, discount }, index) => (
                        <Grid item xs={12} key={index}>
                            <BasketItem book={book}
                                        count={count}
                                        price={price}
                                        pageUrl="/profile/orders"
                                        discount={discount}
                                        editable={isAdmin(user) && !orderItem.isDone && !orderItem.isCanceled && !isSent}
                                        onRemove={() => onRemove(book.id)}
                                        onCountChange={(count: number) => onChangeBookCount(book.id, count)}/>
                        </Grid>
                    ))}

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

                    <Grid item xs={7} sm={8} md={9} display="flex" justifyContent="flex-end" alignItems="center"
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

                    {isAdmin(user) && <>
                      <Grid item xs={12} md={6}>
                        <CustomCheckbox label="Замовлення підтверджене"
                                        checked={isConfirmed}
                                        disabled={isPaid || isPartlyPaid || isSent || orderItem.isDone || orderItem.isCanceled}
                                        name="isConfirmed"/>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <CustomCheckbox
                          checked={isPaid}
                          disabled={isPartlyPaid || !isConfirmed || isSent || orderItem.isDone || orderItem.isCanceled}
                          label="Замовлення оплачене"
                          name="isPaid"/>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <CustomCheckbox checked={isPartlyPaid}
                                        disabled={isPaid || !isConfirmed || isSent || orderItem.isDone || orderItem.isCanceled}
                                        label="Зроблена передпалата"
                                        name="isPartlyPaid"/>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <CustomCheckbox
                          checked={isSent}
                          disabled={(!isSelfPickup(delivery.id) && !trackingNumber) || !isConfirmed || orderItem.isDone || orderItem.isCanceled}
                          label={'Замовлення ' + (isSelfPickup(delivery.id) ? 'вручене' : 'відправлене')}
                          name="isSent"/>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <CustomCheckbox checked={isDone}
                                        disabled={!isSent || orderItem.isDone || orderItem.isCanceled}
                                        label="Завершити замовлення"
                                        name="isDone"/>
                      </Grid>
                    </>}
                </Grid>
            </FormContainer>

            {isAdmin(user) &&
              <Grid container spacing={2} mt={1} display="flex" alignItems="center" justifyContent="space-between">
                <Grid item xs={12} md={6} lg={4} display="flex" justifyContent="center">
                  <Button variant="outlined" fullWidth
                          onClick={() => onCopyOrderClick(orderItem.books, orderItem.finalSum, orderItem.finalSumWithDiscounts)}>
                    Скопіювати зміст замовлення
                  </Button>
                </Grid>

                <Grid item xs={12} md={6} lg={4}>
                  <Button variant="outlined" fullWidth onClick={onCancel} color="warning"
                          disabled={orderItem.isDone || orderItem.isCanceled}>
                    Відмінити замовлення
                  </Button>
                </Grid>
              </Grid>
            }

            {!!updatingError && <ErrorNotification error={updatingError}/>}
            {!!cancelingError && <ErrorNotification error={cancelingError}/>}
        </CustomModal>
    );
}