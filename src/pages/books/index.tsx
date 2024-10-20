import { Box, Grid, Table, TableFooter, TablePagination, TableRow } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useBooks } from '@/lib/graphql/queries/book/hook';
import Loading from '@/components/loading';
import { pageStyles, positionRelative, styleVariables } from '@/constants/styles-variables';
import {
    AuthorEntity,
    BookEntity,
    BookFilter,
    BookTypeEntity,
    IPageable,
    PublishingHouseEntity
} from '@/lib/data/types';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { getParamsQueryString, renderPrice } from '@/utils/utils';
import CustomImage from '@/components/custom-image';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getBookTypeById } from '@/lib/graphql/queries/book-type/hook';
import CustomLink from '@/components/custom-link';
import ErrorNotification from '@/components/error-notification';
import { getAuthorById } from '@/lib/graphql/queries/author/hook';
import { getPublishingHouseById } from '@/lib/graphql/queries/publishing-house/hook';
import { BookFilters } from '@/components/filters/book-filters';
import { ApolloError } from '@apollo/client';

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
    const [filters, setFilters] = useState<BookFilter>(new BookFilter(router.query));
    const [bookType, setBookType] = useState<BookTypeEntity>();
    const [author, setAuthor] = useState<AuthorEntity>();
    const [publishingHouse, setPublishingHouse] = useState<PublishingHouseEntity>();
    const [tag, setTag] = useState<string>();
    const [loadingOption, setLoadingOption] = useState<boolean>();
    const { items, totalCount, gettingError, loading, refetch } = useBooks(pageSettings, filters);
    const [error, setError] = useState<ApolloError>();

    useEffect(() => {
        refreshData();
    }, [filters, pageSettings]);

    useEffect(() => {
        if (gettingError) {
            setError(gettingError);
        }
    }, [gettingError]);

    useEffect(() => {
        if (router.query?.bookType) {
            setLoadingOption(true);
            getBookTypeById(router.query?.bookType as string)
                .then((item: BookTypeEntity) => {
                    setBookType(item);
                    setLoadingOption(false);
                })
                .catch(() => {
                    setLoadingOption(false);
                });
        } else if (router.query?.author) {
            setLoadingOption(true);
            getAuthorById(router.query?.author as string)
                .then((item: AuthorEntity) => {
                    setAuthor(item);
                    setLoadingOption(false);
                })
                .catch(() => {
                    setLoadingOption(false);
                });
        } else if (router.query?.publishingHouse) {
            setLoadingOption(true);
            getPublishingHouseById(router.query?.publishingHouse as string)
                .then((item: PublishingHouseEntity) => {
                    setPublishingHouse(item);
                    setLoadingOption(false);
                })
                .catch(() => {
                    setLoadingOption(false);
                });
        } else if (router.query?.tags) {
            setTag(router.query.tags as string);
        }
    }, [router.query]);

    function refreshData() {
        refetch();
        setError(null);
        setTag(null);
        setPublishingHouse(null);
        setAuthor(null);
        setBookType(null);
    }

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

    function renderBackBox(items: string[]) {
        return (
            <Box ml={1} display="flex" alignItems="center" flexWrap="wrap" gap={1}>
                <CustomLink onClick={() => router.push('/')}>Головна</CustomLink>
                {items.map((item, index) =>
                    <Box key={index} display="flex" alignItems="center" gap={1}>
                        <ArrowForwardIcon fontSize="small"/>{item}
                    </Box>)
                }
            </Box>
        );
    }

    return (
        <Box sx={positionRelative}>
            <Loading show={loading}></Loading>

            <Box sx={pageStyles}>
                <BookFilters tableKeys={[]}
                             onApply={(filters: BookFilter) => setFilters(filters)}
                             pageSettings={pageSettings}
                             onSort={(pageSettings: IPageable) => setPageSettings(pageSettings)}></BookFilters>

                <Box p={1} display="flex" flexWrap="wrap" alignItems="center">
                    {!loadingOption &&
                        (
                            !!bookType && renderBackBox([bookType.name]) ||
                            !!author && renderBackBox(['Автор', author.name]) ||
                            !!publishingHouse && renderBackBox(['Видавництво', publishingHouse.name]) ||
                            !!tag && renderBackBox(['Тег', tag])
                        )
                    }
                </Box>

                {items.length ?
                    <>
                        <Grid container justifyContent="center">
                            {items.map(((book, i) =>
                                    <StyledGrid item key={i} xl={2} md={3} sm={4} xs={6} p={2}
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
                                                         sx={styleVariables.paginatorStyles}
                                                         labelRowsPerPage="Кількість на сторінці"
                                                         rowsPerPage={pageSettings.rowsPerPage}
                                                         onPageChange={(_e, val: number) => onPageChange(val)}
                                                         onRowsPerPageChange={({ target }) => onRowsPerPageChange(Number(target.value))}/>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </Box>
                    </>
                    : (!loading && <Box p={1} display="flex" justifyContent="center">No books</Box>)}

                {error && <ErrorNotification error={error}></ErrorNotification>}
            </Box>
        </Box>
    );
}