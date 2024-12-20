import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ApolloError } from '@apollo/client';

import { IPageable, PublishingHouseEntity } from '@/lib/data/types';
import Loading from '@/components/loading';
import CustomTable from '@/components/table/custom-table';
import { TableActionEnum, TableKey } from '@/components/table/table-key';
import { useDeletePublishingHouse, usePublishingHouses } from '@/lib/graphql/queries/publishing-house/hook';
import PublishingHouseModal from '@/components/modals/publishing-house-modal';
import ErrorNotification from '@/components/error-notification';
import { NameFiltersPanel } from '@/components/filters/name-filters-panel';
import { isAdmin } from '@/utils/utils';
import { useAuth } from '@/components/auth-context';
import SettingsMenu from '@/pages/settings/settings-menu';
import Head from 'next/head';

export default function PublishingHouses() {
    const { user, checkAuth } = useAuth();
    const [pageSettings, setPageSettings] = useState<IPageable>({
        order: 'asc',
        orderBy: '',
        rowsPerPage: 12,
        page: 0
    });
    const [filters, setFilters] = useState<PublishingHouseEntity>();
    const { items, totalCount, loading, gettingError, refetch } = usePublishingHouses(pageSettings, filters);
    const { deleting, deleteItem, deletingError } = useDeletePublishingHouse();
    const [selectedItem, setSelectedItem] = useState<PublishingHouseEntity>();
    const [tableActions] = useState<TableKey<PublishingHouseEntity>>({
        renderMobileLabel: (item: PublishingHouseEntity) => <Box><b>{item.name}</b></Box>,
        type: 'actions',
        actions: isAdmin(user) ? [
            {
                type: TableActionEnum.delete,
                onClick: (item: PublishingHouseEntity) => deleteHandler(item)
            }
        ] : []
    });
    const [mobileKeys] = useState<TableKey<PublishingHouseEntity>[]>([
        { type: 'image', title: 'Фото', renderValue: (item: PublishingHouseEntity) => item.imageId },
        { type: 'text', title: 'Теги', sortValue: 'tags', renderValue: (item: PublishingHouseEntity) => item.tags }
    ])
    const [tableKeys] = useState<TableKey<PublishingHouseEntity>[]>([
        { type: 'text', title: 'Назва', sortValue: 'name', renderValue: (item: PublishingHouseEntity) => item.name },
        ...mobileKeys
    ]);
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

    function deleteHandler(item: PublishingHouseEntity) {
        deleteItem(item.id).then(() => refreshData())
            .catch(err => checkAuth(err));
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

    function onEdit(item: PublishingHouseEntity) {
        setError(null);
        setSelectedItem(item);
    }

    return (
        <SettingsMenu activeUrl="publishing-houses" onAddClick={onAdd}>
            <Head>
                <title>Налаштування - Видавництва</title>
            </Head>

            <Loading show={loading || deleting || loadingItems}></Loading>

            {isAdmin(user) &&
              <>
                <NameFiltersPanel totalCount={totalCount}
                                  onApply={(filters: PublishingHouseEntity) => {
                                      setPageSettings(prev => ({ ...prev, page: 0 }));
                                      setFilters(filters)
                                  }}
                                  pageSettings={pageSettings}
                                  onSort={(settings: IPageable) => setPageSettings(settings)}></NameFiltersPanel>

                <CustomTable data={items}
                             keys={tableKeys}
                             loading={loading || loadingItems}
                             totalCount={totalCount}
                             mobileKeys={mobileKeys}
                             actions={tableActions}
                             renderKey={(item: PublishingHouseEntity) => item.id}
                             onChange={(settings: IPageable) => setPageSettings(settings)}
                             pageSettings={pageSettings}
                             usePagination={true}
                             onRowClick={(item: PublishingHouseEntity) => onEdit(item)}>
                    {error && <ErrorNotification error={error}></ErrorNotification>}
                </CustomTable>

                  {(selectedItem || openNewModal) &&
                    <PublishingHouseModal open={true}
                                          item={selectedItem}
                                          isAdmin={isAdmin(user)}
                                          onClose={(updated = false) => refreshData(updated)}></PublishingHouseModal>}
              </>
            }
        </SettingsMenu>
    );
}