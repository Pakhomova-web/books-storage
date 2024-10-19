import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import React, { useEffect, useState } from 'react';
import { ApolloError } from '@apollo/client';

import { useBookTypes, useDeleteBookType } from '@/lib/graphql/queries/book-type/hook';
import { BookTypeEntity, IPageable } from '@/lib/data/types';
import CustomTable from '@/components/table/custom-table';
import { TableActionEnum, TableKey } from '@/components/table/table-key';
import Loading from '@/components/loading';
import BookTypeModal from '@/components/modals/book-type-modal';
import ErrorNotification from '@/components/error-notification';
import { NameFiltersPanel } from '@/components/filters/name-filters-panel';
import { pageStyles, positionRelative, styleVariables } from '@/constants/styles-variables';
import { isAdmin } from '@/utils/utils';
import { useAuth } from '@/components/auth-context';

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
            title: 'Name',
            sortValue: 'name',
            renderValue: (item: BookTypeEntity) => item.name,
            type: 'text',
            mobileStyleClasses: styleVariables.boldFont
        }
    ]);
    const [selectedItem, setSelectedItem] = useState<BookTypeEntity>();
    const [pageSettings, setPageSettings] = useState<IPageable>({ order: 'asc', orderBy: '' });
    const [filters, setFilters] = useState<BookTypeEntity>();
    const { items, gettingError, loading, refetch } = useBookTypes(pageSettings, filters);
    const { deleteItem, deleting, deletingError } = useDeleteBookType();
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

    function onEdit(item: BookTypeEntity) {
        setError(null);
        setSelectedItem(item);
    }

    return (
        <Box sx={positionRelative}>
            <Loading show={loading || deleting}></Loading>

            {isAdmin(user) &&
              <Box sx={pageStyles}>
                <NameFiltersPanel tableKeys={tableKeys}
                                  onApply={(filters: BookTypeEntity) => setFilters(filters)}
                                  pageSettings={pageSettings}
                                  onSort={(pageSettings: IPageable) => setPageSettings(pageSettings)}></NameFiltersPanel>

                <CustomTable data={items}
                             keys={tableKeys}
                             mobileKeys={[]}
                             actions={tableActions}
                             renderKey={(item: BookTypeEntity) => item.id}
                             onChange={(pageSettings: IPageable) => setPageSettings(pageSettings)}
                             pageSettings={pageSettings}
                             withFilters={true}
                             onRowClick={(item: BookTypeEntity) => onEdit(item)}>
                    {error && <ErrorNotification error={error}></ErrorNotification>}

                    {isAdmin(user) &&
                      <Box sx={styleVariables.buttonsContainer}>
                        <Button variant="outlined" onClick={() => onAdd()}>
                          <AddIcon></AddIcon>Add Book Type
                        </Button>
                      </Box>}
                </CustomTable>

                  {(openNewModal || selectedItem) &&
                    <BookTypeModal open={true}
                                   item={selectedItem}
                                   isAdmin={isAdmin(user)}
                                   onClose={(updated = false) => refreshData(updated)}></BookTypeModal>}
              </Box>
            }
        </Box>
    );
}