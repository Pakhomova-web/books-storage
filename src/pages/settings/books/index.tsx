import React, { useEffect, useState } from 'react';
import SettingsMenu from '@/pages/settings/settings-menu';
import Loading from '@/components/loading';
import { downloadCsv, isAdmin, renderPrice } from '@/utils/utils';
import { Box, Button } from '@mui/material';
import { redLightColor, styleVariables } from '@/constants/styles-variables';
import { BookFilters } from '@/components/filters/book-filters';
import { BookEntity, BookFilter, IPageable } from '@/lib/data/types';
import CustomTable from '@/components/table/custom-table';
import ErrorNotification from '@/components/error-notification';
import BookModal from '@/components/modals/book-modal';
import { BookNumberInStockModal } from '@/components/modals/book-number-in-stock-modal';
import { useAuth } from '@/components/auth-context';
import { getAllBooks, useBooks, useUpdateBook } from '@/lib/graphql/queries/book/hook';
import { TableActionEnum, TableKey } from '@/components/table/table-key';
import CustomImage from '@/components/custom-image';
import HdrStrongIcon from '@mui/icons-material/HdrStrong';
import HdrWeakIcon from '@mui/icons-material/HdrWeak';
import { ApolloError } from '@apollo/client';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AddExpenseModal from '@/components/modals/add-expense-modal';

const subTitleStyles = {
    ...styleVariables.hintFontSize,
    display: 'flex'
};

