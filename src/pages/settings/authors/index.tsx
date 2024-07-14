import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { ApolloError } from '@apollo/client';

import { useAuthors, useDeleteAuthor } from '@/lib/graphql/hooks';
import { AuthorEntity, IPageable } from '@/lib/data/types';
import CustomTable from '@/components/table/custom-table';
import { TableActionEnum, TableKey } from '@/components/table/table-key';
import Loading from '@/components/loading';
import AuthorModal from '@/components/modals/author-modal';
import ErrorNotification from '@/components/error-notification';
import { NameFiltersPanel } from '@/components/filters/name-filters-panel';

export default function Authors() {
    const [tableKeys] = useState<TableKey<AuthorEntity>[]>([
        { title: 'Name', sortValue: 'name', renderValue: (item: AuthorEntity) => item.name, type: 'text' },
        { title: 'Description', renderValue: (item: AuthorEntity) => item.description, type: 'text' },
        {
            type: 'actions',
            actions: [
                {
                    type: TableActionEnum.delete,
                    onClick: (item: AuthorEntity) => deleteHandler(item)
                }
            ]
        }
    ]);
    const [selectedItem, setSelectedItem] = useState<AuthorEntity>();
    const [pageSettings, setPageSettings] = useState<IPageable>({ order: 'asc', orderBy: '' });
    const [filters, setFilters] = useState<AuthorEntity>();
    const { items, gettingError, loading, refetch } = useAuthors(pageSettings, filters);
    const { deleting, deleteItem, deletingError } = useDeleteAuthor();
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

    async function deleteHandler(item: AuthorEntity) {
        try {
            deleteItem(item.id)
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

    function onEdit(item: AuthorEntity) {
        setError(null);
        setSelectedItem(item);
    }

    return (
        <Loading open={loading || deleting} fullHeight={true}>
            <NameFiltersPanel onApply={(filters: AuthorEntity) => setFilters(filters)}></NameFiltersPanel>

            <CustomTable data={items} keys={tableKeys}
                         renderKey={(item: AuthorEntity) => item.id}
                         onChange={(pageSettings: IPageable) => setPageSettings(pageSettings)}
                         pageSettings={pageSettings}
                         withFilters={true}
                         onRowClick={(item: AuthorEntity) => onEdit(item)}></CustomTable>

            {error && <ErrorNotification error={error}></ErrorNotification>}

            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2, background: 'white', 'z-index': 2 }}>
                <Button variant="outlined" onClick={() => onAdd()}>
                    <AddIcon></AddIcon>Add author
                </Button>
            </Box>

            {(openNewModal || selectedItem) &&
              <AuthorModal open={true}
                           item={selectedItem}
                           onClose={(updated = false) => refreshData(updated)}></AuthorModal>}
        </Loading>
    );
}