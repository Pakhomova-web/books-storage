import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useForm } from 'react-hook-form-mui';
import { useRouter } from 'next/router';

import { GroupDiscountEntity, IGroupDiscountFilter, IOption, IPageable } from '@/lib/data/types';
import Loading from '@/components/loading';
import ErrorNotification from '@/components/error-notification';
import SettingsMenu from '@/pages/settings/settings-menu';
import Pagination from '@/components/pagination';
import { useGroupDiscounts, useRemoveGroupDiscount } from '@/lib/graphql/queries/group-discounts/hook';
import GroupDiscountModal from '@/components/modals/group-discount-modal';
import { isAdmin } from '@/utils/utils';
import { useAuth } from '@/components/auth-context';
import GroupDiscountBox from '@/components/group-discount-box';
import { primaryLightColor, styleVariables } from '@/constants/styles-variables';
import SortFiltersContainer from '@/components/filters/sort-filters-container';
import CustomTextField from '@/components/form-fields/custom-text-field';
import CustomLink from '@/components/custom-link';
import { getBookNamesByQuickSearch } from '@/lib/graphql/queries/book/hook';

interface IForm {
    fullBooks?: IOption<string>[],
    books?: string[],
    bookSearch?: string
}

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
    const formContext = useForm<IForm>();
    const { bookSearch, fullBooks } = formContext.watch();
    const [loadingBookOptions, setLoadingBookOptions] = useState<boolean>(false);
    const [bookOptions, setBookOptions] = useState<IOption<string>[]>([]);

    useEffect(() => {
        if (bookSearch?.length > 2) {
            setLoadingBookOptions(true);
            getBookNamesByQuickSearch(bookSearch)
                .then(items => {
                    setLoadingBookOptions(false);
                    setBookOptions(items);
                })
                .catch(() => setLoadingBookOptions(false));
        } else {
            setBookOptions([]);
        }
    }, [bookSearch]);

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

    function onClearFilter() {
        formContext.reset();
        onApply();
    }

    function onApply() {
        setFilters({ books: formContext.getValues().books });
    }

    function onAddBookClick(book: IOption<string>) {
        const books = formContext.getValues().books || [];

        formContext.setValue('books', books ? [...books, book.id] : [book.id]);
        formContext.setValue('fullBooks', fullBooks ? [...fullBooks, book] : [book]);
    }

    function onRemoveBookClick(book: IOption<string>) {
        const books = formContext.getValues().books || [];

        formContext.setValue('books', books ? books.filter(id => id !== book.id) : []);
        formContext.setValue('fullBooks', fullBooks ? fullBooks.filter(({ id }) => id !== book.id) : []);
    }

    return (
        <SettingsMenu activeUrl="group-discounts" onAddClick={onAddClick}>
            <Head>
                <title>Налаштування - Групові знижки</title>
            </Head>

            <Loading show={loading || deleting || refetching}></Loading>

            <SortFiltersContainer pageSettings={pageSettings}
                                  totalCount={totalCount}
                                  formContext={formContext}
                                  onApply={() => onApply()}
                                  onClear={() => onClearFilter()}
                                  onSort={(settings: IPageable) => setPageSettings(settings)}>
                <Box display="flex" flexDirection="column" gap={2}>
                    <CustomTextField fullWidth name="bookSearch"
                                     id="bookSearch"
                                     label="Пошук книги по назві"
                                     helperText="Введіть як мін. 3 літери"/>

                    <Box display="flex" flexDirection="column" gap={2} position="relative" mb={1}>
                        <Loading show={loadingBookOptions} isSmall={true}/>
                        {bookOptions.map((book, index) => (
                            <CustomLink key={index} onClick={() => onAddBookClick(book)}>
                                {book.label}{!!book.description ? ` (${book.description})` : ''}
                            </CustomLink>
                        ))}
                    </Box>

                    {!!fullBooks?.length &&
                      <Box display="flex" flexDirection="column" gap={2} position="relative" mb={1}>
                        <Box sx={styleVariables.sectionTitle}>Обрані книжки, натисніть, щоб видалити</Box>
                          {fullBooks.map((book, index) => (
                              <CustomLink key={index} onClick={() => onRemoveBookClick(book)}>
                                  {book.label}{!!book.description ? ` (${book.description})` : ''}
                              </CustomLink>
                          ))}
                      </Box>}
                </Box>
            </SortFiltersContainer>

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
