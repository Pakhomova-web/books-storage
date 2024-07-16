import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { ApolloError } from '@apollo/client';

import { useBookSeries, useDeleteBookSeries } from '@/lib/graphql/hooks';
import { BookSeriesEntity, IPageable } from '@/lib/data/types';
import CustomTable from '@/components/table/custom-table';
import { TableActionEnum, TableKey } from '@/components/table/table-key';
import Loading from '@/components/loading';
import BookSeriesModal from '@/components/modals/book-series-modal';
import ErrorNotification from '@/components/error-notification';
import { NameFiltersPanel } from '@/components/filters/name-filters-panel';

export default function BookSeries() {
    const [tableKeys] = useState<TableKey<BookSeriesEntity>[]>([
        { title: 'Name', sortValue: 'name', renderValue: (item: BookSeriesEntity) => item.name, type: 'text' },
        {
            title: 'Publishing House',
            sortValue: 'publishingHouse.name',
            renderValue: (item: BookSeriesEntity) => item.publishingHouse?.name,
            type: 'text'
        },
        {
            type: 'actions',
            actions: [
                {
                    type: TableActionEnum.delete,
                    onClick: (item: BookSeriesEntity) => deleteHandler(item)
                }
            ]
        }
    ]);
    const [selectedItem, setSelectedItem] = useState<BookSeriesEntity>();
    const [pageSettings, setPageSettings] = useState<IPageable>({ order: 'asc', orderBy: '' });
    const [filters, setFilters] = useState<BookSeriesEntity>();
    const { items, gettingError, loading, refetch } = useBookSeries(pageSettings, filters);
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
            deleteItem(item.id);
            refreshData(true);
        } catch (err) {
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
        <Loading open={loading || deleting} fullHeight={true}>
            <NameFiltersPanel onApply={(filters: BookSeriesEntity) => setFilters(filters)}></NameFiltersPanel>

            <CustomTable data={items} keys={tableKeys}
                         renderKey={(item: BookSeriesEntity) => item.id}
                         onChange={(pageSettings: IPageable) => setPageSettings(pageSettings)}
                         pageSettings={pageSettings}
                         withFilters={true}
                         onRowClick={(item: BookSeriesEntity) => onEdit(item)}></CustomTable>

            {error && <ErrorNotification error={error}></ErrorNotification>}

            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2, background: 'white', 'z-index': 2 }}>
                <Button variant="outlined" onClick={() => onAdd()}>
                    <AddIcon></AddIcon>Add series
                </Button>
            </Box>

            {(openNewModal || selectedItem) &&
              <BookSeriesModal open={true}
                               item={selectedItem}
                               onClose={(updated = false) => refreshData(updated)}></BookSeriesModal>}
        </Loading>
    );
}