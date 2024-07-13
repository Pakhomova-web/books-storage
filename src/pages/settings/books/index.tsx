import { Box, Button } from '@mui/material';
import { TableKey, TableSort } from '@/components/table/table-key';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { ApolloError } from '@apollo/client';

import { BookEntity } from '@/lib/data/types';
import Loading from '@/components/loading';
import CustomTable from '@/components/table/custom-table';
import { useBooks, useDeleteBook } from '@/lib/graphql/hooks';
import BookModal from '@/components/modals/book-modal';
import ErrorNotification from '@/components/error-notification';
import { styleVariables } from '@/constants/styles-variables';
import { downloadCsv } from '@/utils/utils';
import { BookFilters } from '@/components/filters/book-filters';

export default function Books() {
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
        {
            type: 'icons',
            icons: [
                {
                    element: <DeleteIcon color="warning"/>,
                    onIconClick: (item: BookEntity) => deleteHandler(item)
                }
            ]
        }
    ]);
    const [selectedItem, setSelectedItem] = useState<BookEntity>();
    const [sort, setSort] = useState<TableSort>({ order: 'asc', orderBy: '' });
    const [filters, setFilters] = useState<BookEntity>();
    const { items, gettingError, loading, refetch } = useBooks(sort, filters);
    const { deleteItem, deletingError, deleting } = useDeleteBook();
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
    }, [filters]);

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
        setOpenNewModal(false);
        setSelectedItem(undefined);
    }

    function onAdd() {
        setError(null);
        setOpenNewModal(true);
    }

    function onEdit(item: BookEntity) {
        setError(null);
        setSelectedItem(item);
    }

    function onDownloadCSV() {
        downloadCsv<BookEntity>(items, tableKeys.filter(key => key.type === 'text'), new Date().toISOString());
    }

    return (
        <Loading open={loading || deleting} fullHeight={true}>
            <BookFilters onApply={(filters: BookEntity) => setFilters(filters)}></BookFilters>

            <CustomTable data={items} keys={tableKeys}
                         renderKey={(item: BookEntity) => item.id}
                         onSort={(sort: TableSort) => setSort(sort)}
                         sort={sort}
                         onRowClick={(item: BookEntity) => onEdit(item)}></CustomTable>

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

            {(openNewModal || selectedItem) &&
              <BookModal open={true}
                         item={selectedItem}
                         onClose={(updated = false) => refreshData(updated)}></BookModal>}
        </Loading>
    );
}