export default function Books() {
    const { user } = useAuth();
    const { update, updating, updatingError } = useUpdateBook();
    const router = useRouter();
    const tableActions: TableKey<BookEntity> = {
        renderMobileLabel: (item: BookEntity) => (
            <>
                <Box sx={subTitleStyles} mx={1}>
                    <Box height={75} width={100} mr={1}>
                        <CustomImage imageId={item.imageIds[0]} isBookDetails={true}></CustomImage></Box>
                    <Box display="flex" flexDirection="column" gap={1}>
                        <Box>{item.bookSeries.publishingHouse.name}</Box>
                        <Box>{item.bookSeries.name}</Box>
                    </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={1} mb={1} sx={styleVariables.hintFontSize}>
                    {item.numberInStock ?
                        <>
                            <HdrStrongIcon fontSize="small" style={{ color: "green" }}/>
                            В наявності ({item.numberInStock})
                        </> :
                        <><HdrWeakIcon fontSize="small" style={{ color: styleVariables.warnColor }}/>
                            Немає в наявності</>
                    }
                </Box>
            </>
        ),
        type: 'actions',
        actions: isAdmin(user) ? [
            {
                label: () => 'Скопіювати',
                type: TableActionEnum.copy,
                onClick: (item: BookEntity) => {
                    const data = new BookEntity({ ...item, name: null, id: null, imageIds: [] });

                    onAdd(data);
                }
            },
            {
                label: () => 'Деталі',
                type: TableActionEnum.navigation,
                onClick: (item: BookEntity) => router.push(`/books/details?id=${item.id}`)
            },
            {
                label: (item: BookEntity) => item.archived ? 'Разархівувати' : 'Заархівувати',
                type: TableActionEnum.delete,
                onClick: (item: BookEntity) => {
                    update({ ...item.dataToUpdate, archived: !item.archived }).then(() => refreshData()).catch();
                }
            }
        ] : []
    };
    const [mobileKeys] = useState<TableKey<BookEntity>[]>([
        {
            title: 'Назва',
            sortValue: 'name',
            renderValue: (item: BookEntity) => item.name,
            type: 'text',
            mobileStyleClasses: { ...styleVariables.boldFont, ...styleVariables.mobileBigFontSize }
        },
        {
            title: 'Активна',
            sortValue: 'archived',
            renderValue: (item: BookEntity) => !item.archived ? 'Так' : 'Ні',
            type: 'text'
        },
        {
            title: 'Cторінки / Обкладинка',
            sortValue: 'numberOfPages',
            renderValue: (item: BookEntity) => `${item.numberOfPages} / ${item.pageType?.name} / ${item.coverType?.name}`,
            type: 'text'
        },
        {
            title: 'Мова',
            renderValue: (item: BookEntity) => item.languages?.map(l => l.name).join(', '),
            type: 'text'
        },
        {
            title: 'Автори',
            renderValue: (item: BookEntity) => item.authors?.map(author => author.name).join(', '),
            type: 'text'
        },
        {
            title: 'Ціна',
            sortValue: 'priceWithDiscount',
            renderValue: (item: BookEntity) => renderPrice(item.price, 0, false),
            type: 'text'
        },
        { title: 'Знижка', renderValue: (item: BookEntity) => item.discount, type: 'text' }
    ]);
    const [tableKeys] = useState<TableKey<BookEntity>[]>([
        {
            type: 'image',
            title: 'Фото',
            renderValue: (item: BookEntity) => item.imageIds?.length ? item.imageIds[0] : null
        },
        {
            title: 'Видавництво/Серія',
            renderValue: (item: BookEntity) => `${item.bookSeries?.publishingHouse?.name}/${item.bookSeries?.name}`,
            type: 'text'
        },
        ...mobileKeys,
        {
            title: 'Кільк.',
            sortValue: 'numberInStock',
            renderValue: (item: BookEntity) => item.numberInStock,
            type: 'text'
        }
    ]);
    const [selectedItem, setSelectedItem] = useState<BookEntity>();
    const [pageSettings, setPageSettings] = useState<IPageable>({
        order: 'asc', orderBy: '', page: 0, rowsPerPage: 6
    });
    const [filters, setFilters] = useState<BookFilter>(new BookFilter({ ...(router.query as Object), archived: null }));
    const { items, totalCount, gettingError, loading, refetch } = useBooks(pageSettings, filters);
    const [openBookModal, setOpenBookModal] = useState<boolean>(false);
    const [openExpensesModal, setOpenExpensesModal] = useState<boolean>(false);
    const [openNumberInStockModal, setOpenNumberInStockModal] = useState<boolean>(false);
    const [error, setError] = useState<ApolloError>();
    const [downloadingCsv, setDownloadingCsv] = useState<boolean>(false);
    const [loadingItems, setLoadingItems] = useState<boolean>(false);

    useEffect(() => {
        if (gettingError) {
            setError(gettingError);
        } else if (updatingError) {
            setError(updatingError);
        }
    }, [gettingError, updatingError]);

    useEffect(() => {
        const url = new URL(window.location.href);

        Object.keys(filters || {}).forEach(key => {
            if (filters[key] !== null && filters[key] !== undefined && (typeof filters[key] === 'boolean' || !!filters[key].length)) {
                url.searchParams.set(key, filters[key]);
            }
        });
        setPageSettings({ ...pageSettings, page: 0 });
        window.history.pushState(null, '', url.toString());
        refetch(pageSettings, filters);
    }, [filters]);

    function highlightInRed(numberInStock: number) {
        return !numberInStock ? {
            background: redLightColor
        } : {};
    }

    function refreshData(updated = true, bookSeriesId?: string) {
        setError(null);
        setOpenNumberInStockModal(false);
        setOpenBookModal(false);
        setSelectedItem(undefined);
        if (bookSeriesId) {
            setFilters(new BookFilter({ archived: null, bookSeries: [bookSeriesId] }));
        }
        if (updated) {
            setLoadingItems(true);
            refetch(pageSettings, filters).then(() => setLoadingItems(false));
        }
    }

    function onAdd(parentItem?: BookEntity) {
        setError(null);
        setSelectedItem(parentItem);
        setOpenBookModal(true);
    }

    function onEdit(item: BookEntity) {
        setError(null);
        setSelectedItem(item);
        setOpenBookModal(true);
    }

    async function onDownloadCSV() {
        setDownloadingCsv(true);
        getAllBooks({ ...pageSettings, page: 0, rowsPerPage: totalCount }, filters)
            .then(books => {
                downloadCsv<BookEntity>(books, tableKeys, new Date().toISOString());
                setDownloadingCsv(false);
            })
            .catch(err => {
                setError(err);
                setDownloadingCsv(false);
            });
    }

    function onAddNumberInStock() {
        setError(null);
        setOpenNumberInStockModal(true);
    }

    function onAddExpense() {
        setError(null);
        setOpenExpensesModal(true);
    }

    return (
        <SettingsMenu activeUrl="books" onAddClick={onAdd}>
            <Head>
                <title>Налаштування - Книги</title>
            </Head>

            <Loading show={loading || downloadingCsv || updating || loadingItems}></Loading>

            {isAdmin(user) &&
              <>
                <BookFilters totalCount={totalCount}
                             defaultValues={filters}
                             onApply={(filters: BookFilter) => setFilters(filters)}
                             pageSettings={pageSettings}
                             onSort={(settings: IPageable) => setPageSettings(settings)}></BookFilters>

                <CustomTable data={items}
                             loading={loading || loadingItems}
                             keys={tableKeys}
                             mobileKeys={mobileKeys}
                             actions={tableActions}
                             renderKey={(item: BookEntity) => item.id}
                             onChange={(settings: IPageable) => setPageSettings(settings)}
                             pageSettings={pageSettings}
                             usePagination={true}
                             rowStyleClass={(item: BookEntity) => highlightInRed(item.numberInStock)}
                             totalCount={totalCount}
                             onRowClick={(item: BookEntity) => onEdit(item)}>
                </CustomTable>

                  {!loading && !updating && !downloadingCsv && error &&
                    <ErrorNotification error={error}></ErrorNotification>}

                  {isAdmin(user) &&
                    <Box sx={styleVariables.buttonsContainer} gap={2}>
                        {!!items?.length && <>
                          <Button variant="outlined" onClick={() => onAddExpense()}>
                            Додати витрати
                          </Button>

                          <Button variant="outlined" onClick={() => onAddNumberInStock()}>
                            Поповнити наявність
                          </Button>

                          <Button variant="outlined" onClick={() => onDownloadCSV()}>
                            Скачати CSV
                          </Button>
                        </>}
                    </Box>}

                  {openBookModal &&
                    <BookModal open={true}
                               item={selectedItem}
                               isAdmin={isAdmin(user)}
                               onClose={(updated = false, bookSeries?: string) => refreshData(updated, bookSeries)}></BookModal>}

                  {openExpensesModal &&
                    <AddExpenseModal open={true} onClose={() => setOpenExpensesModal(false)}></AddExpenseModal>}

                  {openNumberInStockModal &&
                    <BookNumberInStockModal open={true}
                                            onClose={(updated = false) => refreshData(updated)}></BookNumberInStockModal>}
              </>
            }
        </SettingsMenu>
    );
}