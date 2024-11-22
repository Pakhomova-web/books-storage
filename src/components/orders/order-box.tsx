import { Box, Grid } from '@mui/material';
import { borderRadius, primaryLightColor, styleVariables } from '@/constants/styles-variables';
import { renderOrderNumber, renderPrice } from '@/utils/utils';
import OrderStatus from '@/components/orders/order-status';
import OrderDeliveryTrackingBox from '@/components/orders/order-delivery-tracking-box';
import React from 'react';
import { styled } from '@mui/material/styles';

const StyledOrderBox = styled(Box)(() => ({
    borderRadius,
    border: `1px solid ${primaryLightColor}`,
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    ':hover': {
        backgroundColor: primaryLightColor
    }
}));

export default function OrdersList({ orders, onClick }) {
    return (
        <Grid container mb={1}>
            {orders?.map((order, index) => (
                <Grid key={index} item xs={12} md={4} onClick={() => onClick(order)}>
                    <StyledOrderBox gap={1} p={1} m={1}>
                        <Box sx={styleVariables.titleFontSize}>
                            <b>№ {renderOrderNumber(order.orderNumber)}</b>
                        </Box>

                        <OrderStatus status={order.status}/>

                        <OrderDeliveryTrackingBox delivery={order.delivery}
                                                  trackingNumber={order.trackingNumber}/>

                        <Grid container spacing={1}>
                            <Grid item xs={6}>Дата</Grid>
                            <Grid item xs={6}>{new Date(order.date).toLocaleDateString()}</Grid>

                            <Grid item xs={6}>Кількість книжок</Grid>
                            <Grid item xs={6}>{order.booksCount}</Grid>

                            <Grid item xs={6}>Сума</Grid>
                            <Grid item xs={6}>{renderPrice(order.finalSumWithDiscounts)}</Grid>
                        </Grid>
                    </StyledOrderBox>
                </Grid>
            ))}
        </Grid>);
}