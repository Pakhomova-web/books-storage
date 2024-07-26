import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import React, { useEffect, useState } from 'react';
import { ApolloError } from '@apollo/client';

import { useAuthors, useDeleteAuthor } from '@/lib/graphql/hooks';
import { AuthorEntity, IPageable } from '@/lib/data/types';
import CustomTable from '@/components/table/custom-table';
import { TableActionEnum, TableKey } from '@/components/table/table-key';
import Loading from '@/components/loading';
import AuthorModal from '@/components/modals/author-modal';
import ErrorNotification from '@/components/error-notification';
import { NameFiltersPanel } from '@/components/filters/name-filters-panel';
import { useAuth } from '@/components/auth-context';
import { isAdmin } from '@/utils/utils';
import { pageStyles, positionRelative, styleVariables } from '@/constants/styles-variables';

export default function Authors() {
    const { user, checkAuth } = useAuth();
    const [tableActions] = useState<TableKey<AuthorEntity>>({
        renderMobileLabel: (item: AuthorEntity) => <Box><b>{item.name}</b></Box>,
        type: 'actions',
        actions: isAdmin(user) ? [
            {
                type: TableActionEnum.delete,
                onClick: (item: AuthorEntity) => deleteHandler(item)
            }
        ] : []
    });
    const [mobileKeys] = useState<TableKey<AuthorEntity>[]>([
        { title: 'Description', renderValue: (item: AuthorEntity) => item.description, type: 'text' }
    ]);
    const [tableKeys] = useState<TableKey<AuthorEntity>[]>([
        { title: 'Name', sortValue: 'name', renderValue: (item: AuthorEntity) => item.name, type: 'text' },
        ...mobileKeys
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

    function onEdit(item: AuthorEntity) {
        setError(null);
        setSelectedItem(item);
    }

    return (
        <Box sx={positionRelative}>
            <Loading show={loading || deleting} fullHeight={true}></Loading>

            <Box sx={pageStyles}>
                <NameFiltersPanel onApply={(filters: AuthorEntity) => setFilters(filters)}></NameFiltersPanel>

                <CustomTable data={items}
                             keys={tableKeys}
                             mobileKeys={mobileKeys}
                             actions={tableActions}
                             renderKey={(item: AuthorEntity) => item.id}
                             onChange={(pageSettings: IPageable) => setPageSettings(pageSettings)}
                             pageSettings={pageSettings}
                             withFilters={true}
                             onRowClick={(item: AuthorEntity) => onEdit(item)}>
                    {error && <ErrorNotification error={error}></ErrorNotification>}

                    {isAdmin(user) &&
                      <Box sx={styleVariables.buttonsContainer}>
                        <Button variant="outlined" onClick={() => onAdd()}>
                          <AddIcon></AddIcon>Add author
                        </Button>
                      </Box>}
                </CustomTable>

                {(openNewModal || selectedItem) &&
                  <AuthorModal open={true}
                               item={selectedItem}
                               onClose={(updated = false) => refreshData(updated)}></AuthorModal>}
            </Box>
        </Box>
    );
}