import { useAuth } from '@/components/auth-context';
import { IOrderFilter, IPageable, OrderEntity } from '@/lib/data/types';
import { isAdmin } from '@/utils/utils';
import React, { useEffect, useState } from 'react';
import { styleVariables } from '@/constants/styles-variables';
import { useOrders } from '@/lib/graphql/queries/order/hook';
import { ApolloError } from '@apollo/client';
import Loading from '@/components/loading';
import ErrorNotification from '@/components/error-notification';
import OrderModal from '@/components/modals/order-modal';
import SettingsMenu from '@/pages/settings/settings-menu';
import OrdersList from '@/components/orders/orders-list';
import { Box, Table, TableFooter, TablePagination, TableRow } from '@mui/material';
import { TableKey } from '@/components/table/table-key';
import SortFiltersContainer from '@/components/filters/sort-filters-container';
import { FormContainer, useForm } from 'react-hook-form-mui';
import CustomTextField from '@/components/form-fields/custom-text-field';

export default function Orders() {
    const { user } = useAuth();
    const [tableKeys] = useState<TableKey<OrderEntity>[]>([
        {
            title: '№ замовлення',
            sortValue: 'orderNumber',
            type: 'text'
        },
        {
            title: 'Ім\'я замовника',
            sortValue: 'firstName',
            type: 'text'
        },
        {
            title: 'Прізвище замовника',
            sortValue: 'lastName',
            type: 'text'
        },
        {
            title: 'Номер телефону',
            sortValue: 'phoneNumber',
            type: 'text'
        }
    ]);
    const [selectedItem, setSelectedItem] = useState<OrderEntity>();
    const [pageSettings, setPageSettings] = useState<IPageable>({ page: 0, rowsPerPage: 6 });
    const [filters, setFilters] = useState<IOrderFilter>();
    const { items, totalCount, gettingError, loading, refetch } = useOrders(pageSettings, filters);
    const [error, setError] = useState<ApolloError>();
    const formContext = useForm();

    useEffect(() => {
        refreshData();
    }, [filters, pageSettings]);

    function refreshData(updated = true) {
        if (updated) {
            refetch();
        }
        setError(null);
        setSelectedItem(undefined);
    }

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

    function onClearFilter() {
        formContext.reset();
        onApply();
    }

    function onApply() {
        setFilters(formContext.getValues());
    }

    return (
        <SettingsMenu activeUrl="orders">
            <Loading show={loading}></Loading>

            {isAdmin(user) &&
              <>
                <SortFiltersContainer tableKeys={tableKeys}
                                      onApply={() => onApply()}
                                      onClear={() => onClearFilter()}
                                      onSort={(pageSettings: IPageable) => setPageSettings(pageSettings)}
                                      pageSettings={pageSettings}>
                  <FormContainer formContext={formContext}>
                    <Box display="flex" flexDirection="column" gap={2}>
                      <CustomTextField label="Швидкий пошук" name="quickSearch" fullWidth></CustomTextField>

                      <CustomTextField label="№ замовлення" name="orderNumber" fullWidth
                                       type="number"></CustomTextField>

                      <CustomTextField label="Ім'я" name="firstName" fullWidth></CustomTextField>

                      <CustomTextField label="Прізвище" name="lastName" fullWidth></CustomTextField>

                      <CustomTextField label="Номер телефону" name="phoneNumber" fullWidth></CustomTextField>

                      <CustomTextField label="Нікнейм в інстаграм" name="instagramUsername" fullWidth></CustomTextField>
                    </Box>
                  </FormContainer>
                </SortFiltersContainer>

                <OrdersList orders={items} onClick={order => setSelectedItem(order)}/>

                  {error && <ErrorNotification error={error}></ErrorNotification>}
                  {gettingError && <ErrorNotification error={gettingError}></ErrorNotification>}

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

                  {selectedItem && <OrderModal open={true}
                                               order={selectedItem}
                                               onClose={(updated = false) => refreshData(updated)}></OrderModal>}
              </>
            }
        </SettingsMenu>
    );
}