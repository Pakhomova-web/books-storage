import { Box, Button, Grid } from '@mui/material';
import { TableActionEnum, TableKey } from '@/components/table/table-key';
import AddIcon from '@mui/icons-material/Add';
import React, { ReactNode, useEffect, useState } from 'react';
import { ApolloError } from '@apollo/client';

import { BookEntity, IBookFilter, IPageable } from '@/lib/data/types';
import Loading from '@/components/loading';
import CustomTable from '@/components/table/custom-table';
import { getAllBooks, useBooks, useDeleteBook } from '@/lib/graphql/hooks';
import BookModal from '@/components/modals/book-modal';
import ErrorNotification from '@/components/error-notification';
import { styleVariables } from '@/constants/styles-variables';
import { downloadCsv } from '@/utils/utils';
import { BookFilters } from '@/components/filters/book-filters';
import { BookNumberInStockModal } from '@/components/modals/book-number-in-stock-modal';
import { getActionItem } from '@/components/table/table-cell-render';

const subTitleStyles = {
    fontSize: styleVariables.hintFontSize,
    display: 'flex',
    alignItems: 'center'
};

const titleBox = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: styleVariables.margin,
    title: {
        fontSize: '18px'
    }
};

const numberInStockBox = (inStock: boolean) => ({
    padding: `0 ${styleVariables.rowMargin}`,
    margin: `0 ${styleVariables.rowMargin}`,
    borderRadius: styleVariables.borderRadius,
    background: inStock ? styleVariables.greenLightColor : styleVariables.redLightColor,
    border: `1px solid ${inStock ? 'green' : styleVariables.warnColor}`
});

const mobileSmallFontSize = {
    fontSize: styleVariables.hintFontSize
};

const mobileRow = {
    paddingBottom: styleVariables.rowMargin,
    marginBottom: styleVariables.rowMargin,
    borderBottom: `1px solid ${styleVariables.gray}`
};

export default function Books() {
    const [tableActions] = useState<TableKey<BookEntity>>({
        type: 'actions',
        actions: [
            {
                label: 'Add quantity in stock',
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
        ]
    });
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
        { title: 'Name', sortValue: 'name', renderValue: (item: BookEntity) => item.name, type: 'text' },
        {
            title: 'Number Of Pages',
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
            title: 'In Stock',
            sortValue: 'numberInStock',
            renderValue: (item: BookEntity) => item.numberInStock,
            type: 'text'
        },
        {
            title: 'Price',
            sortValue: 'price',
            renderValue: (item: BookEntity) => item.price,
            type: 'text'
        },
        tableActions
    ]);
    const [mobileKeys] = useState<TableKey<BookEntity>[]>([
        {
            title: 'Number Of Pages',
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
        tableActions
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

    async function deleteHandler(item: BookEntity) {
        try {
            deleteItem(item.id);
            refreshData();
        } catch (err) {
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

    function renderMobileView(item: BookEntity): ReactNode {
        return (
            <Box>
                <Box sx={titleBox}>
                    <Box sx={subTitleStyles}>
                        {item.bookType.name}/{item.bookSeries.publishingHouse.name}/{item.bookSeries.name}
                        <Box sx={numberInStockBox(!!item.numberInStock)}>{item.numberInStock}</Box>
                    </Box>
                </Box>
                <Grid container sx={mobileRow}>
                    <Grid item xs={6}><b>{item.name}</b></Grid>
                    <Grid item xs={6} sx={styleVariables.flexEnd}><b>{item.price} грн</b></Grid>
                </Grid>
                {mobileKeys.map((key, i) => {
                    switch (key.type) {
                        case 'actions':
                            return <Box>{key.actions
                                .map((action, index) => getActionItem<BookEntity>(item, action, index))}</Box>
                        case 'text':
                            return (<Grid container key={i}
                                          sx={{ ...(i !== mobileKeys.length - 1 ? mobileRow : {}), ...mobileSmallFontSize }}>
                                <Grid item xs={6}>{key.title}</Grid>
                                <Grid item xs={6} sx={styleVariables.flexEnd}>{key.renderValue(item)}</Grid>
                            </Grid>);
                    }
                })}
            </Box>
        );
    }

    return (
        <Loading open={loading || deleting || downloadingCsv} fullHeight={true}>
            <BookFilters onApply={(filters: IBookFilter) => setFilters(filters)}></BookFilters>

            <CustomTable data={items}
                         keys={tableKeys}
                         renderKey={(item: BookEntity) => item.id}
                         onChange={(settings: IPageable) => onPaginationChange(settings)}
                         pageSettings={pageSettings}
                         usePagination={true}
                         withFilters={true}
                         totalCount={totalCount}
                         renderMobileView={renderMobileView}
                         onRowClick={(item: BookEntity) => onEdit(item)}>
            </CustomTable>

            {error && <ErrorNotification error={error}></ErrorNotification>}

            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2, background: 'white', 'z-index': 2 }}>
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

            {openNewModal &&
              <BookModal open={openNewModal}
                         item={selectedItem}
                         onClose={(updated = false) => refreshData(updated)}></BookModal>}

            {openNumberInStockModal && selectedItem &&
              <BookNumberInStockModal open={openNumberInStockModal}
                                      item={selectedItem}
                                      onClose={(updated = false) => refreshData(updated)}></BookNumberInStockModal>}
        </Loading>
    );
}