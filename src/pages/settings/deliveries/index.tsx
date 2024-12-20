import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ApolloError } from '@apollo/client';

import { useDeleteDelivery, useDeliveries } from '@/lib/graphql/queries/delivery/hook';
import { DeliveryEntity, IPageable } from '@/lib/data/types';
import CustomTable from '@/components/table/custom-table';
import { TableActionEnum, TableKey } from '@/components/table/table-key';
import Loading from '@/components/loading';
import DeliveryModal from '@/components/modals/delivery-modal';
import ErrorNotification from '@/components/error-notification';
import { NameFiltersPanel } from '@/components/filters/name-filters-panel';
import { styleVariables } from '@/constants/styles-variables';
import { isAdmin } from '@/utils/utils';
import { useAuth } from '@/components/auth-context';
import SettingsMenu from '@/pages/settings/settings-menu';
import Head from 'next/head';

export default function Deliveries() {
    const { user, checkAuth } = useAuth();
    const [tableActions] = useState<TableKey<DeliveryEntity>>({
        renderMobileLabel: (item: DeliveryEntity) => <Box><b>{item.name}</b></Box>,
        type: 'actions',
        actions: isAdmin(user) ? [
            {
                type: TableActionEnum.delete,
                onClick: (item: DeliveryEntity) => deleteHandler(item)
            }
        ] : []
    });
    const [tableKeys] = useState<TableKey<DeliveryEntity>[]>([
        {
            title: 'Назва',
            sortValue: 'name',
            renderValue: (item: DeliveryEntity) => item.name,
            type: 'text',
            mobileStyleClasses: styleVariables.boldFont
        },
        { type: 'image', title: 'Фото', renderValue: (item: DeliveryEntity) => item.imageId }
    ]);
    const [selectedItem, setSelectedItem] = useState<DeliveryEntity>();
    const [pageSettings, setPageSettings] = useState<IPageable>({
        order: 'asc',
        orderBy: '',
        rowsPerPage: 12,
        page: 0
    });
    const [filters, setFilters] = useState<DeliveryEntity>();
    const { items, totalCount, gettingError, loading, refetch } = useDeliveries(pageSettings, filters);
    const { deleteItem, deleting, deletingError } = useDeleteDelivery();
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

    function deleteHandler(item: DeliveryEntity) {
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

    function onEdit(item: DeliveryEntity) {
        setError(null);
        setSelectedItem(item);
    }

    return (
        <SettingsMenu activeUrl="deliveries" onAddClick={onAdd}>
            <Head>
                <title>Налаштування - Способи доставки</title>
            </Head>

            <Loading show={loading || deleting || loadingItems}></Loading>

            {isAdmin(user) &&
              <>
                <NameFiltersPanel totalCount={totalCount}
                                  onApply={(filters: DeliveryEntity) => {
                                      setPageSettings(prev => ({ ...prev, page: 0 }));
                                      setFilters(filters)
                                  }}
                                  pageSettings={pageSettings}
                                  onSort={(settings: IPageable) => setPageSettings(settings)}></NameFiltersPanel>

                <CustomTable data={items}
                             keys={tableKeys}
                             loading={loading || loadingItems}
                             mobileKeys={[]}
                             totalCount={totalCount}
                             actions={tableActions}
                             renderKey={(item: DeliveryEntity) => item.id}
                             onChange={(settings: IPageable) => setPageSettings(settings)}
                             pageSettings={pageSettings}
                             usePagination={true}
                             onRowClick={item => onEdit(item)}>
                    {error && <ErrorNotification error={error}></ErrorNotification>}
                </CustomTable>

                  {(openNewModal || selectedItem) &&
                    <DeliveryModal open={true}
                                   item={selectedItem}
                                   isAdmin={isAdmin(user)}
                                   onClose={(updated = false) => refreshData(updated)}></DeliveryModal>}
              </>
            }
        </SettingsMenu>
    );
}