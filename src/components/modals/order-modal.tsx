import { Box, Button, Grid, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { FormContainer, useForm } from 'react-hook-form-mui';

import {
    isAdmin,
    isNovaPostSelected,
    isSelfPickup,
    isUkrPoshtaSelected,
    onCopyOrderClick,
    renderOrderNumber,
    renderPrice, trimValues,
    validatePhoneNumber
} from '@/utils/utils';
import CustomModal from '@/components/modals/custom-modal';
import { BookEntity, IOption, OrderEntity } from '@/lib/data/types';
import { priceStyles, primaryLightColor, styleVariables } from '@/constants/styles-variables';
import BasketBookItem from '@/components/basket-book-item';
import OrderDeliveryTrackingBox from '@/components/orders/order-delivery-tracking-box';
import CustomTextField from '@/components/form-fields/custom-text-field';
import OrderStatus from '@/components/orders/order-status';
import { useAuth } from '@/components/auth-context';
import { sendEmailWithOrder, useCancelOrder, useUpdateOrder } from '@/lib/graphql/queries/order/hook';
import ErrorNotification from '@/components/error-notification';
import CustomCheckbox from '@/components/form-fields/custom-checkbox';
import GroupDiscountBox from '@/components/group-discount-box';
import { MuiTelInput } from 'mui-tel-input';
import { ApolloError } from '@apollo/client';
import AddressForm, { getAddressFromForm, IAddressForm } from '@/components/form-fields/address-form';
import BookSearchAutocompleteField from '@/components/form-fields/book-search-autocomplete-field';
import { getBookById } from '@/lib/graphql/queries/book/hook';

interface IProps {
    order: OrderEntity;
    open: boolean;
    onClose: (updated?: boolean) => void;
}

interface IForm {
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    trackingNumber: string,
    phoneNumber: string,
    date: string,
    isPaid: boolean,
    isConfirmed: boolean,
    isSent: boolean,
    isCanceled: boolean,
    isPartlyPaid: boolean,
    isDone: boolean,
    comment: string,
    adminComment: string,
    instagramUsername: string
}

export default function OrderModal({ open, order, onClose }: IProps) {
    const { user } = useAuth();
    const [orderItem, setOrderItem] = useState<OrderEntity>(order);
    const { update, updating, updatingError } = useUpdateOrder();
    const { update: cancel, updating: canceling, updatingError: cancelingError } = useCancelOrder();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApolloError>();
    const formContext = useForm<IForm>({
        defaultValues: {
            ...orderItem,
            date: new Date(orderItem?.date).toLocaleDateString(),
            email: orderItem?.user.email,
            instagramUsername: orderItem?.instagramUsername || orderItem?.user.instagramUsername
        }
    });
    const [disabledPersonalInfo] = useState<boolean>(!isAdmin(user) || orderItem.isCanceled || orderItem.isDone);
    const {
        phoneNumber,
        firstName,
        lastName,
        trackingNumber,
        isConfirmed,
        isSent,
        isPaid,
        isPartlyPaid,
        isDone
    } = formContext.watch();
    const addressFormContext = useForm<IAddressForm>({
        defaultValues: {
            isCourier: !!orderItem.house,
            deliveryId: orderItem.delivery.id,
            novaPoshtaWarehouseCityRef: '',
            novaPoshtaWarehouseCity: isNovaPostSelected(orderItem.delivery.id) && !!orderItem.warehouse ? orderItem.city : null,
            novaPoshtaWarehouseRegion: isNovaPostSelected(orderItem.delivery.id) && !!orderItem.warehouse ? orderItem.region : null,
            novaPoshtaWarehouseDistrict: isNovaPostSelected(orderItem.delivery.id) && !!orderItem.warehouse ? orderItem.district : null,
            novaPoshtaWarehouse: isNovaPostSelected(orderItem.delivery.id) && !!orderItem.warehouse ? orderItem.warehouse : null,
            novaPoshtaCourierCity: isNovaPostSelected(orderItem.delivery.id) && !orderItem.warehouse ? orderItem.city : null,
            novaPoshtaCourierRegion: isNovaPostSelected(orderItem.delivery.id) && !orderItem.warehouse ? orderItem.region : null,
            novaPoshtaCourierDistrict: isNovaPostSelected(orderItem.delivery.id) && !orderItem.warehouse ? orderItem.district : null,
            novaPoshtaCourierStreet: isNovaPostSelected(orderItem.delivery.id) && !orderItem.warehouse ? orderItem.street : null,
            novaPoshtaCourierHouse: isNovaPostSelected(orderItem.delivery.id) && !orderItem.warehouse ? orderItem.house : null,
            novaPoshtaCourierFlat: isNovaPostSelected(orderItem.delivery.id) && !orderItem.warehouse ? orderItem.flat : null,
            novaPoshtaCourierCityRef: '',
            city: isUkrPoshtaSelected(orderItem.delivery.id) ? orderItem.city : null,
            district: isUkrPoshtaSelected(orderItem.delivery.id) ? orderItem.district : null,
            region: isUkrPoshtaSelected(orderItem.delivery.id) ? orderItem.region : null,
            warehouse: isUkrPoshtaSelected(orderItem.delivery.id) ? orderItem.warehouse : null
        }
    });
    const {
        city,
        region,
        warehouse,
        novaPoshtaWarehouseCity,
        novaPoshtaWarehouseRegion,
        novaPoshtaWarehouse,
        deliveryId,
        isCourier,
        novaPoshtaCourierCity,
        novaPoshtaCourierStreet,
        novaPoshtaCourierHouse,
        novaPoshtaCourierRegion
    } = addressFormContext.watch();

    useEffect(() => {
        setError(null);
        if (!phoneNumber && !disabledPersonalInfo) {
            formContext.setError('phoneNumber', { message: 'Номер телефону обов\'язковий' });
        } else {
            formContext.clearErrors('phoneNumber');
        }

        if (!firstName && !disabledPersonalInfo) {
            formContext.setError('firstName', { message: 'Ім\'я обов\'язкове' });
        } else {
            formContext.clearErrors('firstName');
        }

        if (!lastName && !disabledPersonalInfo) {
            formContext.setError('lastName', { message: 'Прізвище обов\'язкове' });
        } else {
            formContext.clearErrors('lastName');
        }
    }, [formContext, phoneNumber, firstName, lastName, disabledPersonalInfo]);

    function onChangeBookCount(bookId: string, count: number) {
        setOrderItem(new OrderEntity({
            ...orderItem,
            books: orderItem.books.map(bookOrder => ({
                ...bookOrder,
                count: bookOrder.book.id === bookId ? bookOrder.count + count : bookOrder.count
            }))
        }));
    }

    function onChangeBookDiscount(bookId: string, discount: number) {
        setOrderItem(new OrderEntity({
            ...orderItem,
            books: orderItem.books.map(bookOrder => bookId === bookOrder.book.id ?
                ({ ...bookOrder, discount }) :
                bookOrder)
        }));
    }

    function onChangeGroupDiscountCount(groupId: string, count: number) {
        setOrderItem(new OrderEntity({
            ...orderItem,
            books: orderItem.books.map(bookOrder => ({
                ...bookOrder,
                count: bookOrder.groupDiscountId === groupId ? bookOrder.count + count : bookOrder.count
            }))
        }));
    }

    function onRemove(bookId: string) {
        setOrderItem(new OrderEntity({
            ...orderItem,
            books: orderItem.books.filter(({ book }) => book.id !== bookId)
        }));
    }

    function onRemoveGroup(groupId: string) {
        setOrderItem(new OrderEntity({
            ...orderItem,
            books: orderItem.books.filter(({ groupDiscountId }) => groupId !== groupDiscountId)
        }));
    }

    function onSubmit() {
        const values = trimValues<IForm>(formContext.getValues());

        update({
            id: orderItem.id,
            comment: values.comment,
            adminComment: values.adminComment,
            phoneNumber: values.phoneNumber,
            firstName: values.firstName,
            lastName: values.lastName,
            ...getAddressFromForm(addressFormContext.getValues()),
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
                discount: bookOrder.discount,
                groupDiscountId: bookOrder.groupDiscountId
            }))
        })
            .then(() => onClose(true))
            .catch(() => {
            });
    }

    function onCancel() {
        cancel(orderItem.id)
            .then(() => onClose(true))
            .catch(() => {
            });
    }

    function onSendEmailWithOrder() {
        setLoading(true);
        setError(null);
        sendEmailWithOrder(orderItem.id)
            .then(() => {
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    }

    function handlePhoneNumberChange(value: string) {
        validatePhoneNumber(formContext, value);
    }

    function isSubmitDisabled() {
        if (!firstName || !lastName || !phoneNumber || !deliveryId || !orderItem.books.length) {
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

    function onBookAdd(id: string) {
        if (id && !orderItem.books.some(({ book }) => book.id === id)) {
            setLoading(true);
            getBookById(id)
                .then((book: BookEntity) => {
                    setLoading(false);
                    if (!!book.numberInStock) {
                        setOrderItem(new OrderEntity({
                            ...orderItem,
                            books: [
                                ...orderItem.books,
                                {
                                    count: 1,
                                    price: book.price,
                                    discount: book.discount,
                                    book,
                                    bookId: book.id
                                }
                            ]
                        }));
                    }
                })
                .catch(() => {
                    setLoading(false);
                });
        }
    }

    return (
        <CustomModal open={open} big={true}
                     title={'Замовлення № ' + renderOrderNumber(orderItem?.orderNumber)}
                     onClose={() => onClose()}
                     isSubmitDisabled={isSubmitDisabled()}
                     onSubmit={isAdmin(user) && !orderItem.isDone && !orderItem.isCanceled ? onSubmit : null}
                     loading={loading || !orderItem || updating || canceling}>
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
                    <Grid item xs={12} md={6}>
                        <OrderDeliveryTrackingBox deliveryId={deliveryId}
                                                  trackingNumber={trackingNumber}
                                                  editable={isAdmin(user)}
                                                  disabled={orderItem.isDone}/>
                    </Grid>

                    <Grid item xs={12}>
                        <CustomTextField name="comment"
                                         disabled={disabledPersonalInfo}
                                         label="Коментар" fullWidth/>
                    </Grid>

                    {isAdmin(user) && <Grid item xs={12}>
                      <CustomTextField name="adminComment" disabled={disabledPersonalInfo}
                                       label="Коментар адміністратора" fullWidth/>
                    </Grid>}

                    <Grid item xs={12}>
                        <Box sx={styleVariables.sectionTitle}>Особиста інформація</Box>
                    </Grid>

                    <Grid item xs={12} md={6} lg={3}>
                        <CustomTextField name="firstName" required
                                         disabled={disabledPersonalInfo}
                                         label="Ім'я" fullWidth/>
                    </Grid>

                    <Grid item xs={12} md={6} lg={3}>
                        <CustomTextField name="lastName" required
                                         disabled={disabledPersonalInfo}
                                         label="Прізвище" fullWidth/>
                    </Grid>

                    <Grid item xs={12} md={6} lg={3}>
                        <MuiTelInput value={phoneNumber}
                                     required={true}
                                     disabled={disabledPersonalInfo}
                                     onChange={handlePhoneNumberChange}
                                     label="Номер телефону"
                                     error={!!formContext.formState.errors.phoneNumber}
                                     fullWidth/>
                    </Grid>

                    <Grid item xs={12} md={6} lg={3}>
                        <CustomTextField name="email" disabled required label="Ел. адреса" fullWidth/>
                    </Grid>

                    <Grid item xs={12} md={6} lg={3}>
                        <CustomTextField name="instagramUsername"
                                         disabled={disabledPersonalInfo}
                                         label="Нікнейм в інстаграм для зв'язку"
                                         fullWidth/>
                    </Grid>
                </Grid>
            </FormContainer>

            <AddressForm formContext={addressFormContext} disabled={disabledPersonalInfo}/>

            {isAdmin(user) &&
              <Grid container spacing={2} my={1}>
                <Grid item xs={12} md={4}>
                  <BookSearchAutocompleteField onSelect={(val: IOption<string>) => onBookAdd(val?.id)}/>
                </Grid>
              </Grid>}

            <Grid container alignItems="center" display="flex" spacing={2} justifyContent="space-between" my={2}>
                {orderItem?.books.filter(b => !b.groupDiscountId)
                    .map(({ book, count, price, discount }) =>
                        <Grid item xs={12} key={book.id}>
                            <BasketBookItem book={book}
                                            count={count}
                                            price={price}
                                            pageUrl="/profile/orders"
                                            discount={discount}
                                            editable={!disabledPersonalInfo && !isSent}
                                            onRemove={() => onRemove(book.id)}
                                            onCountChange={(count: number) => onChangeBookCount(book.id, count)}
                                            onDiscountChange={discount => onChangeBookDiscount(book.id, discount)}/>
                        </Grid>
                    )}

                {orderItem?.groupDiscounts.map(({ id, books, discount, count }, i) =>
                    <Grid item xs={12} key={`${id}-${i}`}>
                        <GroupDiscountBox books={books}
                                          count={count}
                                          discount={discount}
                                          editable={isAdmin(user) && !orderItem.isDone && !orderItem.isCanceled && !isSent}
                                          onDeleteGroupClick={() => onRemoveGroup(id)}
                                          onCountChange={(count: number) => onChangeGroupDiscountCount(id, count)}/>
                    </Grid>)}
            </Grid>


            <FormContainer formContext={formContext}>
                <Grid container alignItems="center" display="flex" spacing={2} justifyContent="space-between" mb={2}>
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

                      <Tooltip title={!isSelfPickup(deliveryId) && !trackingNumber ? 'Немає ТТН' : ''}>
                        <Grid item xs={12} md={6}>
                          <CustomCheckbox
                            checked={isSent}
                            disabled={(!isSelfPickup(deliveryId) && !trackingNumber) || !isConfirmed || orderItem.isDone || orderItem.isCanceled}
                            label={'Замовлення ' + (isSelfPickup(deliveryId) ? 'вручене' : 'відправлене')}
                            name="isSent"/>
                        </Grid>
                      </Tooltip>

                      <Grid item xs={12} md={6}>
                        <CustomCheckbox checked={isDone}
                                        disabled={!isSent || orderItem.isDone || orderItem.isCanceled}
                                        label="Завершити замовлення"
                                        name="isDone"/>
                      </Grid>
                    </>}
                </Grid>
            </FormContainer>

            {isAdmin(user) && <>
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

              <Grid container spacing={2} mt={1} display="flex" alignItems="center" justifyContent="space-between">
                <Grid item xs={12} md={6} lg={4} display="flex" justifyContent="center">
                  <Button variant="outlined" fullWidth onClick={onSendEmailWithOrder}>
                    Відправити замовлення на ел. пошту
                  </Button>
                </Grid>

                  {!!error &&
                    <Grid item xs={12} md={6} lg={4} display="flex" justifyContent="center">
                      <ErrorNotification error={error}/>
                    </Grid>
                  }
              </Grid>
            </>}

            {!!updatingError && <ErrorNotification error={updatingError}/>}
            {!!cancelingError && <ErrorNotification error={cancelingError}/>}
        </CustomModal>
    );
}