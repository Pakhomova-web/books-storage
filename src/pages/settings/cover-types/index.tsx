import { Box, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';

import { useDeleteCoverType, useCoverTypes } from '@/lib/graphql/hooks';
import { CoverTypeEntity } from '@/lib/data/types';
import CustomTable from '@/components/table/custom-table';
import { TableKey, TableSort } from '@/components/table/table-key';
import Loading from '@/components/loading';
import CoverTypeModal from '@/components/modals/book-type-modal';

export default function CoverTypes() {
    const [tableKeys] = useState<TableKey<CoverTypeEntity>[]>([
        { title: 'Назва', sortValue: 'name', renderValue: (item: CoverTypeEntity) => item.name, type: 'text' },
        {
            type: 'icons',
            icons: [
                {
                    element: <DeleteIcon color="warning"/>,
                    onIconClick: (item: CoverTypeEntity) => deleteHandler(item)
                }
            ]
        }
    ]);
    const [selectedItem, setSelectedItem] = useState<CoverTypeEntity>();
    const [sort, setSort] = useState<TableSort>({ order: 'asc', orderBy: '' });
    const { items, error, loading, refetch } = useCoverTypes(sort);
    const { deleteItem } = useDeleteCoverType();
    const [deleting, setDeleting] = useState<boolean>(false);
    const [deletingError, setDeletingError] = useState<string>();
    const [openNewModal, setOpenNewModal] = useState<boolean>(false);

    async function deleteHandler(item: CoverTypeEntity) {
        setDeleting(true);
        deleteItem(item.id)
            .then(() => {
                setDeleting(false);
                refreshData(true);
            })
            .catch(() => setDeletingError('Something went wrong with deleting book type'));
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
                         renderKey={(item: CoverTypeEntity) => item.id}
                         onSort={(sort: TableSort) => setSort(sort)}
                         sort={sort}
                         onRowClick={item => setSelectedItem(item)}></CustomTable>

            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2, background: 'white', 'z-index': 2 }}>
                <Button variant="outlined" onClick={() => onAdd()}>
                    <AddIcon></AddIcon>Додати тип книги
                </Button>
            </Box>

            {(openNewModal || selectedItem) &&
              <CoverTypeModal open={true}
                             item={selectedItem}
                             onClose={(updated = false) => refreshData(updated)}></CoverTypeModal>}
        </Loading>
    );
}