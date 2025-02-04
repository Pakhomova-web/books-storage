import { useRouter } from 'next/router';
import { Box, Grid, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import Catalogue from '@/components/catalogue';
import SocialMediaBox from '@/components/social-media-box';
import RecentlyViewedBooks from '@/components/books/recently-viewed-books';
import DeliveriesBox from '@/components/deliveries-box';
import Loading from '@/components/loading';
import { useBookSeries } from '@/lib/graphql/queries/book-series/hook';
import ErrorNotification from '@/components/error-notification';
import { borderRadius, primaryLightColor } from '@/constants/styles-variables';
import IconWithText from '@/components/icon-with-text';
import CustomImage from '@/components/custom-image';

const StyledClickableBox = styled(Box)(() => ({
    cursor: 'pointer',
    borderRadius,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    border: `1px solid ${primaryLightColor}`,
    ':hover': {
        backgroundColor: primaryLightColor
    },
    height: '100%'
}));

const StyledImageBox = styled(Box)(() => ({
    width: '100%',
    maxHeight: '200px'
}));

export default function BookSeries() {
    const router = useRouter();
    const { loading, items, gettingError } = useBookSeries(null, { name: router.query.quickSearch as string });

    return (
        <>
            <Loading show={loading}/>

            <Catalogue/>

            <Box display="flex" alignItems="center" my={1}>
                <IconButton onClick={() => router.push('/')}><HomeIcon/></IconButton>
                <Box display="flex" alignItems="center" gap={1} mr={1}>
                    <KeyboardArrowRightIcon/>
                    Серія
                    <KeyboardArrowRightIcon/>
                    {router.query.quickSearch}
                </Box>
            </Box>

            {!!items?.length ?
                <Grid container spacing={1} mb={1}>
                    {items.map((bookSeries, index) => (
                        <Grid item xs={12} sm={6} lg={4} xl={3} key={index}
                              onClick={() => router.push(`/books?bookSeries=${bookSeries.id}`)}>
                            <StyledClickableBox p={1} gap={1}>
                                <Box><b>{bookSeries.name}</b></Box>
                                <Box>Видавництво: {bookSeries.publishingHouse.name}</Box>
                                {bookSeries.imageId && <StyledImageBox><CustomImage imageId={bookSeries.imageId}/></StyledImageBox>}
                            </StyledClickableBox>
                        </Grid>
                    ))}
                </Grid> :
                (!loading &&
                  <IconWithText imageLink="/no_results.png"
                                text="Нажаль пошук не дав результатів. Cпробуйте ще раз"/>)}

            {gettingError && <ErrorNotification error={gettingError}/>}

            <RecentlyViewedBooks/>

            <SocialMediaBox/>

            <DeliveriesBox/>
        </>
    );
}
