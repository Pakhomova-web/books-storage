import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ApolloError } from '@apollo/client';

import { useAuthors, useDeleteAuthor } from '@/lib/graphql/queries/author/hook';
import { AuthorEntity, IAuthorFilter, IPageable } from '@/lib/data/types';
import CustomTable from '@/components/table/custom-table';
import { TableActionEnum, TableKey } from '@/components/table/table-key';
import Loading from '@/components/loading';
import AuthorModal from '@/components/modals/author-modal';
import ErrorNotification from '@/components/error-notification';
import { useAuth } from '@/components/auth-context';
import { isAdmin } from '@/utils/utils';
import SettingsMenu from '@/pages/settings/settings-menu';
import { NameFiltersPanel } from '@/components/filters/name-filters-panel';
import Head from 'next/head';

export default function Authors() {
    const { user, checkAuth } = useAuth();
    const [tableActions] = useState<TableKey<IAuthorFilter>>({
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
        { title: 'Опис', renderValue: (item: AuthorEntity) => item.description, type: 'text' }
    ]);
    const [tableKeys] = useState<TableKey<AuthorEntity>[]>([
        { title: 'ПІБ', sortValue: 'name', renderValue: (item: AuthorEntity) => item.name, type: 'text' },
        ...mobileKeys
    ]);
    const [selectedItem, setSelectedItem] = useState<AuthorEntity>();
    const [pageSettings, setPageSettings] = useState<IPageable>({ order: 'asc', orderBy: '', rowsPerPage: 12, page: 0 });
    const [filters, setFilters] = useState<IAuthorFilter>();
    const { items, totalCount, gettingError, loading, refetch } = useAuthors(pageSettings, filters);
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
        <SettingsMenu activeUrl="authors" onAddClick={onAdd}>
            <Head>
                <title>Налаштування - Автора</title>
            </Head>

            <Loading show={loading || deleting}></Loading>

            {isAdmin(user) &&
              <>
                <NameFiltersPanel onApply={(filters: AuthorEntity) => setFilters(filters)}
                                  pageSettings={pageSettings}
                                  onSort={(pageSettings: IPageable) => setPageSettings(pageSettings)}></NameFiltersPanel>

                <CustomTable data={items}
                             keys={tableKeys}
                             mobileKeys={mobileKeys}
                             totalCount={totalCount}
                             actions={tableActions}
                             renderKey={(item: AuthorEntity) => item.id}
                             onChange={(pageSettings: IPageable) => setPageSettings(pageSettings)}
                             pageSettings={pageSettings}
                             usePagination={true}
                             onRowClick={(item: AuthorEntity) => onEdit(item)}>
                    {error && <ErrorNotification error={error}></ErrorNotification>}
                </CustomTable>

                  {(openNewModal || selectedItem) &&
                    <AuthorModal open={true}
                                 item={selectedItem}
                                 isAdmin={isAdmin(user)}
                                 onClose={(updated = false) => refreshData(updated)}></AuthorModal>}
              </>
            }
        </SettingsMenu>
    );
}