import { Box, Grid, useTheme } from '@mui/material';
import React from 'react';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';

import Loading from '@/components/loading';
import { borderRadius, styleVariables } from '@/constants/styles-variables';
import { useBookTypes } from '@/lib/graphql/queries/book-type/hook';
import CustomImage from '@/components/custom-image';
import useMediaQuery from '@mui/material/useMediaQuery';
import SocialMediaBox from '@/components/social-media-box';
import DeliveriesBox from '@/components/deliveries-box';
import { MAIN_DESC, MAIN_NAME } from '@/constants/main-name';
import DiscountBooks from '@/components/books/discount-books';
import Catalogue from '@/components/catalogue';
import Head from 'next/head';

const bookTypeBoxStyles = {
    borderRadius,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: styleVariables.gray
};

const StyledBookTypeBox = styled(Box)(({ theme }) => ({
    [theme.breakpoints.up('lg')]: {
        height: '300px'
    },
    height: '250px',
    maxHeight: '50vh',
    position: 'relative',
    justifyContent: 'center',
    flexDirection: 'column',
    overflow: 'hidden',
    ...bookTypeBoxStyles
}));

const imageBoxStyles = {
    width: '100%'
};

const bookTypeNameStyles = {
    ...styleVariables.titleFontSize,
    position: 'absolute',
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.8)',
    width: '100%',
    textAlign: 'center'
};

const mobileImageBoxStyles = {
    height: '70px',
    width: '70px',
    overflow: 'hidden'
};

export default function Home() {
    const { loading: loadingBookTypes, items: bookTypes } = useBookTypes({ orderBy: 'name', order: 'asc' });
    const router = useRouter();
    const theme = useTheme();
    const mobileMatches = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <>
            <Head>
                <title>{MAIN_NAME} - книги для дитячого розвитку</title>
                <meta name="description" content={MAIN_DESC}/>
                <meta name="og:title" content={`${MAIN_NAME} - книги для дитячого розвитку`}/>
                <meta name="og:description" content={MAIN_DESC}/>
            </Head>

            <SocialMediaBox/>

            <Catalogue/>

            <DiscountBooks/>

            <Grid container position="relative" mb={1} justifyContent="center">
                <Loading show={loadingBookTypes} isSmall={true}></Loading>

                <Grid item xs={12} sx={styleVariables.sectionTitle} mb={1}>Категорії</Grid>

                {!!bookTypes?.length &&
                  <Grid container spacing={1} justifyContent="center">
                      {bookTypes?.map((type, index) => (
                          mobileMatches ?
                              <Grid xs={12} sm={6} key={index} item
                                    onClick={() => router.push(`/books?bookTypes=${type.id}`)}>
                                  <Box sx={bookTypeBoxStyles} gap={1} p={1}>
                                      <Box sx={mobileImageBoxStyles}>
                                          <CustomImage imageId={type.imageId} isBookType={true}></CustomImage>
                                      </Box>
                                      {type.name}
                                  </Box>
                              </Grid> :
                              <Grid key={index} item md={4} lg={3} xl={2}
                                    onClick={() => router.push(`/books?bookTypes=${type.id}`)}>
                                  <StyledBookTypeBox>
                                      <Box sx={imageBoxStyles}>
                                          <CustomImage imageId={type.imageId} isBookType={true}></CustomImage>
                                      </Box>
                                      <Box sx={bookTypeNameStyles} p={2}>{type.name}</Box>
                                  </StyledBookTypeBox>
                              </Grid>
                      ))}
                  </Grid>}
            </Grid>

            <h1 className="centerText">{MAIN_NAME} - книги для дитячого розвитку</h1>

            <DeliveriesBox/>
        </>
    );
}