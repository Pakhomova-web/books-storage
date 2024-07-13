import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import { ApolloError } from '@apollo/client';

import { PublishingHouseEntity } from '@/lib/data/types';
import Loading from '@/components/loading';
import CustomTable from '@/components/table/custom-table';
import { TableKey, TableSort } from '@/components/table/table-key';
import { useDeletePublishingHouse, usePublishingHouses } from '@/lib/graphql/hooks';
import PublishingHouseModal from '@/components/modals/publishing-house-modal';
import ErrorNotification from '@/components/error-notification';

export default function PublishingHouses() {
    const { items, loading, gettingError, refetch } = usePublishingHouses();
    const { deleting, deleteItem, deletingError } = useDeletePublishingHouse();
    const [selectedItem, setSelectedItem] = useState<PublishingHouseEntity>();
    const [sort, setSort] = useState<TableSort>({ order: 'asc', orderBy: '' });
    const [tableKeys] = useState<TableKey<PublishingHouseEntity>[]>([
        { type: 'text', title: 'Name', sortValue: 'name', renderValue: (item: PublishingHouseEntity) => item.name },
        { type: 'text', title: 'Tags', sortValue: 'tags', renderValue: (item: PublishingHouseEntity) => item.tags },
        {
            type: 'icons',
            icons: [
                {
                    element: <DeleteIcon color="warning"/>, onIconClick: async (item: PublishingHouseEntity) => {
                        try {
                            await deleteItem(item.id);
                            refreshData(true);
                        } catch (err) {}
                    }
                }
            ]
        }
    ]);
    const [openNewModal, setOpenNewModal] = useState<boolean>(false);
    const [error, setError] = useState<ApolloError>();

    useEffect(() => {
        if (gettingError) {
            setError(gettingError);
        } else if (deletingError) {
            setError(deletingError);
        }
    }, [gettingError, deletingError]);

    function refreshData(updated: boolean) {
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

    function onEdit(item: PublishingHouseEntity) {
        setError(null);
        setSelectedItem(item);
    }

    return (
        <Loading open={loading || deleting} fullHeight={true}>
            <CustomTable keys={tableKeys}
                         data={items}
                         renderKey={(item: PublishingHouseEntity) => item.id}
                         onSort={(sort: TableSort) => setSort(sort)}
                         sort={sort}
                         onRowClick={(item: PublishingHouseEntity) => onEdit(item)}></CustomTable>

            {error && <ErrorNotification error={error}></ErrorNotification>}

            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <Button variant="outlined" onClick={() => onAdd()}>
                    <AddIcon></AddIcon>Add Publishing House
                </Button>
            </Box>

            {(selectedItem || openNewModal) &&
              <PublishingHouseModal open={true}
                                    item={selectedItem}
                                    onClose={(updated = false) => refreshData(updated)}></PublishingHouseModal>}
        </Loading>
    );
}