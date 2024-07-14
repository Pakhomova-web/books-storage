import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { ApolloError } from '@apollo/client';

import { useBookTypes, useDeleteBookType } from '@/lib/graphql/hooks';
import { BookTypeEntity, IPageable } from '@/lib/data/types';
import CustomTable from '@/components/table/custom-table';
import { TableActionEnum, TableKey } from '@/components/table/table-key';
import Loading from '@/components/loading';
import BookTypeModal from '@/components/modals/book-type-modal';
import ErrorNotification from '@/components/error-notification';
import { NameFiltersPanel } from '@/components/filters/name-filters-panel';

export default function BookTypes() {
    const [tableKeys] = useState<TableKey<BookTypeEntity>[]>([
        { title: 'Name', sortValue: 'name', renderValue: (item: BookTypeEntity) => item.name, type: 'text' },
        {
            type: 'actions',
            actions: [
                {
                    type: TableActionEnum.delete,
                    onClick: async (item: BookTypeEntity) => {
                        try {
                            await deleteItem(item.id);
                            refreshData(true);
                        } catch (err) {
                        }
                    }
                }
            ]
        }
    ]);
    const [selectedItem, setSelectedItem] = useState<BookTypeEntity>();
    const [pageSettings, setPageSettings] = useState<IPageable>({ order: 'asc', orderBy: '' });
    const [filters, setFilters] = useState<BookTypeEntity>();
    const { items, gettingError, loading, refetch } = useBookTypes(pageSettings, filters);
    const { deleteItem, deleting, deletingError } = useDeleteBookType();
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

    function onEdit(item: BookTypeEntity) {
        setError(null);
        setSelectedItem(item);
    }

    return (
        <Loading open={loading || deleting} fullHeight={true}>
            <NameFiltersPanel onApply={(filters: BookTypeEntity) => setFilters(filters)}></NameFiltersPanel>

            <CustomTable data={items} keys={tableKeys}
                         renderKey={(item: BookTypeEntity) => item.id}
                         onChange={(pageSettings: IPageable) => setPageSettings(pageSettings)}
                         pageSettings={pageSettings}
                         withFilters={true}
                         onRowClick={(item: BookTypeEntity) => onEdit(item)}></CustomTable>

            {error && <ErrorNotification error={error}></ErrorNotification>}

            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2, background: 'white', 'z-index': 2 }}>
                <Button variant="outlined" onClick={() => onAdd()}>
                    <AddIcon></AddIcon>Add Book Type
                </Button>
            </Box>

            {(openNewModal || selectedItem) &&
              <BookTypeModal open={true}
                             item={selectedItem}
                             onClose={(updated = false) => refreshData(updated)}></BookTypeModal>}
        </Loading>
    );
}