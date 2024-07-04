import { useDeletePublishingHouse, usePublishingHouses } from '@/lib/graphql/hooks';
import CustomTable from '@/components/table/custom-table';
import { TableKey, TableSort } from '@/components/table/table-key';
import { LanguageEntity, PublishingHouseEntity } from '@/lib/data/types';
import DeleteIcon from '@mui/icons-material/Delete';
import Loading from '@/components/loading';
import { useState } from 'react';
import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PublishingHouseModal from '@/components/modals/publishing-house-modal';

export default function PublishingHouses() {
    const { items, loading, error, refetch } = usePublishingHouses();
    const { loading: deleting, deleteItem } = useDeletePublishingHouse();
    const [selectedItem, setSelectedItem] = useState<LanguageEntity>();
    const [sort, setSort] = useState<TableSort>({ order: 'asc', orderBy: '' });
    const [tableKeys] = useState<TableKey<PublishingHouseEntity>[]>([
        { type: 'text', title: 'Назва', sortValue: 'name', renderValue: (item: PublishingHouseEntity) => item.name },
        {
            type: 'icons',
            icons: [
                {
                    element: <DeleteIcon color="warning"/>, onIconClick: async (item: PublishingHouseEntity) => {
                        await deleteItem(item.id);
                        refreshData(true);
                    }
                }
            ]
        }
    ]);
    const [openNewModal, setOpenNewModal] = useState<boolean>(false);

    function onAdd() {
        setOpenNewModal(true);
    }

    function refreshData(updated: boolean) {
        if (updated) {
            refetch();
        }
        setOpenNewModal(false);
        setSelectedItem(undefined);
    }

    if (error) {
        return <div>Error</div>;
    }

    return (
        <Loading open={loading || deleting} fullHeight={true}>
            <CustomTable keys={tableKeys}
                         data={items}
                         renderKey={(item: LanguageEntity) => item.id}
                         onSort={(sort: TableSort) => setSort(sort)}
                         sort={sort}
                         onRowClick={item => setSelectedItem(item)}></CustomTable>

            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <Button variant="outlined" onClick={() => onAdd()}>
                    <AddIcon></AddIcon>Додати видавництво
                </Button>
            </Box>

            {(selectedItem || openNewModal) &&
              <PublishingHouseModal open={true}
                                    item={selectedItem}
                                    onClose={(updated = false) => refreshData(updated)}></PublishingHouseModal>}
        </Loading>
    );
}