import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { ApolloError } from '@apollo/client';

import { IPageable, LanguageEntity, PublishingHouseEntity } from '@/lib/data/types';
import Loading from '@/components/loading';
import CustomTable from '@/components/table/custom-table';
import { TableActionEnum, TableKey } from '@/components/table/table-key';
import { useDeletePublishingHouse, usePublishingHouses } from '@/lib/graphql/hooks';
import PublishingHouseModal from '@/components/modals/publishing-house-modal';
import ErrorNotification from '@/components/error-notification';
import { NameFiltersPanel } from '@/components/filters/name-filters-panel';

export default function PublishingHouses() {
    const { items, loading, gettingError, refetch } = usePublishingHouses();
    const { deleting, deleteItem, deletingError } = useDeletePublishingHouse();
    const [selectedItem, setSelectedItem] = useState<PublishingHouseEntity>();
    const [pageSettings, setPageSettings] = useState<IPageable>({ order: 'asc', orderBy: '' });
    const [tableKeys] = useState<TableKey<PublishingHouseEntity>[]>([
        { type: 'text', title: 'Name', sortValue: 'name', renderValue: (item: PublishingHouseEntity) => item.name },
        { type: 'text', title: 'Tags', sortValue: 'tags', renderValue: (item: PublishingHouseEntity) => item.tags },
        {
            type: 'actions',
            actions: [
                {
                    type: TableActionEnum.delete,
                    onClick: (item: PublishingHouseEntity) => deleteHandler(item)
                }
            ]
        }
    ]);
    const [openNewModal, setOpenNewModal] = useState<boolean>(false);
    const [error, setError] = useState<ApolloError>();
    const [filters, setFilters] = useState<LanguageEntity>();

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

    async function deleteHandler(item: LanguageEntity) {
        try {
            await deleteItem(item.id);
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

    function onEdit(item: PublishingHouseEntity) {
        setError(null);
        setSelectedItem(item);
    }

    return (
        <Loading open={loading || deleting} fullHeight={true}>
            <NameFiltersPanel onApply={(filters: LanguageEntity) => setFilters(filters)}></NameFiltersPanel>

            <CustomTable keys={tableKeys}
                         data={items}
                         renderKey={(item: PublishingHouseEntity) => item.id}
                         onChange={(pageSettings: IPageable) => setPageSettings(pageSettings)}
                         pageSettings={pageSettings}
                         withFilters={true}
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