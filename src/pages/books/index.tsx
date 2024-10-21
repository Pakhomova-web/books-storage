import { Box, Grid, Table, TableFooter, TablePagination, TableRow } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useBooks } from '@/lib/graphql/queries/book/hook';
import Loading from '@/components/loading';
import { pageStyles, positionRelative, styleVariables } from '@/constants/styles-variables';
import {
    AuthorEntity,
    BookEntity,
    BookFilter,
    BookSeriesEntity,
    BookTypeEntity,
    IPageable,
    LanguageEntity,
    PublishingHouseEntity
} from '@/lib/data/types';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { getParamsQueryString, isAdmin, renderPrice } from '@/utils/utils';
import CustomImage from '@/components/custom-image';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getBookTypeById } from '@/lib/graphql/queries/book-type/hook';
import CustomLink from '@/components/custom-link';
import ErrorNotification from '@/components/error-notification';
import { getAuthorById } from '@/lib/graphql/queries/author/hook';
import { getPublishingHouseById } from '@/lib/graphql/queries/publishing-house/hook';
import { BookFilters } from '@/components/filters/book-filters';
import { ApolloError } from '@apollo/client';
import HdrStrongIcon from '@mui/icons-material/HdrStrong';
import HdrWeakIcon from '@mui/icons-material/HdrWeak';
import { useAuth } from '@/components/auth-context';
import { TableKey } from '@/components/table/table-key';
import { getLanguageById } from '@/lib/graphql/queries/language/hooks';
import { getBookSeriesById } from '@/lib/graphql/queries/book-series/hook';

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
    const { user } = useAuth();
    const [pageSettings, setPageSettings] = useState<IPageable>({
        order: 'asc', orderBy: '', page: 0, rowsPerPage: 25
    });
    const [tableKeys] = useState<TableKey<BookEntity>[]>([
        { title: 'Назва', sortValue: 'name', type: 'text' },
        { title: 'Тип обкладинки', sortValue: 'coverType', type: 'text' },
        { title: 'Автор', sortValue: 'author', type: 'text' },
        { title: 'Ціна', sortValue: 'price', type: 'text' },
        { title: 'Наявність', sortValue: 'numberInStock', type: 'text' }
    ]);
    const [filters, setFilters] = useState<BookFilter>(new BookFilter(router.query));
    const [option, setOption] = useState<{ title: string, param?: { key: string, item: any } }[]>();
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
        setOption(null);
        setLoadingOption(true);
        let promise: Promise<any>;

        if (router.query?.bookSeries) {
            promise = getBookSeriesById(router.query?.bookSeries as string)
                .then((item: BookSeriesEntity) => [
                    { title: 'Видавництво' },
                    {
                        title: item.publishingHouse.name,
                        param: `publishingHouse=${item.publishingHouse.id}`
                    },
                    { title: 'Серія' },
                    { title: item.name }
                ]);
        } else if (router.query?.language) {
            promise = getLanguageById(router.query?.language as string)
                .then((item: LanguageEntity) => [{ title: 'Мова' }, { title: item.name }]);
        } else if (router.query?.bookType) {
            promise = getBookTypeById(router.query?.bookType as string)
                .then((item: BookTypeEntity) => [{ title: 'Тип' }, { title: item.name }]);
        } else if (router.query?.author) {
            promise = getAuthorById(router.query?.author as string)
                .then((item: AuthorEntity) => [{ title: 'Автор' }, { title: item.name }]);
        } else if (router.query?.publishingHouse) {
            promise = getPublishingHouseById(router.query?.publishingHouse as string)
                .then((item: PublishingHouseEntity) => [{ title: 'Видавництво' }, { title: item.name }]);
        } else if (router.query?.tags) {
            setOption([{ title: 'Тег' }, { title: router.query.tags as string }]);
        }

        if (promise) {
            promise
                .then(newOpt => {
                    setOption(newOpt);
                    setLoadingOption(false);
                })
                .catch(() => {
                    setLoadingOption(false);
                });
        } else {
            setLoadingOption(false);
        }
    }, [router.query]);

    function refreshData(resetOption = true) {
        refetch();
        if (resetOption) {
            setError(null);
            setOption(null);
        }
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

    function renderBackBox() {
        return (
            <Box ml={1} display="flex" alignItems="center" flexWrap="wrap" gap={1}>
                <CustomLink onClick={() => router.push('/')}>Головна</CustomLink>
                {option.map((item, index) =>
                    <Box key={index} display="flex" alignItems="center" gap={1}>
                        <ArrowForwardIcon fontSize="small"/>
                        {item.param ?
                            <CustomLink onClick={() => router.push(`/books?${item.param}`)}>
                                {item.title}
                            </CustomLink> :
                            item.title
                        }
                    </Box>)
                }
            </Box>
        );
    }

    return (
        <Box sx={positionRelative}>
            <Loading show={loading}></Loading>

            <Box sx={pageStyles}>
                <BookFilters tableKeys={tableKeys}
                             defaultValues={filters}
                             onApply={(filters: BookFilter) => setFilters(filters)}
                             pageSettings={pageSettings}
                             showAlwaysSorting={true}
                             onSort={(pageSettings: IPageable) => setPageSettings(pageSettings)}></BookFilters>

                <Box p={1} display="flex" flexWrap="wrap" alignItems="center">
                    {!loadingOption && option && renderBackBox()}
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
                                            {isAdmin(user) &&
                                              <Box display="flex" alignItems="center" textAlign="center" gap={1}>
                                                  {book.numberInStock ?
                                                      <><HdrStrongIcon style={{ color: "green" }}/>В наявності
                                                          ({book.numberInStock})</> :
                                                      <><HdrWeakIcon
                                                          style={{ color: styleVariables.warnColor }}/>Відсутня</>
                                                  }
                                              </Box>}
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