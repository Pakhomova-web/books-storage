import { Box, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';

import { useAuthors, useDeleteAuthor } from '@/lib/graphql/hooks';
import { AuthorEntity } from '@/lib/data/types';
import CustomTable from '@/components/table/custom-table';
import { TableKey, TableSort } from '@/components/table/table-key';
import Loading from '@/components/loading';
import AuthorModal from '@/components/modals/author-modal';

export default function Authors() {
    const [tableKeys] = useState<TableKey<AuthorEntity>[]>([
        { title: 'Ім\'я', sortValue: 'name', renderValue: (item: AuthorEntity) => item.name, type: 'text' },
        { title: 'Опис', renderValue: (item: AuthorEntity) => item.description, type: 'text' },
        {
            type: 'icons',
            icons: [
                {
                    element: <DeleteIcon color="warning"/>,
                    onIconClick: (item: AuthorEntity) => deleteHandler(item)
                }
            ]
        }
    ]);
    const [selectedItem, setSelectedItem] = useState<AuthorEntity>();
    const [sort, setSort] = useState<TableSort>({ order: 'asc', orderBy: '' });
    const { items, error, loading, refetch } = useAuthors(sort);
    const { deleteItem } = useDeleteAuthor();
    const [deleting, setDeleting] = useState<boolean>(false);
    const [deletingError, setDeletingError] = useState<string>();
    const [openNewModal, setOpenNewModal] = useState<boolean>(false);

    async function deleteHandler(item: AuthorEntity) {
        setDeleting(true);
        deleteItem(item.id)
            .then(() => {
                setDeleting(false);
                refreshData(true);
            })
            .catch(() => setDeletingError('Something went wrong with deleting author'));
    }

    function refreshData(updated?: boolean) {
        if (updated) {
            refetch();
        }
        setOpenNewModal(false);
        setSelectedItem(undefined);
    }

    function onAdd() {
        setOpenNewModal(true);
    }

    if (error) {
        return <Box>Error</Box>;
    }

    return (
        <Loading open={loading || deleting} fullHeight={true}>
            {deletingError && <Box>{deletingError}</Box>}
            <CustomTable data={items} keys={tableKeys}
                         renderKey={(item: AuthorEntity) => item.id}
                         onSort={(sort: TableSort) => setSort(sort)}
                         sort={sort}
                         onRowClick={item => setSelectedItem(item)}></CustomTable>

            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2, background: 'white', 'z-index': 2 }}>
                <Button variant="outlined" onClick={() => onAdd()}>
                    <AddIcon></AddIcon>Додати автора
                </Button>
            </Box>

            {(openNewModal || selectedItem) &&
              <AuthorModal open={true}
                           item={selectedItem}
                           onClose={(updated = false) => refreshData(updated)}></AuthorModal>}
        </Loading>
    );
}