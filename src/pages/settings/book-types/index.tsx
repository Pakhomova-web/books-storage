import { Box, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { ApolloError } from '@apollo/client';

import { useDeleteBookType, useBookTypes } from '@/lib/graphql/hooks';
import { BookTypeEntity } from '@/lib/data/types';
import CustomTable from '@/components/table/custom-table';
import { TableKey, TableSort } from '@/components/table/table-key';
import Loading from '@/components/loading';
import BookTypeModal from '@/components/modals/book-type-modal';
import ErrorNotification from '@/components/error-notification';

export default function BookTypes() {
    const [tableKeys] = useState<TableKey<BookTypeEntity>[]>([
        { title: 'Name', sortValue: 'name', renderValue: (item: BookTypeEntity) => item.name, type: 'text' },
        {
            type: 'icons',
            icons: [
                {
                    element: <DeleteIcon color="warning"/>,
                    onIconClick: async (item: BookTypeEntity) => {
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
    const [sort, setSort] = useState<TableSort>({ order: 'asc', orderBy: '' });
    const { items, gettingError, loading, refetch } = useBookTypes(sort);
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

    function refreshData(updated?: boolean) {
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
            <CustomTable data={items} keys={tableKeys}
                         renderKey={(item: BookTypeEntity) => item.id}
                         onSort={(sort: TableSort) => setSort(sort)}
                         sort={sort}
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