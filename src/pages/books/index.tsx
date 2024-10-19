import { Box, Grid, Table, TableFooter, TablePagination, TableRow } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useBooks } from '@/lib/graphql/queries/book/hook';
import Loading from '@/components/loading';
import { pageStyles, positionRelative, styleVariables } from '@/constants/styles-variables';
import { BookEntity, BookTypeEntity, IBookFilter, IPageable } from '@/lib/data/types';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { getParamsQueryString, renderPrice } from '@/utils/utils';
import CustomImage from '@/components/custom-image';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getBookTypeById } from '@/lib/graphql/queries/book-type/hook';
import CustomLink from '@/components/custom-link';
import ErrorNotification from '@/components/error-notification';

const paginatorStyles = {
    borderTop: `1px solid ${styleVariables.gray}`,
    background: 'white'
};

const bookBoxStyles = { height: '250px', maxHeight: '50vw' };
const bookPriceStyles = {
    ...styleVariables.titleFontSize,
    ...styleVariables.boldFont
};

const bookInfoStyles = {
    ...styleVariables.hintFontSize
};

const StyledGrid = styled(Grid)(() => ({
    cursor: 'pointer',
    '&:hover': {

        backgroundColor: styleVariables.gray,
        borderRadius: styleVariables.borderRadius
    }
}));

export default function Books() {
    const router = useRouter();
    const [pageSettings, setPageSettings] = useState<IPageable>({
        order: 'asc', orderBy: '', page: 0, rowsPerPage: 25
    });
    const [filters, setFilters] = useState<IBookFilter>(router.query);
    const [bookType, setBookType] = useState<BookTypeEntity>();
    const [loadingBookType, setLoadingBookType] = useState<boolean>();
    const { items, totalCount, gettingError, loading, refetch } = useBooks(pageSettings, filters);

    useEffect(() => {
        if (router.query?.bookType) {
            setLoadingBookType(true);
            getBookTypeById(router.query?.bookType as string)
                .then((item: BookTypeEntity) => {
                    setBookType(item);
                    setLoadingBookType(false);
                })
                .catch(() => {
                    setLoadingBookType(false);
                });
        }
    }, [router.query]);

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
        const filterQueries: string[] = Object.keys(filters)
            .map(key => !!filters[key] ? `${key}=${filters[key]}` : '')
            .filter(query => !!query);
        const query = !!filterQueries.length ? filterQueries.join('&') : '';

        router.push(`/books/details?${getParamsQueryString({ id: book.id, filters: query })}`);
    }

    return (
        <Box sx={positionRelative}>
            <Loading show={loading}></Loading>

            <Box sx={pageStyles}>
                <Box p={1} display="flex" flexWrap="wrap" alignItems="center">
                    {!loadingBookType && !!bookType &&
                      <Box ml={1} display="flex" alignItems="center" gap={1}>
                        <CustomLink onClick={() => router.push('/')}>Головна</CustomLink>
                        <ArrowForwardIcon fontSize="small"/>{bookType.name}
                      </Box>
                    }
                </Box>

                {items.length ?
                    <>
                        <Grid container justifyContent="center">
                            {items.map(((book, i) =>
                                    <StyledGrid item key={i} xl={1} lg={2} md={3} sm={4} xs={6} p={2}
                                                onClick={() => handleClickOnBook(book)}>
                                        <Box display="flex"
                                             flexDirection="column"
                                             alignItems="center"
                                             justifyContent="space-between"
                                             height="100%">
                                            <Box sx={bookBoxStyles} mb={1}>
                                                <CustomImage isBookDetails={true} imageId={book.imageId}></CustomImage>
                                            </Box>
                                            <Box sx={bookInfoStyles} textAlign="center">
                                                {book.bookSeries.publishingHouse.name}{book.bookSeries.name === '-' ? '' : `, ${book.bookSeries.name}`}
                                            </Box>
                                            <Box sx={styleVariables.titleFontSize} textAlign="center">{book.name}</Box>
                                            <Box sx={bookPriceStyles} mt={1}>{renderPrice(book.price)} грн</Box>
                                        </Box>
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
                    </>
                    : (!loading && <Box p={1} display="flex" justifyContent="center">No books</Box>)}

                {gettingError && <ErrorNotification error={gettingError}></ErrorNotification>}
            </Box>
        </Box>
    );
}