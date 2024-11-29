import { Box, Grid, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ApolloError } from '@apollo/client';
import HomeIcon from '@mui/icons-material/Home';
import { styled } from '@mui/material/styles';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import { useBooks } from '@/lib/graphql/queries/book/hook';
import Loading from '@/components/loading';
import { borderRadius, primaryLightColor, titleFontSize } from '@/constants/styles-variables';
import {
    AuthorEntity,
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
import { getLanguageById } from '@/lib/graphql/queries/language/hooks';
import { getBookSeriesById } from '@/lib/graphql/queries/book-series/hook';
import BooksList from '@/components/books/books-list';
import Head from 'next/head';
import { MAIN_NAME } from '@/constants/main-name';
import IconWithText from '@/components/icon-with-text';
import SocialMediaBox from '@/components/social-media-box';
import DeliveriesBox from '@/components/deliveries-box';
import RecentlyViewedBooks from '@/components/books/recently-viewed-books';
import Pagination from '@/components/pagination';

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
        order: 'asc', orderBy: '', page: 0, rowsPerPage: 24
    });
    const [filters, setFilters] = useState<BookFilter>(new BookFilter(router.query));
    const [option, setOption] = useState<{ title: string, param?: string, imageId?: string }[]>();
    const [toRefreshData, setToRefreshData] = useState<boolean>(false);
    const [loadingOption, setLoadingOption] = useState<boolean>();
    const { items, totalCount, gettingError, loading } = useBooks(pageSettings, filters);
    const [error, setError] = useState<ApolloError>();

    useEffect(() => {
        if (toRefreshData) {
            const url = new URL(window.location.href);

            Object.keys(filters || {}).forEach(key => {
                if (filters[key] !== null && filters[key] !== undefined) {
                    url.searchParams.set(key, filters[key]);
                }
            });
            updateOption(filters, false);
            setPageSettings({ ...pageSettings, page: 0 });
            window.history.pushState(null, '', url.toString());
        } else {
            setToRefreshData(true);
        }
    }, [filters]);

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
        } else if (data?.bookTypes) {
            promise = getBookTypeById(data?.bookTypes[0])
                .then((item: BookTypeEntity) => [{ title: item.name }]);
        } else if (data?.authors?.length) {
            promise = getAuthorById(data?.authors[0])
                .then((item: AuthorEntity) => [{ title: item.name }]);
        } else if (data?.illustrators?.length) {
            promise = getAuthorById(data?.illustrators[0])
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
            <Head>
                <title>{MAIN_NAME} - Пошук</title>
            </Head>

            <Loading show={loading}></Loading>

            <BookFilters defaultValues={filters}
                         onApply={(filters: BookFilter) => {
                             setPageSettings(prev => ({ ...prev, page: 0 }));
                             setFilters(filters)
                         }}
                         pageSettings={pageSettings}
                         showAlwaysSorting={true}
                         onSort={(settings: IPageable) => setPageSettings(settings)}></BookFilters>

            <Grid container mb={1}>
                <StyledAdditionalTopicGrid item xs={6} md={3} p={1}
                                           onClick={() => router.push('/books?quickSearch=англ')}>
                    Англійська дітям
                </StyledAdditionalTopicGrid>
                <StyledAdditionalTopicGrid item xs={6} md={3} p={1}
                                           onClick={() => router.push('/books?bookTypes=66901099d4b33119e2069792')}>
                    Наліпки для найменших
                </StyledAdditionalTopicGrid>
                <StyledAdditionalTopicGrid item xs={6} md={3} p={1}
                                           onClick={() => router.push('/books?tags=новорічна,різдвяна,зимова')}>
                    Новорічні книги
                </StyledAdditionalTopicGrid>
                <StyledAdditionalTopicGrid item xs={6} md={3} p={1}
                                           onClick={() => router.push('/books?bookTypes=671389883908259306710c62')}>
                    Розмальовки
                </StyledAdditionalTopicGrid>
            </Grid>

            {!loadingOption && option && renderBackBox()}

            {items.length ?
                <Box mb={2}>
                    <Grid container justifyContent="center">
                        <BooksList items={items} filters={filters} pageUrl="/books"></BooksList>
                    </Grid>

                    <Pagination rowsPerPage={pageSettings.rowsPerPage} count={totalCount}
                                page={pageSettings.page} onRowsPerPageChange={onRowsPerPageChange}
                                onPageChange={onPageChange}/>
                </Box>
                : (!loading &&
                <IconWithText imageLink="/no_results.png" text="На жаль пошук не дав результатів. Cпробуйте ще раз"/>)}

            {error && <ErrorNotification error={error}></ErrorNotification>}

            <RecentlyViewedBooks/>

            <DeliveriesBox/>

            <SocialMediaBox/>
        </>
    );
}