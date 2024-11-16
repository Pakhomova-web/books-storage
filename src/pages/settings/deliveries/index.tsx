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
    const [pageSettings, setPageSettings] = useState<IPageable>({ order: 'asc', orderBy: '' });
    const [filters, setFilters] = useState<DeliveryEntity>();
    const { items, gettingError, loading, refetch } = useDeliveries(pageSettings, filters);
    const { deleteItem, deleting, deletingError } = useDeleteDelivery();
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

    async function deleteHandler(item: DeliveryEntity) {
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

    function onEdit(item: DeliveryEntity) {
        setError(null);
        setSelectedItem(item);
    }

    return (
        <SettingsMenu activeUrl="deliveries" onAddClick={onAdd}>
            <Loading show={loading || deleting}></Loading>

            {isAdmin(user) &&
              <>
                <NameFiltersPanel tableKeys={tableKeys}
                                  onApply={(filters: DeliveryEntity) => setFilters(filters)}
                                  pageSettings={pageSettings}
                                  onSort={(pageSettings: IPageable) => setPageSettings(pageSettings)}></NameFiltersPanel>

                <CustomTable data={items}
                             keys={tableKeys}
                             mobileKeys={[]}
                             actions={tableActions}
                             renderKey={(item: DeliveryEntity) => item.id}
                             onChange={(pageSettings: IPageable) => setPageSettings(pageSettings)}
                             pageSettings={pageSettings}
                             withFilters={true}
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