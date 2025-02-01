import { Box, Grid } from '@mui/material';
import { borderRadius, primaryLightColor, styleVariables } from '@/constants/styles-variables';
import { isAdmin, renderOrderNumber, renderPrice } from '@/utils/utils';
import OrderStatus from '@/components/orders/order-status';
import OrderDeliveryTrackingBox from '@/components/orders/order-delivery-tracking-box';
import React from 'react';
import { styled } from '@mui/material/styles';
import { useAuth } from '@/components/auth-context';
import CustomImage from '@/components/custom-image';

const StyledOrderBox = styled(Box)(() => ({
    borderRadius,
    border: `1px solid ${primaryLightColor}`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    cursor: 'pointer',
    height: '100%',
    ':hover': {
        backgroundColor: primaryLightColor
    }
}));

export default function OrdersList({ orders, onClick }) {
    const { user } = useAuth();

    return (
        <Grid container pb={1} mb={1} spacing={2}>
            {orders?.map(order => (
                <Grid key={order.id} item xs={12} md={4} onClick={() => onClick(order)}>
                    <StyledOrderBox gap={1} p={1}>
                        <Box>
                            <Box sx={styleVariables.titleFontSize}>
                                <b>№ {renderOrderNumber(order.orderNumber)}</b>
                            </Box>

                            <OrderStatus status={order.status}/>
                        </Box>

                        <OrderDeliveryTrackingBox deliveryId={order.delivery.id}
                                                  trackingNumber={order.trackingNumber}/>

                        <Grid container spacing={1}>
                            {isAdmin(user) && <>
                              <Grid item xs={6}>ПІБ</Grid>
                              <Grid item xs={6}>{order.lastName + ' ' + order.firstName}</Grid>
                            </>}

                            <Grid item xs={6}>Дата</Grid>
                            <Grid item xs={6}>{new Date(order.date).toLocaleDateString()}</Grid>

                            <Grid item xs={6}>Кількість книжок</Grid>
                            <Grid item xs={6}>{order.booksCount}</Grid>

                            <Grid item xs={6}>Сума</Grid>
                            <Grid item xs={6}>{renderPrice(order.finalSumWithDiscounts)}</Grid>
                        </Grid>

                        {isAdmin(user) &&
                          <Box display="flex" gap={1} flexWrap="wrap">
                              {order.books.map((b, index) => (
                                  <Box key={index} height="60px" width="50px">
                                      <CustomImage imageId={b.book.imageIds ? b.book.imageIds[0] : null}/>
                                  </Box>
                              ))}
                          </Box>}
                    </StyledOrderBox>
                </Grid>
            ))}
        </Grid>)
        ;
}