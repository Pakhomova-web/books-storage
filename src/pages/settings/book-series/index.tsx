import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ApolloError } from '@apollo/client';

import { useBookSeries, useDeleteBookSeries } from '@/lib/graphql/queries/book-series/hook';
import { BookSeriesEntity, BookSeriesFilter, IPageable } from '@/lib/data/types';
import CustomTable from '@/components/table/custom-table';
import { TableActionEnum, TableKey } from '@/components/table/table-key';
import Loading from '@/components/loading';
import BookSeriesModal from '@/components/modals/book-series-modal';
import ErrorNotification from '@/components/error-notification';
import { BookSeriesFilters } from '@/components/filters/book-series-filters';
import { isAdmin } from '@/utils/utils';
import { useAuth } from '@/components/auth-context';
import SettingsMenu from '@/pages/settings/settings-menu';
import Head from 'next/head';

export default function BookSeries() {
    const { user, checkAuth } = useAuth();
    const [tableActions] = useState<TableKey<BookSeriesEntity>>({
        renderMobileLabel: (item: BookSeriesEntity) => <Box><b>{item.name}</b></Box>,
        type: 'actions',
        actions: isAdmin(user) ? [
            {
                type: TableActionEnum.delete,
                disable: (item: BookSeriesEntity) => item.default,
                onClick: (item: BookSeriesEntity) => deleteHandler(item)
            }
        ] : []
    });
    const [mobileKeys] = useState<TableKey<BookSeriesEntity>[]>([
        {
            title: 'Видавництво',
            sortValue: 'publishingHouse.name',
            renderValue: (item: BookSeriesEntity) => item.publishingHouse?.name,
            type: 'text'
        }
    ]);
    const [tableKeys] = useState<TableKey<BookSeriesEntity>[]>([
        {
            title: 'Назва',
            sortValue: 'name',
            renderValue: (item: BookSeriesEntity) => item.name,
            type: 'text'
        },
        ...mobileKeys
    ]);
    const [selectedItem, setSelectedItem] = useState<BookSeriesEntity>();
    const [pageSettings, setPageSettings] = useState<IPageable>({
        order: 'asc',
        orderBy: '',
        rowsPerPage: 12,
        page: 0
    });
    const [filters, setFilters] = useState<BookSeriesFilter>();
    const { items, totalCount, gettingError, loading } = useBookSeries(pageSettings, filters);
    const { deleteItem, deleting, deletingError } = useDeleteBookSeries();
    const [openNewModal, setOpenNewModal] = useState<boolean>(false);
    const [error, setError] = useState<ApolloError>();

    useEffect(() => {
        if (gettingError) {
            setError(gettingError);
        } else if (deletingError) {
            setError(deletingError);
        }
    }, [gettingError, deletingError]);

    async function deleteHandler(item: BookSeriesEntity) {
        try {
            await deleteItem(item.id);
            refreshData();
        } catch (err) {
            checkAuth(err);
        }
    }

    function refreshData(updated = true) {
        if (updated) {
            setFilters({ ...filters });
        }
        setError(null);
        setOpenNewModal(false);
        setSelectedItem(undefined);
    }

    function onAdd() {
        setError(null);
        setOpenNewModal(true);
    }

    function onEdit(item: BookSeriesEntity) {
        setError(null);
        setSelectedItem(item);
    }

    return (
        <SettingsMenu activeUrl="book-series" onAddClick={onAdd}>
            <Head>
                <title>Налаштування - Серії</title>
            </Head>

            <Loading show={loading || deleting}></Loading>

            {isAdmin(user) &&
              <>
                <BookSeriesFilters totalCount={totalCount}
                                   onApply={(filters: BookSeriesFilter) => {
                                       setPageSettings(prev => ({ ...prev, page: 0 }));
                                       setFilters(filters)
                                   }}
                                   pageSettings={pageSettings}
                                   onSort={(settings: IPageable) => setPageSettings(settings)}></BookSeriesFilters>

                <CustomTable data={items}
                             keys={tableKeys}
                             mobileKeys={mobileKeys}
                             actions={tableActions}
                             renderKey={(item: BookSeriesEntity) => item.id}
                             onChange={(settings: IPageable) => setPageSettings(settings)}
                             pageSettings={pageSettings}
                             usePagination={true}
                             totalCount={totalCount}
                             onRowClick={(item: BookSeriesEntity) => onEdit(item)}>
                    {error && <ErrorNotification error={error}></ErrorNotification>}
                </CustomTable>

                  {(openNewModal || selectedItem) &&
                    <BookSeriesModal open={true}
                                     item={selectedItem}
                                     isAdmin={isAdmin(user)}
                                     onClose={(updated = false) => refreshData(updated)}></BookSeriesModal>}
              </>
            }
        </SettingsMenu>
    );
}