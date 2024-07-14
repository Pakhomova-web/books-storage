import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { ApolloError } from '@apollo/client';

import { useDeletePageType, usePageTypes } from '@/lib/graphql/hooks';
import { IPageable, LanguageEntity, PageTypeEntity } from '@/lib/data/types';
import CustomTable from '@/components/table/custom-table';
import { TableActionEnum, TableKey } from '@/components/table/table-key';
import Loading from '@/components/loading';
import PageTypeModal from '@/components/modals/page-type-modal';
import ErrorNotification from '@/components/error-notification';
import { NameFiltersPanel } from '@/components/filters/name-filters-panel';

export default function PageTypes() {
    const [tableKeys] = useState<TableKey<PageTypeEntity>[]>([
        { title: 'Name', sortValue: 'name', renderValue: (item: PageTypeEntity) => item.name, type: 'text' },
        {
            type: 'actions',
            actions: [
                {
                    type: TableActionEnum.delete,
                    onClick: (item: PageTypeEntity) => deleteHandler(item)
                }
            ]
        }
    ]);
    const [selectedItem, setSelectedItem] = useState<PageTypeEntity>();
    const [pageSettings, setPageSettings] = useState<IPageable>({ order: 'asc', orderBy: '' });
    const { items, gettingError, loading, refetch } = usePageTypes(pageSettings);
    const { deleting, deleteItem, deletingError } = useDeletePageType();
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

    async function deleteHandler(item: PageTypeEntity) {
        try {
            await deleteItem(item.id);
            refreshData(true);
        } catch (err) {}
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

    function onEdit(item: PageTypeEntity) {
        setError(null);
        setSelectedItem(item);
    }

    return (
        <Loading open={loading || deleting} fullHeight={true}>
            <NameFiltersPanel onApply={(filters: LanguageEntity) => setFilters(filters)}></NameFiltersPanel>

            <CustomTable data={items} keys={tableKeys}
                         renderKey={(item: PageTypeEntity) => item.id}
                         onChange={(pageSettings: IPageable) => setPageSettings(pageSettings)}
                         pageSettings={pageSettings}
                         onRowClick={(item: PageTypeEntity) => onEdit(item)}></CustomTable>

            { error && <ErrorNotification error={error}></ErrorNotification>}

            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2, background: 'white', 'z-index': 2 }}>
                <Button variant="outlined" onClick={() => onAdd()}>
                    <AddIcon></AddIcon>Add Page Type
                </Button>
            </Box>

            {(openNewModal || selectedItem) &&
              <PageTypeModal open={true}
                             item={selectedItem}
                             onClose={(updated = false) => refreshData(updated)}></PageTypeModal>}
        </Loading>
    );
}