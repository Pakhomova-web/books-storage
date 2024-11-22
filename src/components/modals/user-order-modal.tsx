import CustomModal from '@/components/modals/custom-modal';
import { OrderEntity } from '@/lib/data/types';
import { isNovaPostSelected, isUkrPoshtaSelected, renderOrderNumber, renderPrice } from '@/utils/utils';
import { Box, Grid } from '@mui/material';
import { priceStyles, primaryLightColor, styleVariables } from '@/constants/styles-variables';
import React from 'react';
import BasketBook from '@/components/basket-book';
import OrderDeliveryTrackingBox from '@/components/orders/order-delivery-tracking-box';
import CustomTextField from '@/components/form-fields/custom-text-field';
import { FormContainer } from 'react-hook-form-mui';
import OrderStatus from '@/components/orders/order-status';

interface IProps {
    order: OrderEntity;
    onClose: () => void;
}

export default function UserOrderModal({ order, onClose }: IProps) {
    return (
        <CustomModal open={!!order} big={true}
                     title={'Замовлення № ' + renderOrderNumber(order?.orderNumber)}
                     onClose={onClose}>
            {!!order && <>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <OrderStatus status={order.status}/>
                </Grid>

                <Grid item xs={12} md={6}>
                  <OrderDeliveryTrackingBox order={order}/>
                </Grid>
              </Grid>

              <FormContainer
                defaultValues={{ ...order, email: order.user.email, instagramUsername: order.user.instagramUsername }}>
                <Grid container my={2}>
                  <Grid item xs={12}>
                    <CustomTextField name="comment" disabled label="Коментар" fullWidth/>
                  </Grid>
                </Grid>

                <Box sx={styleVariables.sectionTitle} p={1} my={2}>Особиста інформація</Box>

                <Grid container spacing={2} mb={2}>
                  <Grid item xs={12} md={6} lg={3}>
                    <CustomTextField name="firstName" disabled label="Ім'я" fullWidth/>
                  </Grid>

                  <Grid item xs={12} md={6} lg={3}>
                    <CustomTextField name="lastName" disabled label="Прізвище" fullWidth/>
                  </Grid>

                  <Grid item xs={12} md={6} lg={3}>
                    <CustomTextField name="phoneNumber" disabled label="Номер телефону" fullWidth/>
                  </Grid>

                  <Grid item xs={12} md={6} lg={3}>
                    <CustomTextField name="email" disabled label="Ел. адреса" fullWidth/>
                  </Grid>

                  <Grid item xs={12} md={6} lg={3}>
                    <CustomTextField name="instagramUsername" disabled label="Нікнейм в інстаграм для зв'язку"
                                     fullWidth/>
                  </Grid>
                </Grid>

                <Box sx={styleVariables.sectionTitle} p={1} my={2}>Адреса</Box>
                <Grid container spacing={2} mb={2}>
                  <Grid item xs={12} md={6} lg={3}>
                    <CustomTextField name="region" disabled label="Область" fullWidth/>
                  </Grid>

                  <Grid item xs={12} md={6} lg={3}>
                    <CustomTextField name="district" disabled label="Район" fullWidth/>
                  </Grid>

                  <Grid item xs={12} md={6} lg={3}>
                    <CustomTextField name="city" disabled label="Місто" fullWidth/>
                  </Grid>

                    {isUkrPoshtaSelected(order.delivery.id) && <Grid item xs={12} md={6} lg={3}>
                      <CustomTextField name="postcode" disabled label="Індекс" fullWidth/>
                    </Grid>}

                    {isNovaPostSelected(order.delivery.id) && <Grid item xs={12} md={6} lg={3}>
                      <CustomTextField name="novaPostOffice" disabled label="№ відділення / поштомату" fullWidth/>
                    </Grid>}
                </Grid>
              </FormContainer>

                {order.books.map((book, index) => (
                    <Box key={index}>
                        <BasketBook book={book.book} count={book.count} price={book.price} discount={book.discount}/>
                    </Box>
                ))}

              <Grid container spacing={1} alignItems="center" mt={1}>
                <Grid item xs={7} sm={8} md={9} display="flex" justifyContent="flex-end"
                      textAlign="end">
                  Сума замовлення без знижки:
                </Grid>
                <Grid item xs={5} sm={4} md={3} textAlign="center">
                    {renderPrice(order.finalSum)}
                </Grid>

                <Grid item xs={12}>
                  <Box borderTop={1} borderColor={primaryLightColor} width="100%"></Box>
                </Grid>

                <Grid item xs={7} sm={8} md={9} display="flex" justifyContent="flex-end"
                      textAlign="end">
                  Знижка:
                </Grid>
                <Grid item xs={5} sm={4} md={3} textAlign="center">
                    {renderPrice(order.finalSum - order.finalSumWithDiscounts)}
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
                       textAlign="center">{renderPrice(order.finalSumWithDiscounts)}</Box>
                </Grid>

                <Grid item xs={12}>
                  <Box borderTop={1} borderColor={primaryLightColor} width="100%"></Box>
                </Grid>
              </Grid>
            </>}
        </CustomModal>
    );
}