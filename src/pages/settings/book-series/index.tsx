import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import React, { useEffect, useState } from 'react';
import { ApolloError } from '@apollo/client';

import { useBookSeries, useDeleteBookSeries } from '@/lib/graphql/hooks';
import { BookSeriesEntity, IBookSeriesFilter, IPageable } from '@/lib/data/types';
import CustomTable from '@/components/table/custom-table';
import { TableActionEnum, TableKey } from '@/components/table/table-key';
import Loading from '@/components/loading';
import BookSeriesModal from '@/components/modals/book-series-modal';
import ErrorNotification from '@/components/error-notification';
import { BookSeriesFilters } from '@/components/filters/book-series-filters';
import { pageStyles, positionRelative, styleVariables } from '@/constants/styles-variables';
import { isAdmin } from '@/utils/utils';
import { useAuth } from '@/components/auth-context';

export default function BookSeries() {
    const { user, checkAuth } = useAuth();
    const [tableActions] = useState<TableKey<BookSeriesEntity>>({
        renderMobileLabel: (item: BookSeriesEntity) => <Box><b>{item.name}</b></Box>,
        type: 'actions',
        actions: isAdmin(user) ? [
            {
                type: TableActionEnum.delete,
                onClick: (item: BookSeriesEntity) => deleteHandler(item)
            }
        ] : []
    });
    const [mobileKeys] = useState<TableKey<BookSeriesEntity>[]>([
        {
            title: 'Publishing House',
            sortValue: 'publishingHouse.name',
            renderValue: (item: BookSeriesEntity) => item.publishingHouse?.name,
            type: 'text'
        }
    ]);
    const [tableKeys] = useState<TableKey<BookSeriesEntity>[]>([
        {
            title: 'Name',
            sortValue: 'name',
            renderValue: (item: BookSeriesEntity) => item.name,
            type: 'text'
        },
        ...mobileKeys
    ]);
    const [selectedItem, setSelectedItem] = useState<BookSeriesEntity>();
    const [pageSettings, setPageSettings] = useState<IPageable>({ order: 'asc', orderBy: '' });
    const [filters, setFilters] = useState<IBookSeriesFilter>();
    const { items, totalCount, gettingError, loading, refetch } = useBookSeries(pageSettings, filters);
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

    useEffect(() => {
        refreshData();
    }, [filters, pageSettings]);

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
            refetch();
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
        <Box sx={positionRelative}>
            <Loading show={loading || deleting}></Loading>

            <Box sx={pageStyles}>
                <BookSeriesFilters onApply={(filters: IBookSeriesFilter) => setFilters(filters)}></BookSeriesFilters>

                <CustomTable data={items}
                             keys={tableKeys}
                             mobileKeys={mobileKeys}
                             actions={tableActions}
                             renderKey={(item: BookSeriesEntity) => item.id}
                             onChange={(pageSettings: IPageable) => setPageSettings(pageSettings)}
                             pageSettings={pageSettings}
                             withFilters={true}
                             usePagination={true}
                             totalCount={totalCount}
                             onRowClick={(item: BookSeriesEntity) => onEdit(item)}>
                    {error && <ErrorNotification error={error}></ErrorNotification>}

                    {isAdmin(user) &&
                      <Box sx={styleVariables.buttonsContainer}>
                        <Button variant="outlined" onClick={() => onAdd()}>
                          <AddIcon></AddIcon>Add series
                        </Button>
                      </Box>}
                </CustomTable>

                {(openNewModal || selectedItem) &&
                  <BookSeriesModal open={true}
                                   item={selectedItem}
                                   isAdmin={isAdmin(user)}
                                   onClose={(updated = false) => refreshData(updated)}></BookSeriesModal>}
            </Box>
        </Box>
    );
}