import { pageStyles, positionRelative, styleVariables } from '@/constants/styles-variables';
import { useAuth } from '@/components/auth-context';
import { TableActionEnum, TableKey } from '@/components/table/table-key';
import { BookEntity, BookFilter, IPageable } from '@/lib/data/types';
import { Box, Button } from '@mui/material';
import { downloadCsv, isAdmin, renderPrice } from '@/utils/utils';
import React, { useEffect, useState } from 'react';
import { getAllBooks, useBooks, useDeleteBook } from '@/lib/graphql/queries/book/hook';
import { ApolloError } from '@apollo/client';
import Loading from '@/components/loading';
import { BookFilters } from '@/components/filters/book-filters';
import CustomTable from '@/components/table/custom-table';
import ErrorNotification from '@/components/error-notification';
import AddIcon from '@mui/icons-material/Add';
import BookModal from '@/components/modals/book-modal';
import { BookNumberInStockModal } from '@/components/modals/book-number-in-stock-modal';
import CustomImage from '@/components/custom-image';
import HdrStrongIcon from '@mui/icons-material/HdrStrong';
import HdrWeakIcon from '@mui/icons-material/HdrWeak';

const subTitleStyles = {
    ...styleVariables.hintFontSize,
    display: 'flex',
    margin: `${styleVariables.margin} 0`
};

export default function BooksSettingsTable() {
    const { user, checkAuth } = useAuth();
    const tableActions: TableKey<BookEntity> = {
        renderMobileLabel: (item: BookEntity) => (
            <>
                <Box sx={subTitleStyles}>
                    <Box height={75} width={100} mr={1}>
                        <CustomImage imageId={item.imageIds[0]} isBookDetails={true}></CustomImage></Box>
                    <Box display="flex" flexDirection="column" gap={1}>
                        <Box>{item.bookType.name}</Box>
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
                        <><HdrWeakIcon fontSize="small" style={{ color: styleVariables.warnColor }}/>Відсутня</>
                    }
                </Box>
            </>
        ),
        type: 'actions',
        actions: isAdmin(user) ? [
            {
                label: 'Додати кількість в наявності',
                type: TableActionEnum.add,
                onClick: (item: BookEntity) => {
                    setError(null);
                    setSelectedItem(item);
                    setOpenNumberInStockModal(true);
                }
            },
            {
                label: 'Скопіювати',
                type: TableActionEnum.copy,
                onClick: (item: BookEntity) => {
                    const data = { ...item, name: null };

                    delete data.id;
                    onAdd(data);
                }
            },
            {
                label: 'Видалити',
                type: TableActionEnum.delete,
                onClick: (item: BookEntity) => deleteHandler(item)
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
            title: 'Кількість сторінок',
            sortValue: 'numberOfPages',
            renderValue: (item: BookEntity) => item.numberOfPages,
            type: 'text'
        },
        {
            title: 'Мова',
            sortValue: 'language',
            renderValue: (item: BookEntity) => item.language?.name,
            type: 'text'
        },
        {
            title: 'Тип сторінок',
            sortValue: 'pageType',
            renderValue: (item: BookEntity) => item.pageType?.name,
            type: 'text'
        },
        {
            title: 'Тип обкладинки',
            sortValue: 'coverType',
            renderValue: (item: BookEntity) => item.coverType?.name,
            type: 'text'
        },
        {
            title: 'Автори',
            renderValue: (item: BookEntity) => item.authors?.map(author => author.name).join(', '),
            type: 'text'
        },
        {
            title: 'Ціна',
            sortValue: 'price',
            renderValue: (item: BookEntity) => renderPrice(item.price),
            type: 'text'
        }
    ]);
    const [tableKeys] = useState<TableKey<BookEntity>[]>([
        { title: 'Тип', sortValue: 'bookType', renderValue: (item: BookEntity) => item.bookType?.name, type: 'text' },
        {
            title: 'Видавництво',
            sortValue: 'publishingHouse',
            renderValue: (item: BookEntity) => item.bookSeries?.publishingHouse?.name,
            type: 'text'
        },
        {
            title: 'Серія',
            sortValue: 'bookSeries',
            renderValue: (item: BookEntity) => item.bookSeries?.name,
            type: 'text'
        },
        ...mobileKeys,
        {
            title: 'В наявності',
            sortValue: 'numberInStock',
            renderValue: (item: BookEntity) => item.numberInStock,
            type: 'text'
        }
    ]);
    const [selectedItem, setSelectedItem] = useState<BookEntity>();
    const [pageSettings, setPageSettings] = useState<IPageable>({
        order: 'asc', orderBy: '', page: 0, rowsPerPage: 5
    });
    const [filters, setFilters] = useState<BookFilter>();
    const { items, totalCount, gettingError, loading, refetch } = useBooks(pageSettings, filters);
    const { deleteItem, deletingError, deleting } = useDeleteBook();
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

    function highlightInRed(numberInStock: number) {
        return !numberInStock ? {
            background: styleVariables.redLightColor
        } : {};
    }

    async function deleteHandler(item: BookEntity) {
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

    function onAdd(parentItem?: BookEntity) {
        setError(null);
        setSelectedItem(parentItem);
        setOpenNewModal(true);
    }

    function onEdit(item: BookEntity) {
        setError(null);
        setSelectedItem(item);
        setOpenNewModal(true);
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

    return (
        <Box sx={positionRelative}>
            <Loading show={loading || deleting || downloadingCsv}></Loading>

            {isAdmin(user) &&
              <Box sx={pageStyles}>
                <BookFilters tableKeys={tableKeys}
                             onApply={(filters: BookFilter) => setFilters(filters)}
                             pageSettings={pageSettings}
                             onSort={(pageSettings: IPageable) => setPageSettings(pageSettings)}></BookFilters>

                <CustomTable data={items}
                             keys={tableKeys}
                             mobileKeys={mobileKeys}
                             actions={tableActions}
                             renderKey={(item: BookEntity) => item.id}
                             onChange={(settings: IPageable) => setPageSettings(settings)}
                             pageSettings={pageSettings}
                             usePagination={true}
                             withFilters={true}
                             rowStyleClass={(item: BookEntity) => highlightInRed(item.numberInStock)}
                             totalCount={totalCount}
                             onRowClick={(item: BookEntity) => onEdit(item)}>
                    {error && <ErrorNotification error={error}></ErrorNotification>}

                    {isAdmin(user) &&
                      <Box sx={styleVariables.buttonsContainer}>
                        <Button variant="outlined" onClick={() => onAdd()}
                                sx={items.length ? { mr: styleVariables.margin } : {}}>
                          <AddIcon></AddIcon>Додати книгу
                        </Button>

                          {!!items?.length &&
                            <Button variant="outlined" onClick={() => onDownloadCSV()}>
                              Скачати CSV
                            </Button>
                          }
                      </Box>
                    }
                </CustomTable>

                  {openNewModal &&
                    <BookModal open={openNewModal}
                               item={selectedItem}
                               isAdmin={isAdmin(user)}
                               onClose={(updated = false) => refreshData(updated)}></BookModal>}

                  {openNumberInStockModal && selectedItem &&
                    <BookNumberInStockModal open={openNumberInStockModal}
                                            item={selectedItem}
                                            onClose={(updated = false) => refreshData(updated)}></BookNumberInStockModal>}
              </Box>
            }
        </Box>
    );
}
