import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ApolloError } from '@apollo/client';

import { useDeletePageType, usePageTypes } from '@/lib/graphql/queries/page-type/hook';
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
import SettingsMenu from '@/pages/settings/settings-menu';
import Head from 'next/head';

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
            title: 'Назва',
            sortValue: 'name',
            renderValue: (item: PageTypeEntity) => item.name,
            type: 'text',
            mobileStyleClasses: styleVariables.boldFont
        }
    ]);
    const [selectedItem, setSelectedItem] = useState<PageTypeEntity>();
    const [pageSettings, setPageSettings] = useState<IPageable>({
        order: 'asc',
        orderBy: '',
        rowsPerPage: 12,
        page: 0
    });
    const [filters, setFilters] = useState<PageTypeEntity>();
    const { items, totalCount, gettingError, loading } = usePageTypes(pageSettings, filters);
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
            setFilters({ ...filters });
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
        <SettingsMenu activeUrl="page-types" onAddClick={onAdd}>
            <Head>
                <title>Налаштування - Типи сторінок</title>
            </Head>

            <Loading show={loading || deleting}></Loading>

            {isAdmin(user) &&
              <>
                <NameFiltersPanel totalCount={totalCount}
                                  onApply={(filters: PageTypeEntity) => {
                                      setPageSettings(prev => ({ ...prev, page: 0 }));
                                      setFilters(filters)
                                  }}
                                  pageSettings={pageSettings}
                                  onSort={(settings: IPageable) => setPageSettings(settings)}></NameFiltersPanel>

                <CustomTable data={items}
                             keys={tableKeys}
                             totalCount={totalCount}
                             mobileKeys={[]}
                             actions={tableActions}
                             renderKey={(item: PageTypeEntity) => item.id}
                             onChange={(settings: IPageable) => setPageSettings(settings)}
                             pageSettings={pageSettings}
                             usePagination={true}
                             onRowClick={(item: PageTypeEntity) => onEdit(item)}>
                    {error && <ErrorNotification error={error}></ErrorNotification>}
                </CustomTable>

                  {(openNewModal || selectedItem) &&
                    <PageTypeModal open={true}
                                   item={selectedItem}
                                   isAdmin={isAdmin(user)}
                                   onClose={(updated = false) => refreshData(updated)}></PageTypeModal>}
              </>
            }
        </SettingsMenu>
    );
}