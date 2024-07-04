import { Box, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';

import { useBookSeries, useDeleteBookSeries } from '@/lib/graphql/hooks';
import { BookSeriesEntity } from '@/lib/data/types';
import CustomTable from '@/components/table/custom-table';
import { TableKey, TableSort } from '@/components/table/table-key';
import Loading from '@/components/loading';
import BookSeriesModal from '@/components/modals/book-series-modal';

export default function BookSeries() {
    const [tableKeys] = useState<TableKey<BookSeriesEntity>[]>([
        { title: 'Назва', sortValue: 'name', renderValue: (item: BookSeriesEntity) => item.name, type: 'text' },
        {
            title: 'Видавництво',
            sortValue: 'publishingHouseName',
            renderValue: (item: BookSeriesEntity) => item.publishingHouse?.name,
            type: 'text'
        },
        {
            type: 'icons',
            icons: [
                {
                    element: <DeleteIcon color="warning"/>,
                    onIconClick: (item: BookSeriesEntity) => deleteHandler(item)
                }
            ]
        }
    ]);
    const [selectedItem, setSelectedItem] = useState<BookSeriesEntity>();
    const [sort, setSort] = useState<TableSort>({ order: 'asc', orderBy: '' });
    const { items, error, loading, refetch } = useBookSeries(sort);
    const { deleteItem } = useDeleteBookSeries();
    const [deleting, setDeleting] = useState<boolean>(false);
    const [deletingError, setDeletingError] = useState<string>();
    const [openNewModal, setOpenNewModal] = useState<boolean>(false);

    async function deleteHandler(item: BookSeriesEntity) {
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
                         renderKey={(item: BookSeriesEntity) => item.id}
                         onSort={(sort: TableSort) => setSort(sort)}
                         sort={sort}
                         onRowClick={item => setSelectedItem(item)}></CustomTable>

            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2, background: 'white', 'z-index': 2 }}>
                <Button variant="outlined" onClick={() => onAdd()}>
                    <AddIcon></AddIcon>Додати серію
                </Button>
            </Box>

            {(openNewModal || selectedItem) &&
              <BookSeriesModal open={true}
                               item={selectedItem}
                               onClose={(updated = false) => refreshData(updated)}></BookSeriesModal>}
        </Loading>
    );
}