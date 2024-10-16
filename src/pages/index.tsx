import { Box, Grid, Table, TableFooter, TablePagination, TableRow } from '@mui/material';
import React, { useState } from 'react';
import { useBooks } from '@/lib/graphql/queries/book/hook';
import Loading from '@/components/loading';
import { positionRelative, styleVariables } from '@/constants/styles-variables';
import { IBookFilter, IPageable } from '@/lib/data/types';

const paginatorStyles = {
    borderTop: `1px solid ${styleVariables.gray}`,
    background: 'white'
};

const bookBoxStyles = { height: '250px', maxHeight: '50vw' };
const bookTitleStyles = {
    fontSize: styleVariables.titleFontSize
};
const bookPriceStyles = {
    fontSize: styleVariables.titleFontSize,
    ...styleVariables.boldFont
};

const bookInfoStyles = {
    fontSize: styleVariables.hintFontSize
};

const bookContainerStyles = {
    cursor: 'pointer'
};

export default function Home() {
    const [pageSettings, setPageSettings] = useState<IPageable>({
        order: 'asc', orderBy: '', page: 0, rowsPerPage: 25
    });
    const [filters, setFilters] = useState<IBookFilter>();
    const { items, totalCount, gettingError, loading, refetch } = useBooks(pageSettings, filters);

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

    return (
        <Box sx={positionRelative}>
            <Loading show={loading}></Loading>

            <Grid container justifyContent="center">
                {items.map(((book, i) =>
                        <Grid item key={i} xl={1} lg={2} md={3} sm={4} xs={6} p={2} textAlign="center" sx={bookContainerStyles}>
                            <Box sx={bookBoxStyles} mb={1}>
                                <img alt="Image 1" width="100%" height="100%" style={{ objectFit: 'contain' }}
                                     src={book.imageId ? `https://drive.google.com/thumbnail?id=${book.imageId}&sz=w1000` : '/book-empty.jpg'}/>
                            </Box>
                            <Box sx={bookInfoStyles}>
                                {book.bookSeries.publishingHouse.name}{book.bookSeries.name === '-' ? '' : `, ${book.bookSeries.name}`}
                            </Box>
                            <Box sx={bookTitleStyles}>{book.name}</Box>
                            <Box sx={bookPriceStyles} mt={1}>{book.price} грн</Box>
                        </Grid>
                ))}
            </Grid>

            <Table>
                <TableFooter>
                    <TableRow>
                        <TablePagination rowsPerPageOptions={[5, 10, 25]}
                                         count={totalCount}
                                         page={pageSettings.page}
                                         sx={paginatorStyles}
                                         rowsPerPage={pageSettings.rowsPerPage}
                                         onPageChange={(_e, val: number) => onPageChange(val)}
                                         onRowsPerPageChange={({ target }) => onRowsPerPageChange(Number(target.value))}/>
                    </TableRow>
                </TableFooter>
            </Table>
        </Box>
    );
}