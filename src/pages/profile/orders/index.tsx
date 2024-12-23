import { Box, Button, Grid } from '@mui/material';
import React, { useState } from 'react';

import { styleVariables } from '@/constants/styles-variables';
import Loading from '@/components/loading';
import { useAuth } from '@/components/auth-context';
import ErrorNotification from '@/components/error-notification';
import ProfileMenu from '@/pages/profile/profile-menu';
import CustomImage from '@/components/custom-image';
import { useOrders } from '@/lib/graphql/queries/order/hook';
import { IPageable, OrderEntity } from '@/lib/data/types';
import OrderModal from '@/components/modals/order-modal';
import { useRouter } from 'next/router';
import OrdersList from '@/components/orders/orders-list';
import Head from 'next/head';
import Pagination from '@/components/pagination';

const emptyListImageBoxStyles = {
    width: '100px',
    height: '100px',
    opacity: 0.2
};

export default function Orders() {
    const { user } = useAuth();
    const router = useRouter();
    const [pageSettings, setPageSettings] = useState<IPageable>({ page: 0, rowsPerPage: 6 });
    const { loading, gettingError, items, totalCount, refetch } = useOrders(pageSettings, { user: user?.id });
    const [selectedOrder, setSelectedOrder] = useState<OrderEntity>();
    const [loadingItems, setLoadingItems] = useState<boolean>(false);

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

    function closeOrderModal(updated: boolean) {
        setSelectedOrder(null);
        if (updated) {
            setLoadingItems(true);
            refetch(pageSettings).then(() => setLoadingItems(false));
        }
    }

    return (
        <ProfileMenu activeUrl="orders">
            <Head>
                <title>Профіль - Замовлення</title>
            </Head>

            <Loading show={loading || loadingItems}></Loading>

            <OrdersList orders={items} onClick={order => setSelectedOrder(order)}/>

            <Pagination rowsPerPage={pageSettings.rowsPerPage} count={totalCount}
                        page={pageSettings.page} onRowsPerPageChange={onRowsPerPageChange}
                        onPageChange={onPageChange}/>

            {!loading && !items?.length &&
              <Grid item display="flex" width="100%" alignItems="center" flexDirection="column" gap={2}>
                <Box sx={emptyListImageBoxStyles}>
                  <CustomImage imageLink="/no_orders.png"></CustomImage>
                </Box>
                <Box sx={styleVariables.titleFontSize}>Тут ще немає замовлень</Box>

                <Button variant="outlined" onClick={() => router.push('/')}>До вибору книг</Button>
              </Grid>}

            {gettingError && <ErrorNotification error={gettingError}></ErrorNotification>}

            {!!selectedOrder &&
              <OrderModal open={true} order={selectedOrder} onClose={updated => closeOrderModal(updated)}></OrderModal>}
        </ProfileMenu>
    );
}
