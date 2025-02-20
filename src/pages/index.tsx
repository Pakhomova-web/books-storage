import { Box, Grid, useTheme } from '@mui/material';
import React from 'react';
import { styled } from '@mui/material/styles';
import Head from 'next/head';

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

const bookTypeBoxStyles = {
    borderRadius,
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
    left: 0,
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
    const theme = useTheme();
    const mobileMatches = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <>
            <Head>
                <title>{`${MAIN_NAME} - книги для дитячого розвитку`}</title>
                <meta name="description" content={MAIN_DESC}/>
                <meta name="og:title" content={`${MAIN_NAME} - книги для дитячого розвитку`}/>
                <meta name="og:description" content={MAIN_DESC}/>
                <meta name="image"
                      content="https://drive.google.com/thumbnail?id=1S6gg2YYTNbwR-NFowA0P2a4XA4dK21Ds&sz=w500"/>
                <meta name="og:image"
                      content="https://drive.google.com/thumbnail?id=1S6gg2YYTNbwR-NFowA0P2a4XA4dK21Ds&sz=w500"/>
            </Head>

            <SocialMediaBox/>

            <DiscountBooks/>

            <Grid container position="relative" mb={1} justifyContent="center">
                <Loading show={loadingBookTypes} isSmall={true}></Loading>

                <h1>Каталог</h1>
                <Catalogue opened={true}/>

                {!!bookTypes?.length &&
                  <Grid container spacing={1} justifyContent="center" mt={1}>
                      {bookTypes?.map((type, index) => (
                          mobileMatches ?
                              <Grid xs={12} sm={6} key={index} item>
                                  <a href={`/books?bookTypes=${type.id}`}>
                                      <Box sx={bookTypeBoxStyles} gap={1} p={1}>
                                          <Box sx={mobileImageBoxStyles}>
                                              <CustomImage imageId={type.imageId} isBookType={true}></CustomImage>
                                          </Box>
                                          {type.name}
                                      </Box>
                                  </a>
                              </Grid> :
                              <Grid key={index} item md={4} lg={3} xl={2}>
                                  <StyledBookTypeBox>
                                      <a href={`/books?bookTypes=${type.id}`}>
                                          <Box sx={imageBoxStyles}>
                                              <CustomImage imageId={type.imageId} isBookType={true}></CustomImage>
                                          </Box>
                                          <Box sx={bookTypeNameStyles} p={2}>{type.name}</Box>
                                      </a>
                                  </StyledBookTypeBox>
                              </Grid>
                          ))}
                  </Grid>}
            </Grid>

            <Box display="flex" justifyContent="center"><h1>{MAIN_NAME} - книги для дитячого розвитку</h1></Box>

            <DeliveriesBox/>
        </>
    );
}