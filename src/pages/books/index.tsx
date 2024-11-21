import { Box, Grid, IconButton, Table, TableFooter, TablePagination, TableRow } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ApolloError } from '@apollo/client';
import HomeIcon from '@mui/icons-material/Home';
import { styled } from '@mui/material/styles';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import { useBooks } from '@/lib/graphql/queries/book/hook';
import Loading from '@/components/loading';
import { borderRadius, primaryLightColor, styleVariables, titleFontSize } from '@/constants/styles-variables';
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
import { useRouter } from 'next/router';
import { getBookTypeById } from '@/lib/graphql/queries/book-type/hook';
import CustomLink from '@/components/custom-link';
import ErrorNotification from '@/components/error-notification';
import { getAuthorById } from '@/lib/graphql/queries/author/hook';
import { getPublishingHouseById } from '@/lib/graphql/queries/publishing-house/hook';
import { BookFilters } from '@/components/filters/book-filters';
import { TableKey } from '@/components/table/table-key';
import { getLanguageById } from '@/lib/graphql/queries/language/hooks';
import { getBookSeriesById } from '@/lib/graphql/queries/book-series/hook';
import BooksList from '@/components/books-list';

const backBoxStyles = {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    backgroundColor: primaryLightColor,
    borderRadius
};

const StyledAdditionalTopicGrid = styled(Grid)(() => ({
    display: 'flex',
    justifyContent: 'center',
    border: `1px solid`,
    borderRadius,
    borderColor: primaryLightColor,
    alignItems: 'center',
    textAlign: 'center',
    cursor: 'pointer',
    fontSize: titleFontSize,
    ':hover': {
        backgroundColor: primaryLightColor
    }
}));

export default function Books() {
    const router = useRouter();
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
    const [option, setOption] = useState<{ title: string, param?: string, imageId?: string }[]>();
    const [toRefreshData, setToRefreshData] = useState<boolean>(false);
    const [loadingOption, setLoadingOption] = useState<boolean>();
    const { items, totalCount, gettingError, loading } = useBooks(pageSettings, filters);
    const [error, setError] = useState<ApolloError>();

    useEffect(() => {
        if (toRefreshData) {
            const url = new URL(window.location.href);

            Object.keys(filters).forEach(key => {
                if (filters[key] !== null && filters[key] !== undefined) {
                    url.searchParams.set(key, filters[key]);
                }
            });
            updateOption(filters, false);
            window.history.pushState(null, '', url.toString());
        } else {
            setToRefreshData(true);
        }
    }, [filters, pageSettings]);

    useEffect(() => {
        if (gettingError) {
            setError(gettingError);
        }
    }, [gettingError]);

    useEffect(() => {
        updateOption(new BookFilter({ ...router.query, archived: false }));
    }, [router.query]);

    function updateOption(data: BookFilter, updateFilters = true) {
        setOption(null);
        setLoadingOption(true);
        let promise: Promise<any>;
        if (updateFilters) {
            setToRefreshData(false);
            setFilters(new BookFilter(data));
        }

        if (data?.bookSeries) {
            promise = getBookSeriesById(data?.bookSeries as string)
                .then((item: BookSeriesEntity) => [
                    {
                        title: item.publishingHouse.name,
                        param: `publishingHouse=${item.publishingHouse.id}`
                    },
                    { title: item.name }
                ]);
        } else if (data?.language) {
            promise = getLanguageById(data?.language as string)
                .then((item: LanguageEntity) => [{ title: item.name }]);
        } else if (data?.bookType) {
            promise = getBookTypeById(data?.bookType as string)
                .then((item: BookTypeEntity) => [{ title: item.name }]);
        } else if (data?.authors?.length) {
            promise = getAuthorById(data?.authors[0])
                .then((item: AuthorEntity) => [{ title: item.name }]);
        } else if (data?.publishingHouse) {
            promise = getPublishingHouseById(data?.publishingHouse as string)
                .then((item: PublishingHouseEntity) => [{ title: item.name }]);
        } else if (!!data?.tags?.length) {
            setOption([{ title: data.tags.join(', ') }]);
        } else if (!!data?.withDiscount) {
            setOption([{ title: 'Акційні товари' }]);
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

    function renderBackBox() {
        return (
            <Box display="flex" alignItems="center" my={1}>
                <IconButton onClick={() => router.push('/')}><HomeIcon/></IconButton>
                {option.map((item, index) =>
                    <Box key={index} display="flex" alignItems="center" gap={1} mr={1}>
                        <KeyboardArrowRightIcon/>
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
        <>
            <Loading show={loading}></Loading>

            <BookFilters tableKeys={tableKeys}
                         defaultValues={filters}
                         onApply={(filters: BookFilter) => setFilters(filters)}
                         pageSettings={pageSettings}
                         showAlwaysSorting={true}
                         onSort={(pageSettings: IPageable) => setPageSettings(pageSettings)}></BookFilters>

            <Grid container mb={1}>
                <StyledAdditionalTopicGrid item xs={6} md={3} p={1}
                                           onClick={() => router.push('/books?quickSearch=англ')}>
                    Англійська дітям
                </StyledAdditionalTopicGrid>
                <StyledAdditionalTopicGrid item xs={6} md={3} p={1}
                                           onClick={() => router.push('/books?bookType=66901099d4b33119e2069792')}>
                    Наліпки для найменших
                </StyledAdditionalTopicGrid>
                <StyledAdditionalTopicGrid item xs={6} md={3} p={1}
                                           onClick={() => router.push('/books?tags=новорічна,різдвяна,зимова')}>
                    Новорічні книги
                </StyledAdditionalTopicGrid>
                <StyledAdditionalTopicGrid item xs={6} md={3} p={1}
                                           onClick={() => router.push('/books?bookType=671389883908259306710c62')}>
                    Розмальовки
                </StyledAdditionalTopicGrid>
            </Grid>

            {!loadingOption && option && renderBackBox()}

            {items.length ?
                <>
                    <Grid container justifyContent="center">
                        <BooksList items={items} filters={filters} pageUrl="/books"></BooksList>
                    </Grid>

                    <Box sx={{ position: 'sticky', bottom: 0 }}>
                        <Table>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination rowsPerPageOptions={[5, 10, 25]}
                                                     count={totalCount}
                                                     page={pageSettings.page}
                                                     sx={styleVariables.paginatorStyles}
                                                     labelRowsPerPage="Кільк. на сторінці"
                                                     rowsPerPage={pageSettings.rowsPerPage}
                                                     onPageChange={(_e, val: number) => onPageChange(val)}
                                                     onRowsPerPageChange={({ target }) => onRowsPerPageChange(Number(target.value))}/>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </Box>
                </>
                : (!loading && <Box p={1} display="flex" justifyContent="center">Немає книг</Box>)}

            {error && <ErrorNotification error={error}></ErrorNotification>}
        </>
    );
}