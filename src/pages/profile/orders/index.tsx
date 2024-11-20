import { Box, Grid, Table, TableFooter, TablePagination, TableRow } from '@mui/material';
import React, { useState } from 'react';

import { styleVariables } from '@/constants/styles-variables';
import Loading from '@/components/loading';
import { useAuth } from '@/components/auth-context';
import ErrorNotification from '@/components/error-notification';
import ProfileMenu from '@/pages/profile/profile-menu';
import CustomImage from '@/components/custom-image';
import { useOrders } from '@/lib/graphql/queries/order/hook';
import { IPageable } from '@/lib/data/types';
import { renderOrderNumber } from '@/utils/utils';

const emptyListImageBoxStyles = {
    width: '100px',
    height: '100px',
    opacity: 0.2
};

export default function Orders() {
    const { user } = useAuth();
    const [pageSettings, setPageSettings] = useState<IPageable>({ page: 0, rowsPerPage: 10 });
    const { loading, gettingError, items, totalCount } = useOrders(pageSettings, { userId: user?.id });

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

            {!!items?.length && <>
                {items?.map((item, index) => (
                    <Box key={index}>
                        №{renderOrderNumber(item.orderNumber)}
                    </Box>
                ))}

              <Box sx={{ position: 'sticky', bottom: 0 }}>
                <Table>
                  <TableFooter>
                    <TableRow>
                      <TablePagination rowsPerPageOptions={[5, 10, 25]}
                                       count={totalCount}
                                       page={pageSettings.page}
                                       sx={styleVariables.paginatorStyles}
                                       labelRowsPerPage="Кількість на сторінці"
                                       rowsPerPage={pageSettings.rowsPerPage}
                                       onPageChange={(_e, val: number) => onPageChange(val)}
                                       onRowsPerPageChange={({ target }) => onRowsPerPageChange(Number(target.value))}/>
                    </TableRow>
                  </TableFooter>
                </Table>
              </Box>
            </>}

            {!loading && !items?.length &&
              <Grid item display="flex" width="100%" alignItems="center" flexDirection="column">
                <Box sx={emptyListImageBoxStyles} mb={2}>
                  <CustomImage imageLink="/no_orders.png"></CustomImage>
                </Box>
                <Box sx={styleVariables.titleFontSize}>Тут ще немає замовлень</Box>
              </Grid>}

            {gettingError && <ErrorNotification error={gettingError}></ErrorNotification>}
        </ProfileMenu>
    );
}
