import { useAuth } from '@/components/auth-context';
import { TableActionEnum, TableKey } from '@/components/table/table-key';
import { IOrderFilter, IPageable, OrderEntity } from '@/lib/data/types';
import { isAdmin } from '@/utils/utils';
import React, { useEffect, useState } from 'react';
import { redLightColor } from '@/constants/styles-variables';
import { useDeleteOrder, useOrders } from '@/lib/graphql/queries/order/hook';
import { ApolloError } from '@apollo/client';
import Loading from '@/components/loading';
import CustomTable from '@/components/table/custom-table';
import ErrorNotification from '@/components/error-notification';
import { NameFiltersPanel } from '@/components/filters/name-filters-panel';
import OrderModal from '@/components/modals/order-modal';
import SettingsMenu from '@/pages/settings/settings-menu';

export default function Orders() {
    const { user, checkAuth } = useAuth();
    const tableActions: TableKey<OrderEntity> = {
        type: 'actions',
        actions: isAdmin(user) ? [
            {
                label: () => 'Видалити',
                type: TableActionEnum.delete,
                onClick: (item: OrderEntity) => deleteHandler(item)
            }
        ] : []
    };
    const [mobileKeys] = useState<TableKey<OrderEntity>[]>([
        {
            title: 'Ім\'я замовника',
            sortValue: 'firstName',
            renderValue: (item: OrderEntity) => item.firstName,
            type: 'text'
        },
        {
            title: 'Прізвище замовника',
            sortValue: 'lastName',
            renderValue: (item: OrderEntity) => item.lastName,
            type: 'text'
        },
        {
            title: 'Опис',
            sortValue: 'comment',
            renderValue: (item: OrderEntity) => item.comment,
            type: 'text'
        }
    ]);
    const [tableKeys] = useState<TableKey<OrderEntity>[]>([]);
    const [selectedItem, setSelectedItem] = useState<OrderEntity>();
    const [pageSettings, setPageSettings] = useState<IPageable>({
        order: 'asc', orderBy: '', page: 0, rowsPerPage: 5
    });
    const [filters, setFilters] = useState<IOrderFilter>();
    const { items, totalCount, gettingError, loading, refetch } = useOrders(pageSettings, filters);
    const { deleteItem, deletingError, deleting } = useDeleteOrder();
    const [openNewModal, setOpenNewModal] = useState<boolean>(false);
    const [openNumberInStockModal, setOpenNumberInStockModal] = useState<boolean>(false);
    const [error, setError] = useState<ApolloError>();
    const [downloadingCsv, setDownloadingCsv] = useState<boolean>(false);

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

    function highlightInRed(order: OrderEntity) {
        return !order.isPartlyPaid ? {
            background: redLightColor
        } : {};
    }

    async function deleteHandler(item: OrderEntity) {
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
        setOpenNumberInStockModal(false);
        setOpenNewModal(false);
        setSelectedItem(undefined);
    }

    function onAdd(parentItem?: OrderEntity) {
        setError(null);
        if (parentItem) {
            setSelectedItem(parentItem);
        } else {
            setOpenNewModal(true);
        }
    }

    function onEdit(item: OrderEntity) {
        setError(null);
        setSelectedItem(item);
        setOpenNewModal(true);
    }

    return (
        <SettingsMenu activeUrl="orders" onAddClick={onAdd}>
            <Loading show={loading || deleting || downloadingCsv}></Loading>

            {isAdmin(user) &&
              <>
                <NameFiltersPanel tableKeys={tableKeys}
                                  onApply={(filters: IOrderFilter) => setFilters(filters)}
                                  pageSettings={pageSettings}
                                  onSort={(pageSettings: IPageable) => setPageSettings(pageSettings)}></NameFiltersPanel>

                <CustomTable data={items}
                             keys={tableKeys}
                             mobileKeys={mobileKeys}
                             actions={tableActions}
                             renderKey={(item: OrderEntity) => item.id}
                             onChange={(settings: IPageable) => setPageSettings(settings)}
                             pageSettings={pageSettings}
                             usePagination={true}
                             withFilters={true}
                             rowStyleClass={(item: OrderEntity) => highlightInRed(item)}
                             totalCount={totalCount}
                             onRowClick={(item: OrderEntity) => onEdit(item)}>
                    {error && <ErrorNotification error={error}></ErrorNotification>}
                </CustomTable>

                  {openNewModal &&
                    <OrderModal open={openNewModal}
                                order={selectedItem}
                                onClose={(updated = false) => refreshData(updated)}></OrderModal>}
              </>
            }
        </SettingsMenu>
    );
}