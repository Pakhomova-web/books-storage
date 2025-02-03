import { useRouter } from 'next/router';
import { Box, Grid, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import Catalogue from '@/components/catalogue';
import SocialMediaBox from '@/components/social-media-box';
import RecentlyViewedBooks from '@/components/books/recently-viewed-books';
import DeliveriesBox from '@/components/deliveries-box';
import Loading from '@/components/loading';
import ErrorNotification from '@/components/error-notification';
import { borderRadius, primaryLightColor } from '@/constants/styles-variables';
import IconWithText from '@/components/icon-with-text';
import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import { useAuthors } from '@/lib/graphql/queries/author/hook';

const StyledClickableBox = styled(Box)(() => ({
    cursor: 'pointer',
    borderRadius,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    border: `1px solid ${primaryLightColor}`,
    ':hover': {
        backgroundColor: primaryLightColor
    }
}));

export default function Authors() {
    const router = useRouter();
    const { loading, items, gettingError } = useAuthors(null, { name: router.query.quickSearch as string });

    return (
        <>
            <Loading show={loading}/>

            <Catalogue/>

            <Box display="flex" alignItems="center" my={1}>
                <IconButton onClick={() => router.push('/')}><HomeIcon/></IconButton>
                <Box display="flex" alignItems="center" gap={1} mr={1}>
                    <KeyboardArrowRightIcon/>
                    Автор
                    <KeyboardArrowRightIcon/>
                    {router.query.quickSearch}
                </Box>
            </Box>

            {!!items?.length ?
                <Grid container spacing={1} mb={1}>
                    {items.map((author, index) => (
                        <Grid item xs={12} sm={6} lg={4} xl={3} key={index}
                              onClick={() => router.push(`/books?authors=${author.id}`)}>
                            <StyledClickableBox p={1} gap={1}>
                                <Box><b>{author.name}</b></Box>
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
