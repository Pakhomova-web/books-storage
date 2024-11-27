import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ApolloError } from '@apollo/client';

import { useDeleteLanguage, useLanguages } from '@/lib/graphql/queries/language/hooks';
import { IPageable, LanguageEntity } from '@/lib/data/types';
import CustomTable from '@/components/table/custom-table';
import { TableActionEnum, TableKey } from '@/components/table/table-key';
import Loading from '@/components/loading';
import LanguageModal from '@/components/modals/language-modal';
import ErrorNotification from '@/components/error-notification';
import { NameFiltersPanel } from '@/components/filters/name-filters-panel';
import { styleVariables } from '@/constants/styles-variables';
import { isAdmin } from '@/utils/utils';
import { useAuth } from '@/components/auth-context';
import SettingsMenu from '@/pages/settings/settings-menu';
import Head from 'next/head';

export default function Languages() {
    const { user, checkAuth } = useAuth();
    const [tableActions] = useState<TableKey<LanguageEntity>>({
        renderMobileLabel: (item: LanguageEntity) => <Box><b>{item.name}</b></Box>,
        type: 'actions',
        actions: isAdmin(user) ? [
            {
                type: TableActionEnum.delete,
                onClick: (item: LanguageEntity) => deleteHandler(item)
            }
        ] : []
    });
    const [tableKeys] = useState<TableKey<LanguageEntity>[]>([
        {
            title: 'Назва',
            sortValue: 'name',
            renderValue: (item: LanguageEntity) => item.name,
            type: 'text',
            mobileStyleClasses: styleVariables.boldFont
        }
    ]);
    const [selectedItem, setSelectedItem] = useState<LanguageEntity>();
    const [pageSettings, setPageSettings] = useState<IPageable>({ order: 'asc', orderBy: '', rowsPerPage: 12, page: 0 });
    const [filters, setFilters] = useState<LanguageEntity>();
    const { items, totalCount, gettingError, loading, refetch } = useLanguages(pageSettings, filters);
    const { deleteItem, deleting, deletingError } = useDeleteLanguage();
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

    async function deleteHandler(item: LanguageEntity) {
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

    function onEdit(item: LanguageEntity) {
        setError(null);
        setSelectedItem(item);
    }

    return (
        <SettingsMenu activeUrl="languages" onAddClick={onAdd}>
            <Head>
                <title>Налаштування - Мови</title>
            </Head>

            <Loading show={loading || deleting}></Loading>

            {isAdmin(user) &&
              <>
                <NameFiltersPanel onApply={(filters: LanguageEntity) => setFilters(filters)}
                                  pageSettings={pageSettings}
                                  onSort={(pageSettings: IPageable) => setPageSettings(pageSettings)}></NameFiltersPanel>

                <CustomTable data={items}
                             keys={tableKeys}
                             mobileKeys={[]}
                             totalCount={totalCount}
                             actions={tableActions}
                             renderKey={(item: LanguageEntity) => item.id}
                             onChange={(pageSettings: IPageable) => setPageSettings(pageSettings)}
                             pageSettings={pageSettings}
                             usePagination={true}
                             onRowClick={item => onEdit(item)}>
                    {error && <ErrorNotification error={error}></ErrorNotification>}
                </CustomTable>

                  {(openNewModal || selectedItem) &&
                    <LanguageModal open={true}
                                   item={selectedItem}
                                   isAdmin={isAdmin(user)}
                                   onClose={(updated = false) => refreshData(updated)}></LanguageModal>}
              </>
            }
        </SettingsMenu>
    );
}