import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ApolloError } from '@apollo/client';

import { useBookTypes, useDeleteBookType } from '@/lib/graphql/queries/book-type/hook';
import { BookTypeEntity, DeliveryEntity, IPageable } from '@/lib/data/types';
import CustomTable from '@/components/table/custom-table';
import { TableActionEnum, TableKey } from '@/components/table/table-key';
import Loading from '@/components/loading';
import BookTypeModal from '@/components/modals/book-type-modal';
import ErrorNotification from '@/components/error-notification';
import { NameFiltersPanel } from '@/components/filters/name-filters-panel';
import { styleVariables } from '@/constants/styles-variables';
import { isAdmin } from '@/utils/utils';
import { useAuth } from '@/components/auth-context';
import SettingsMenu from '@/pages/settings/settings-menu';
import Head from 'next/head';

export default function BookTypes() {
    const { user, checkAuth } = useAuth();
    const [tableActions] = useState<TableKey<BookTypeEntity>>({
        renderMobileLabel: (item: BookTypeEntity) => <Box><b>{item.name}</b></Box>,
        type: 'actions',
        actions: isAdmin(user) ? [
            {
                type: TableActionEnum.delete,
                onClick: async (item: BookTypeEntity) => {
                    try {
                        await deleteItem(item.id);
                        refreshData();
                    } catch (err) {
                        checkAuth(err);
                    }
                }
            }
        ] : []
    });
    const [tableKeys] = useState<TableKey<BookTypeEntity>[]>([
        {
            title: 'Назва',
            sortValue: 'name',
            renderValue: (item: BookTypeEntity) => item.name,
            type: 'text',
            mobileStyleClasses: styleVariables.boldFont
        },
        { type: 'image', title: 'Фото', renderValue: (item: DeliveryEntity) => item.imageId }
    ]);
    const [selectedItem, setSelectedItem] = useState<BookTypeEntity>();
    const [pageSettings, setPageSettings] = useState<IPageable>({
        order: 'asc',
        orderBy: '',
        rowsPerPage: 12,
        page: 0
    });
    const [filters, setFilters] = useState<BookTypeEntity>();
    const { items, totalCount, gettingError, loading, refetch } = useBookTypes(pageSettings, filters);
    const { deleteItem, deleting, deletingError } = useDeleteBookType();
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

    function onEdit(item: BookTypeEntity) {
        setError(null);
        setSelectedItem(item);
    }

    return (
        <SettingsMenu activeUrl="book-types" onAddClick={onAdd}>
            <Head>
                <title>Налаштування - Типи книг</title>
            </Head>

            <Loading show={loading || deleting || loadingItems}></Loading>

            {isAdmin(user) &&
              <>
                <NameFiltersPanel totalCount={totalCount}
                                  onApply={(filters: BookTypeEntity) => {
                                      setPageSettings(prev => ({ ...prev, page: 0 }));
                                      setFilters(filters)
                                  }}
                                  pageSettings={pageSettings}
                                  onSort={(settings: IPageable) => setPageSettings(settings)}></NameFiltersPanel>

                <CustomTable data={items}
                             keys={tableKeys}
                             loading={loading || loadingItems}
                             totalCount={totalCount}
                             mobileKeys={[]}
                             actions={tableActions}
                             renderKey={(item: BookTypeEntity) => item.id}
                             onChange={(settings: IPageable) => setPageSettings(settings)}
                             pageSettings={pageSettings}
                             usePagination={true}
                             onRowClick={(item: BookTypeEntity) => onEdit(item)}>
                    {error && <ErrorNotification error={error}></ErrorNotification>}
                </CustomTable>

                  {(openNewModal || selectedItem) &&
                    <BookTypeModal open={true}
                                   item={selectedItem}
                                   isAdmin={isAdmin(user)}
                                   onClose={(updated = false) => refreshData(updated)}></BookTypeModal>}
              </>
            }
        </SettingsMenu>
    );
}