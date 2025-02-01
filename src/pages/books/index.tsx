import { Box, Grid, IconButton, SortDirection } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
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
    PublishingHouseEntity
} from '@/lib/data/types';
import { useRouter } from 'next/router';
import { getBookTypeById } from '@/lib/graphql/queries/book-type/hook';
import CustomLink from '@/components/custom-link';
import ErrorNotification from '@/components/error-notification';
import { getAuthorById } from '@/lib/graphql/queries/author/hook';
import { getPublishingHouseById } from '@/lib/graphql/queries/publishing-house/hook';
import { BookFilters } from '@/components/filters/book-filters';
import { getBookSeriesById } from '@/lib/graphql/queries/book-series/hook';
import BooksList from '@/components/books/books-list';
import Head from 'next/head';
import { MAIN_DESC, MAIN_NAME } from '@/constants/main-name';
import IconWithText from '@/components/icon-with-text';
import SocialMediaBox from '@/components/social-media-box';
import DeliveriesBox from '@/components/deliveries-box';
import RecentlyViewedBooks from '@/components/books/recently-viewed-books';
import Pagination from '@/components/pagination';
import Catalogue from '@/components/catalogue';

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
        order: router.query.order as SortDirection || 'asc',
        orderBy: router.query.orderBy as string || '',
        page: +router.query.page || 0,
        rowsPerPage: +router.query.rowsPerPage || 24
    });
    const [filters, setFilters] = useState<BookFilter>(new BookFilter(router.query));
    const [option, setOption] = useState<{ title: string, param?: string, imageId?: string }[]>();
    const [toRefreshData, setToRefreshData] = useState<boolean>(false);
    const [loadingOption, setLoadingOption] = useState<boolean>();
    const { items, totalCount, gettingError, loading, refetch } = useBooks(pageSettings, filters);
    const [error, setError] = useState<ApolloError>();
    const ref = useRef(null);

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
        if (toRefreshData) {
            const url = new URL(window.location.href);

            Object.keys(pageSettings || {}).forEach(key => {
                if (pageSettings[key] !== null && pageSettings[key] !== undefined) {
                    url.searchParams.set(key, pageSettings[key]);
                }
            });
            window.history.pushState(null, '', url.toString());
            refetch(pageSettings, filters);
        } else {
            setToRefreshData(true);
        }
    }, [pageSettings]);

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

        if (router.query.sectionTitle) {
            setOption([{ title: router.query.sectionTitle as string }]);
        } else if (!!data?.bookSeries?.length) {
            promise = getBookSeriesById(data?.bookSeries[0])
                .then((item: BookSeriesEntity) => [
                    {
                        title: item.publishingHouse.name,
                        param: `publishingHouse=${item.publishingHouse.id}`
                    },
                    { title: item.name }
                ]);
        } else if (!!data?.bookTypes?.length) {
            promise = getBookTypeById(data?.bookTypes[0])
                .then((item: BookTypeEntity) => [{ title: item.name }]);
        } else if (!!data?.authors?.length) {
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
        ref.current.scrollIntoView();
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
                <title>{`${MAIN_NAME} - Пошук`}</title>
                <meta name="description" content={MAIN_DESC}/>
                <meta name="og:title" content={`${MAIN_NAME} - книги для дитячого розвитку`}/>
                <meta name="og:description" content={MAIN_DESC}/>
            </Head>

            <Box position="relative" ref={ref}>
                <Loading show={loading}></Loading>

                <BookFilters totalCount={totalCount}
                             defaultValues={filters}
                             onApply={(filters: BookFilter) => {
                                 setPageSettings(prev => ({ ...prev, page: 0 }));
                                 setFilters(filters)
                             }}
                             pageSettings={pageSettings}
                             showAlwaysSorting={true}
                             onSort={(settings: IPageable) => setPageSettings(settings)}></BookFilters>

                <Catalogue/>

                {!loadingOption && option && renderBackBox()}

                {items.length ? <>
                        <Grid container justifyContent="center">
                            <BooksList items={items} filters={filters} pageUrl="/books"></BooksList>
                        </Grid>

                        <Pagination rowsPerPage={pageSettings.rowsPerPage} count={totalCount}
                                    page={pageSettings.page} onRowsPerPageChange={onRowsPerPageChange}
                                    onPageChange={onPageChange}/>
                    </> :
                    (!loading &&
                      <IconWithText imageLink="/no_results.png"
                                    text="Нажаль пошук не дав результатів. Cпробуйте ще раз"/>)}

                {error && <ErrorNotification error={error}></ErrorNotification>}
            </Box>

            <RecentlyViewedBooks/>

            <DeliveriesBox/>

            <SocialMediaBox/>
        </>
    );
}