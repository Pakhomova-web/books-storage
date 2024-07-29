import { Box, Button } from '@mui/material';
import { TableActionEnum, TableKey } from '@/components/table/table-key';
import AddIcon from '@mui/icons-material/Add';
import React, { useEffect, useState } from 'react';
import { ApolloError } from '@apollo/client';

import { BookEntity, IBookFilter, IPageable } from '@/lib/data/types';
import Loading from '@/components/loading';
import CustomTable from '@/components/table/custom-table';
import { getAllBooks, useBooks, useDeleteBook } from '@/lib/graphql/hooks';
import BookModal from '@/components/modals/book-modal';
import ErrorNotification from '@/components/error-notification';
import { pageStyles, positionRelative, styleVariables } from '@/constants/styles-variables';
import { downloadCsv, isAdmin } from '@/utils/utils';
import { BookFilters } from '@/components/filters/book-filters';
import { BookNumberInStockModal } from '@/components/modals/book-number-in-stock-modal';
import { useAuth } from '@/components/auth-context';

const subTitleStyles = {
    fontSize: styleVariables.hintFontSize,
    display: 'flex',
    alignItems: 'center',
    margin: `${styleVariables.margin} 0`
};

const numberInStockBox = (inStock: boolean) => ({
    padding: `0 ${styleVariables.rowMargin}`,
    margin: `0 ${styleVariables.rowMargin}`,
    borderRadius: styleVariables.borderRadius,
    background: inStock ? styleVariables.greenLightColor : styleVariables.redLightColor,
    border: `1px solid ${inStock ? 'green' : styleVariables.warnColor}`
});

export default function Books() {
    const { user, checkAuth } = useAuth();
    const tableActions: TableKey<BookEntity> = {
        renderMobileLabel: (item: BookEntity) => (
            <Box sx={subTitleStyles}>
                {item.bookType.name}/{item.bookSeries.publishingHouse.name}/{item.bookSeries.name}
                {isAdmin(user) && <Box sx={numberInStockBox(!!item.numberInStock)}>{item.numberInStock}</Box>}
            </Box>
        ),
        type: 'actions',
        actions: isAdmin(user) ? [
            {
                label: 'Add number in stock',
                type: TableActionEnum.add,
                onClick: (item: BookEntity) => {
                    setError(null);
                    setSelectedItem(item);
                    setOpenNumberInStockModal(true);
                }
            },
            {
                label: 'Copy',
                type: TableActionEnum.copy,
                onClick: (item: BookEntity) => {
                    const data = { ...item, name: null };

                    delete data.id;
                    onAdd(data);
                }
            },
            {
                label: 'Delete',
                type: TableActionEnum.delete,
                onClick: (item: BookEntity) => deleteHandler(item)
            }
        ] : []
    };
    const [mobileKeys] = useState<TableKey<BookEntity>[]>([
        {
            title: 'Name',
            sortValue: 'name',
            renderValue: (item: BookEntity) => item.name,
            type: 'text',
            mobileStyleClasses: { ...styleVariables.boldFont, ...styleVariables.mobileBigFontSize }
        },
        {
            title: 'Pages',
            sortValue: 'numberOfPages',
            renderValue: (item: BookEntity) => item.numberOfPages,
            type: 'text'
        },
        {
            title: 'Language',
            sortValue: 'language',
            renderValue: (item: BookEntity) => item.language?.name,
            type: 'text'
        },
        {
            title: 'Page Type',
            sortValue: 'pageType',
            renderValue: (item: BookEntity) => item.pageType?.name,
            type: 'text'
        },
        {
            title: 'Cover Type',
            sortValue: 'coverType',
            renderValue: (item: BookEntity) => item.coverType?.name,
            type: 'text'
        },
        {
            title: 'Author',
            sortValue: 'author',
            renderValue: (item: BookEntity) => item.author?.name,
            type: 'text'
        },
        {
            title: 'Price',
            sortValue: 'price',
            renderValue: (item: BookEntity) => item.price,
            type: 'text'
        }
    ]);
    const [tableKeys] = useState<TableKey<BookEntity>[]>([
        { title: 'Type', sortValue: 'bookType', renderValue: (item: BookEntity) => item.bookType?.name, type: 'text' },
        {
            title: 'Publishing House',
            sortValue: 'publishingHouse',
            renderValue: (item: BookEntity) => item.bookSeries?.publishingHouse?.name,
            type: 'text'
        },
        {
            title: 'Series',
            sortValue: 'bookSeries',
            renderValue: (item: BookEntity) => item.bookSeries?.name,
            type: 'text'
        },
        ...mobileKeys,
        {
            title: 'In Stock',
            sortValue: 'numberInStock',
            renderValue: (item: BookEntity) => item.numberInStock,
            type: 'text'
        }
    ]);
    const [selectedItem, setSelectedItem] = useState<BookEntity>();
    const [pageSettings, setPageSettings] = useState<IPageable>({
        order: 'asc', orderBy: '', page: 0, rowsPerPage: 5
    });
    const [filters, setFilters] = useState<IBookFilter>();
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
        if (parentItem) {
            setSelectedItem(parentItem);
        } else {
            setOpenNewModal(true);
        }
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

    function onPaginationChange(settings: IPageable) {
        setPageSettings(settings);
    }

    return (
        <Box sx={positionRelative}>
            <Loading show={loading || deleting || downloadingCsv}></Loading>

            <Box sx={pageStyles}>
                <BookFilters onApply={(filters: IBookFilter) => setFilters(filters)}></BookFilters>

                <CustomTable data={items}
                             keys={tableKeys}
                             mobileKeys={mobileKeys}
                             actions={tableActions}
                             renderKey={(item: BookEntity) => item.id}
                             onChange={(settings: IPageable) => onPaginationChange(settings)}
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
                          <AddIcon></AddIcon>Add Book
                        </Button>

                          {!!items?.length &&
                            <Button variant="outlined" onClick={() => onDownloadCSV()}>
                              Download CSV
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
        </Box>
    );
}