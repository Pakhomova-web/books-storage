import { Box, Button } from '@mui/material';
import { useAuth } from '@/components/auth-context';
import { TableActionEnum, TableKey } from '@/components/table/table-key';
import { IOrderFilter, IPageable, OrderEntity } from '@/lib/data/types';
import { isAdmin } from '@/utils/utils';
import React, { useEffect, useState } from 'react';
import { pageStyles, positionRelative, styleVariables } from '@/constants/styles-variables';
import { useDeleteOrder, useOrders } from '@/lib/graphql/queries/order/hook';
import { ApolloError } from '@apollo/client';
import Loading from '@/components/loading';
import CustomTable from '@/components/table/custom-table';
import ErrorNotification from '@/components/error-notification';
import AddIcon from '@mui/icons-material/Add';
import { NameFiltersPanel } from '@/components/filters/name-filters-panel';
import OrderModal from '@/components/modals/order-modal';

export default function Orders() {
    const { user, checkAuth } = useAuth();
    const tableActions: TableKey<OrderEntity> = {
        type: 'actions',
        actions: isAdmin(user) ? [
            {
                label: 'Видалити',
                type: TableActionEnum.delete,
                onClick: (item: OrderEntity) => deleteHandler(item)
            }
        ] : []
    };
    const [mobileKeys] = useState<TableKey<OrderEntity>[]>([
        {
            title: 'Ім\'я замовника',
            sortValue: 'customerFirstName',
            renderValue: (item: OrderEntity) => item.customerFirstName,
            type: 'text'
        },
        {
            title: 'Прізвище замовника',
            sortValue: 'customerLastName',
            renderValue: (item: OrderEntity) => item.customerLastName,
            type: 'text'
        },
        {
            title: 'Опис',
            sortValue: 'description',
            renderValue: (item: OrderEntity) => item.description,
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
            background: styleVariables.redLightColor
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
        <Box sx={positionRelative}>
            <Loading show={loading || deleting || downloadingCsv}></Loading>

            {isAdmin(user) &&
              <Box sx={pageStyles}>
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

                    {isAdmin(user) &&
                      <Box sx={styleVariables.buttonsContainer}>
                        <Button variant="outlined" onClick={() => onAdd()}
                                sx={items.length ? { mr: styleVariables.margin } : {}}>
                          <AddIcon></AddIcon>Додати замовлення
                        </Button>
                      </Box>
                    }
                </CustomTable>

                  {openNewModal &&
                    <OrderModal open={openNewModal}
                                item={selectedItem}
                                isAdmin={isAdmin(user)}
                                onClose={(updated = false) => refreshData(updated)}></OrderModal>}
              </Box>
            }
        </Box>
    );
}