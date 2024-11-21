import CustomModal from '@/components/modals/custom-modal';
import { OrderEntity } from '@/lib/data/types';
import { renderOrderNumber, renderPrice } from '@/utils/utils';
import { Box, Grid } from '@mui/material';
import { priceStyles, primaryLightColor, styleVariables } from '@/constants/styles-variables';
import React from 'react';
import BasketBook from '@/components/basket-book';
import OrderDeliveryTrackingBox from '@/components/order-delivery-tracking-box';

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
              <Grid container spacing={2} mb={3}>
                <Grid item xs={12} md={6}>Статус: {order.status}</Grid>

                <Grid item xs={12} md={6}>
                  <OrderDeliveryTrackingBox order={order}/>
                </Grid>
              </Grid>

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