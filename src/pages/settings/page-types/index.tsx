import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { ApolloError } from '@apollo/client';

import { useDeletePageType, usePageTypes } from '@/lib/graphql/hooks';
import { IPageable, PageTypeEntity } from '@/lib/data/types';
import CustomTable from '@/components/table/custom-table';
import { TableActionEnum, TableKey } from '@/components/table/table-key';
import Loading from '@/components/loading';
import PageTypeModal from '@/components/modals/page-type-modal';
import ErrorNotification from '@/components/error-notification';
import { NameFiltersPanel } from '@/components/filters/name-filters-panel';
import { styleVariables } from '@/constants/styles-variables';
import { isAdmin } from '@/utils/utils';
import { useAuth } from '@/components/auth-context';

export default function PageTypes() {
    const { user, checkAuth } = useAuth();
    const [tableActions] = useState<TableKey<PageTypeEntity>>({
        renderMobileLabel: (item: PageTypeEntity) => <Box><b>{item.name}</b></Box>,
        type: 'actions',
        actions: isAdmin(user) ? [
            {
                type: TableActionEnum.delete,
                onClick: (item: PageTypeEntity) => deleteHandler(item)
            }
        ] : []
    });
    const [tableKeys] = useState<TableKey<PageTypeEntity>[]>([
        {
            title: 'Name',
            sortValue: 'name',
            renderValue: (item: PageTypeEntity) => item.name,
            type: 'text',
            mobileStyleClasses: styleVariables.boldFont
        }
    ]);
    const [selectedItem, setSelectedItem] = useState<PageTypeEntity>();
    const [pageSettings, setPageSettings] = useState<IPageable>({ order: 'asc', orderBy: '' });
    const [filters, setFilters] = useState<PageTypeEntity>();
    const { items, gettingError, loading, refetch } = usePageTypes(pageSettings, filters);
    const { deleting, deleteItem, deletingError } = useDeletePageType();
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

    async function deleteHandler(item: PageTypeEntity) {
        try {
            await deleteItem(item.id);
            refreshData();
        } catch (err) {
            checkAuth(err);
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

    function onEdit(item: PageTypeEntity) {
        setError(null);
        setSelectedItem(item);
    }

    return (
        <Loading show={loading || deleting} fullHeight={true}>
            <NameFiltersPanel onApply={(filters: PageTypeEntity) => setFilters(filters)}></NameFiltersPanel>

            <CustomTable data={items}
                         keys={tableKeys}
                         mobileKeys={[]}
                         actions={tableActions}
                         renderKey={(item: PageTypeEntity) => item.id}
                         onChange={(pageSettings: IPageable) => setPageSettings(pageSettings)}
                         pageSettings={pageSettings}
                         withFilters={true}
                         onRowClick={(item: PageTypeEntity) => onEdit(item)}></CustomTable>

            {error && <ErrorNotification error={error}></ErrorNotification>}

            {isAdmin(user) &&
              <Box sx={styleVariables.buttonsContainer}>
                <Button variant="outlined" onClick={() => onAdd()}>
                  <AddIcon></AddIcon>Add Page Type
                </Button>
              </Box>}

            {(openNewModal || selectedItem) &&
              <PageTypeModal open={true}
                             item={selectedItem}
                             onClose={(updated = false) => refreshData(updated)}></PageTypeModal>}
        </Loading>
    );
}