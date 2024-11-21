import { Box, Grid, Table, TableFooter, TablePagination, TableRow } from '@mui/material';
import React, { useState } from 'react';
import { styled } from '@mui/material/styles';

import { borderRadius, primaryLightColor, styleVariables } from '@/constants/styles-variables';
import Loading from '@/components/loading';
import { useAuth } from '@/components/auth-context';
import ErrorNotification from '@/components/error-notification';
import ProfileMenu from '@/pages/profile/profile-menu';
import CustomImage from '@/components/custom-image';
import { useOrders } from '@/lib/graphql/queries/order/hook';
import { IPageable, OrderEntity } from '@/lib/data/types';
import { renderOrderNumber, renderPrice } from '@/utils/utils';
import UserOrderModal from '@/components/modals/user-order-modal';
import OrderDeliveryTrackingBox from '@/components/order-delivery-tracking-box';

const emptyListImageBoxStyles = {
    width: '100px',
    height: '100px',
    opacity: 0.2
};

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

export default function Orders() {
    const { user } = useAuth();
    const [pageSettings, setPageSettings] = useState<IPageable>({ page: 0, rowsPerPage: 6 });
    const { loading, gettingError, items, totalCount } = useOrders(pageSettings, { userId: user?.id });
    const [selectedOrder, setSelectedOrder] = useState<OrderEntity>();

    function onPageChange(val: number) {
        setPageSettings({
            ...pageSettings,
            page: val
        });
    }

    function onRowsPerPageChange(val: number) {
        setPageSettings({
            ...pageSettings,
            page: 0,
            rowsPerPage: val
        });
    }

    return (
        <ProfileMenu activeUrl="orders">
            <Loading show={loading}></Loading>

            {!!items?.length && <Box>
              <Grid container mb={1}>
                  {items?.map((order, index) => (
                      <Grid key={index} item xs={12} md={4} onClick={() => setSelectedOrder(order)}>
                          <StyledOrderBox gap={1} p={1} m={1}>
                              <Box sx={styleVariables.titleFontSize}>
                                  <b>№ {renderOrderNumber(order.orderNumber)}</b>
                              </Box>

                              <Box my={1}>Статус: {order.status}</Box>

                              <OrderDeliveryTrackingBox order={order}/>

                              <Box>Дата: {new Date(order.date).toLocaleDateString()}</Box>
                              <Box>Кількість книжок: {order.books.length}</Box>

                              <Box mt={1}>Сума: {renderPrice(order.finalSumWithDiscounts)}</Box>
                          </StyledOrderBox>
                      </Grid>
                  ))}
              </Grid>

              <Box sx={{ position: 'sticky', bottom: 0 }}>
                <Table>
                  <TableFooter>
                    <TableRow>
                      <TablePagination rowsPerPageOptions={[6, 12]}
                                       count={totalCount}
                                       page={pageSettings.page}
                                       sx={styleVariables.paginatorStyles}
                                       labelRowsPerPage="Кільк. на сторінці"
                                       rowsPerPage={pageSettings.rowsPerPage}
                                       onPageChange={(_e, val: number) => onPageChange(val)}
                                       onRowsPerPageChange={({ target }) => onRowsPerPageChange(Number(target.value))}/>
                    </TableRow>
                  </TableFooter>
                </Table>
              </Box>
            </Box>}

            {!loading && !items?.length &&
              <Grid item display="flex" width="100%" alignItems="center" flexDirection="column">
                <Box sx={emptyListImageBoxStyles} mb={2}>
                  <CustomImage imageLink="/no_orders.png"></CustomImage>
                </Box>
                <Box sx={styleVariables.titleFontSize}>Тут ще немає замовлень</Box>
              </Grid>}

            {gettingError && <ErrorNotification error={gettingError}></ErrorNotification>}

            <UserOrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)}></UserOrderModal>
        </ProfileMenu>
    );
}
