import { useAuth } from '@/components/auth-context';
import { IOrderFilter, IPageable, OrderEntity } from '@/lib/data/types';
import { isAdmin } from '@/utils/utils';
import React, { useEffect, useState } from 'react';
import { useOrders } from '@/lib/graphql/queries/order/hook';
import { ApolloError } from '@apollo/client';
import Loading from '@/components/loading';
import ErrorNotification from '@/components/error-notification';
import OrderModal from '@/components/modals/order-modal';
import SettingsMenu from '@/pages/settings/settings-menu';
import OrdersList from '@/components/orders/orders-list';
import { Box } from '@mui/material';
import SortFiltersContainer from '@/components/filters/sort-filters-container';
import { useForm } from 'react-hook-form-mui';
import CustomTextField from '@/components/form-fields/custom-text-field';
import Head from 'next/head';
import { ISortKey } from '@/components/types';
import Pagination from '@/components/pagination';

export default function Orders() {
    const { user } = useAuth();
    const [sortKeys] = useState<ISortKey[]>([
        {
            title: 'Не підтвердженні спочатку',
            orderBy: 'isConfirmed',
            order: 'asc'
        },
        {
            title: 'Не відправлені спочатку',
            orderBy: 'isSent',
            order: 'asc'
        }
    ]);
    const [selectedItem, setSelectedItem] = useState<OrderEntity>();
    const [pageSettings, setPageSettings] = useState<IPageable>({ page: 0, rowsPerPage: 6 });
    const [filters, setFilters] = useState<IOrderFilter>();
    const { items, totalCount, gettingError, loading } = useOrders(pageSettings, filters);
    const [error, setError] = useState<ApolloError>();
    const formContext = useForm();

    function refreshData(updated = true) {
        if (updated) {
            setFilters({ ...filters });
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
            <Head>
                <title>Налаштування - Замовлення</title>
            </Head>

            <Loading show={loading}></Loading>

            {isAdmin(user) &&
              <Box px={1}>
                <SortFiltersContainer sortKeys={sortKeys}
                                      formContext={formContext}
                                      onApply={() => onApply()}
                                      onClear={() => onClearFilter()}
                                      onSort={(settings: IPageable) => setPageSettings(settings)}
                                      pageSettings={pageSettings}>
                  <Box display="flex" flexDirection="column" gap={2}>
                    <CustomTextField label="Швидкий пошук" name="quickSearch" fullWidth
                                     autoFocus={true}></CustomTextField>

                    <CustomTextField label="№ замовлення" name="orderNumber" fullWidth
                                     type="number"></CustomTextField>

                    <CustomTextField label="Ім'я" name="firstName" fullWidth></CustomTextField>

                    <CustomTextField label="Прізвище" name="lastName" fullWidth></CustomTextField>

                    <CustomTextField label="Номер телефону" name="phoneNumber" fullWidth></CustomTextField>

                    <CustomTextField label="Нікнейм в інстаграм" name="instagramUsername" fullWidth></CustomTextField>
                  </Box>
                </SortFiltersContainer>

                <OrdersList orders={items} onClick={order => setSelectedItem(order)}/>

                  {error && <ErrorNotification error={error}></ErrorNotification>}
                  {gettingError && <ErrorNotification error={gettingError}></ErrorNotification>}

                <Pagination rowsPerPage={pageSettings.rowsPerPage} count={totalCount}
                            page={pageSettings.page} onRowsPerPageChange={onRowsPerPageChange}
                            onPageChange={onPageChange}/>

                  {selectedItem && <OrderModal open={true}
                                               order={selectedItem}
                                               onClose={(updated = false) => refreshData(updated)}></OrderModal>}
              </Box>
            }
        </SettingsMenu>
    );
}