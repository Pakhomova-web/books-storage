import { Box, Grid, Table, TableFooter, TablePagination, TableRow } from '@mui/material';
import React, { useState } from 'react';
import { useBooks } from '@/lib/graphql/queries/book/hook';
import Loading from '@/components/loading';
import { pageStyles, positionRelative, styleVariables } from '@/constants/styles-variables';
import { BookEntity, IBookFilter, IPageable } from '@/lib/data/types';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { renderPrice } from '@/utils/utils';
import CustomImage from '@/components/custom-image';

const paginatorStyles = {
    borderTop: `1px solid ${styleVariables.gray}`,
    background: 'white'
};

const bookBoxStyles = { height: '250px', maxHeight: '50vw' };
const bookTitleStyles = {
    ...styleVariables.titleFontSize
};
const bookPriceStyles = {
    ...styleVariables.titleFontSize,
    ...styleVariables.boldFont
};

const bookInfoStyles = {
    ...styleVariables.hintFontSize
};

const StyledGrid = styled(Grid)(({ theme }) => ({
    cursor: 'pointer',
    '&:hover': {
        transform: 'scale(1.1)'
    }
}));

export default function Home() {
    const [pageSettings, setPageSettings] = useState<IPageable>({
        order: 'asc', orderBy: '', page: 0, rowsPerPage: 25
    });
    const [filters, setFilters] = useState<IBookFilter>();
    const { items, totalCount, gettingError, loading, refetch } = useBooks(pageSettings, filters);
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

    function handleClickOnBook(book: BookEntity) {
        router.push(`/book?id=${book.id}`);
    }

    return (
        <Box sx={positionRelative}>
            <Loading show={loading}></Loading>

            <Box sx={pageStyles}>
                <Grid container justifyContent="center">
                    {items.map(((book, i) =>
                            <StyledGrid item key={i} xl={1} lg={2} md={3} sm={4} xs={6} p={2} textAlign="center"
                                        onClick={() => handleClickOnBook(book)}>
                                <Box sx={bookBoxStyles} mb={1}>
                                    <CustomImage imageId={book.imageId}></CustomImage>
                                </Box>
                                <Box sx={bookInfoStyles}>
                                    {book.bookSeries.publishingHouse.name}{book.bookSeries.name === '-' ? '' : `, ${book.bookSeries.name}`}
                                </Box>
                                <Box sx={bookTitleStyles}>{book.name}</Box>
                                <Box sx={bookPriceStyles} mt={1}>{renderPrice(book.price)} грн</Box>
                            </StyledGrid>
                    ))}
                </Grid>

                <Box sx={{ position: 'sticky', bottom: 0 }}>
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
            </Box>
        </Box>
    );
}