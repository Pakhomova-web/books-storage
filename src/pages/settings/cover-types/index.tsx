import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ApolloError } from '@apollo/client';

import { useCoverTypes, useDeleteCoverType } from '@/lib/graphql/queries/cover-type/hook';
import { CoverTypeEntity, IPageable } from '@/lib/data/types';
import CustomTable from '@/components/table/custom-table';
import { TableActionEnum, TableKey } from '@/components/table/table-key';
import Loading from '@/components/loading';
import CoverTypeModal from '@/components/modals/cover-type-modal';
import ErrorNotification from '@/components/error-notification';
import { NameFiltersPanel } from '@/components/filters/name-filters-panel';
import { styleVariables } from '@/constants/styles-variables';
import { isAdmin } from '@/utils/utils';
import { useAuth } from '@/components/auth-context';
import SettingsMenu from '@/pages/settings/settings-menu';
import Head from 'next/head';

export default function CoverTypes() {
    const { user, checkAuth } = useAuth();
    const [tableActions] = useState<TableKey<CoverTypeEntity>>({
        renderMobileLabel: (item: CoverTypeEntity) => <Box><b>{item.name}</b></Box>,
        type: 'actions',
        actions: isAdmin(user) ? [
            {
                type: TableActionEnum.delete,
                onClick: (item: CoverTypeEntity) => deleteHandler(item)
            }
        ] : []
    });
    const [tableKeys] = useState<TableKey<CoverTypeEntity>[]>([
        {
            title: 'Назва',
            sortValue: 'name',
            renderValue: (item: CoverTypeEntity) => item.name,
            type: 'text',
            mobileStyleClasses: styleVariables.boldFont
        }
    ]);
    const [selectedItem, setSelectedItem] = useState<CoverTypeEntity>();
    const [pageSettings, setPageSettings] = useState<IPageable>({
        order: 'asc',
        orderBy: '',
        rowsPerPage: 12,
        page: 0
    });
    const [filters, setFilters] = useState<CoverTypeEntity>();
    const { items, totalCount, gettingError, loading, refetch } = useCoverTypes(pageSettings, filters);
    const { deleteItem, deleting, deletingError } = useDeleteCoverType();
    const [openNewModal, setOpenNewModal] = useState<boolean>(false);
    const [error, setError] = useState<ApolloError>();
    const [loadingItems, setLoadingItems] = useState<boolean>(false);

    useEffect(() => {
        if (gettingError) {
            setError(gettingError);
        } else if (deletingError) {
            setError(deletingError);
        }
    }, [gettingError, deletingError]);

    async function deleteHandler(item: CoverTypeEntity) {
        try {
            await deleteItem(item.id);
            refreshData();
        } catch (err) {
            checkAuth(err);
        }
    }

    function refreshData(updated = true) {
        if (updated) {
            setLoadingItems(true);
            refetch(pageSettings, filters).then(() => setLoadingItems(false));
        }
        setError(null);
        setOpenNewModal(false);
        setSelectedItem(undefined);
    }

    function onAdd() {
        setError(null);
        setOpenNewModal(true);
    }

    function onEdit(item: CoverTypeEntity) {
        setError(null);
        setSelectedItem(item);
    }

    return (
        <SettingsMenu activeUrl="cover-types" onAddClick={onAdd}>
            <Head>
                <title>Налаштування - Типи обкладинок</title>
            </Head>

            <Loading show={loading || deleting || loadingItems}></Loading>

            {isAdmin(user) &&
              <>
                <NameFiltersPanel totalCount={totalCount}
                                  onApply={(filters: CoverTypeEntity) => {
                                      setPageSettings(prev => ({ ...prev, page: 0 }));
                                      setFilters(filters)
                                  }}
                                  pageSettings={pageSettings}
                                  onSort={(settings: IPageable) => setPageSettings(settings)}></NameFiltersPanel>

                <CustomTable data={items}
                             keys={tableKeys}
                             mobileKeys={[]}
                             actions={tableActions}
                             renderKey={(item: CoverTypeEntity) => item.id}
                             onChange={(settings: IPageable) => setPageSettings(settings)}
                             pageSettings={pageSettings}
                             usePagination={true}
                             totalCount={totalCount}
                             onRowClick={(item: CoverTypeEntity) => onEdit(item)}>
                    {error && <ErrorNotification error={error}></ErrorNotification>}
                </CustomTable>

                  {(openNewModal || selectedItem) &&
                    <CoverTypeModal open={true}
                                    item={selectedItem}
                                    isAdmin={isAdmin(user)}
                                    onClose={(updated = false) => refreshData(updated)}></CoverTypeModal>}
              </>
            }
        </SettingsMenu>
    );
}