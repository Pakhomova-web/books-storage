import { Box } from '@mui/material';
import React, { useState } from 'react';
import Head from 'next/head';
import { GroupDiscountEntity, IGroupDiscountFilter, IPageable } from '@/lib/data/types';
import Loading from '@/components/loading';
import ErrorNotification from '@/components/error-notification';
import SettingsMenu from '@/pages/settings/settings-menu';
import Pagination from '@/components/pagination';
import { useGroupDiscounts, useRemoveGroupDiscount } from '@/lib/graphql/queries/group-discounts/hook';
import GroupDiscountModal from '@/components/modals/group-discount-modal';
import { isAdmin } from '@/utils/utils';
import { useAuth } from '@/components/auth-context';
import GroupDiscountBox from '@/components/group-discount-box';
import { primaryLightColor } from '@/constants/styles-variables';
import { useRouter } from 'next/router';

export default function GroupDiscounts() {
    const [pageSettings, setPageSettings] = useState<IPageable>({ page: 0, rowsPerPage: 6 });
    const [filters, setFilters] = useState<IGroupDiscountFilter>();
    const { items, totalCount, loading, gettingError, refetch } = useGroupDiscounts(pageSettings, filters);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<GroupDiscountEntity>();
    const { deleteItem, deleting, deletingError } = useRemoveGroupDiscount();
    const [refetching, setRefetching] = useState<boolean>(false);
    const { user } = useAuth();
    const router = useRouter();

    function onPageChange(val: number) {
        setPageSettings({
            ...pageSettings,
            page: val
        });
    }

    function onRowsPerPageChange(val: number) {
        setPageSettings({
            ...pageSettings,
            page: 0,
            rowsPerPage: val
        });
    }

    function onRemove(id: string) {
        deleteItem(id).then(() => refetch(pageSettings, filters))
            .catch(() => {
            });
    }

    function onAddClick() {
        setOpenModal(true);
    }

    function onEditClick(item: GroupDiscountEntity) {
        setSelectedItem(item);
        setOpenModal(true);
    }

    function onCloseModal(updated: boolean) {
        if (updated) {
            setRefetching(true);
            refetch(pageSettings, filters)
                .then(() => setRefetching(false))
                .catch(() => setRefetching(false));
        }
        setOpenModal(false);
        setSelectedItem(null);
    }

    return (
        <SettingsMenu activeUrl="group-discounts" onAddClick={onAddClick}>
            <Head>
                <title>Налаштування - Групові знижки</title>
            </Head>

            <Loading show={loading || deleting || refetching}></Loading>

            {!!items?.length && items.map((item, index) => (
                <Box key={index} borderBottom={1} borderColor={primaryLightColor}>
                    <GroupDiscountBox onDeleteGroupClick={() => onRemove(item.id)}
                                      onEditBook={() => onEditClick(item)}
                                      onBookClick={(bookId: string) => router.push(`/books/details?id=${bookId}&pageUrl=/settings/group-discounts`)}
                                      discount={item.discount}
                                      books={item.books}/>
                </Box>
            ))}

            {!!gettingError && <ErrorNotification error={gettingError}></ErrorNotification>}
            {!!deletingError && <ErrorNotification error={deletingError}></ErrorNotification>}

            <Pagination rowsPerPage={pageSettings.rowsPerPage} count={totalCount}
                        page={pageSettings.page} onRowsPerPageChange={onRowsPerPageChange}
                        onPageChange={onPageChange}/>

            {(!!openModal || !!selectedItem) &&
              <GroupDiscountModal onClose={updated => onCloseModal(updated)} item={selectedItem}
                                  isAdmin={isAdmin(user)}/>}
        </SettingsMenu>
    );
}
