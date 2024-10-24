import { Box, BoxProps, Grid, IconButton, useTheme } from '@mui/material';
import React from 'react';
import Loading from '@/components/loading';
import { pageStyles, positionRelative, styleVariables } from '@/constants/styles-variables';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { useBookTypes } from '@/lib/graphql/queries/book-type/hook';
import CustomImage from '@/components/custom-image';
import useMediaQuery from '@mui/material/useMediaQuery';
import InstagramIcon from '@mui/icons-material/Instagram';
import { usePublishingHouses } from '@/lib/graphql/queries/publishing-house/hook';

const bookTypeBoxStyles = {
    borderRadius: styleVariables.borderRadius,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: styleVariables.gray
};

const StyledSocialsBox = styled(Box)(() => ({
    position: 'sticky',
    backgroundColor: 'white',
    bottom: 0,
    borderTop: `1px solid ${styleVariables.gray}`
}));

const StyledMobileBookTypeBox = styled(Box)<BoxProps>(() => ({
    padding: styleVariables.padding,
    ...bookTypeBoxStyles
}));

const StyledBookTypeBox = styled(Box)<BoxProps>(() => ({
    height: '350px',
    maxHeight: '50vh',
    position: 'relative',
    flexDirection: 'column',
    overflow: 'hidden',
    ...bookTypeBoxStyles,
    ':hover .bookTypeBox': {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
}));

const imageBoxStyles = {
    height: '100%',
    width: '100%'
};

const bookTypeNameStyles = {
    ...styleVariables.titleFontSize,
    position: 'absolute',
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.8)',
    width: '100%',
    padding: styleVariables.doublePadding,
    textAlign: 'center'
};

const mobileImageBoxStyles = {
    height: '70px',
    width: '70px',
    overflow: 'hidden'
};

export default function Home() {
    const { loading: loadingBookTypes, items: bookTypes } = useBookTypes({ orderBy: 'name', order: 'asc' });
    const { loading: loadingPublishingHouses, items: publishingHouses } = usePublishingHouses({
        orderBy: 'name',
        order: 'asc'
    });
    const router = useRouter();
    const theme = useTheme();
    const mobileMatches = useMediaQuery(theme.breakpoints.down('md'));

    function onInstagramClick() {
        window.open('https://instagram.com/ph_smart_kids', "_blank")
    }

    return (
        <Box sx={positionRelative}>
            <Loading show={loadingBookTypes || loadingPublishingHouses}></Loading>

            <Box sx={pageStyles}>
                {!!bookTypes?.length &&
                  <Grid container>
                    <Grid item xs={12} p={2} sx={styleVariables.bigTitleFontSize}>Типи книг</Grid>

                      {bookTypes?.map((type, index) => (
                          mobileMatches ?
                              <Grid xs={12} sm={6} key={index} item p={1}
                                    onClick={() => router.push(`/books?bookType=${type.id}`)}>
                                  <StyledMobileBookTypeBox gap={2}>
                                      <Box sx={mobileImageBoxStyles}>
                                          <CustomImage imageId={type.imageId} isBookType={true}></CustomImage>
                                      </Box>
                                      {type.name}
                                  </StyledMobileBookTypeBox>
                              </Grid> :
                              <Grid key={index} item p={1} md={3} lg={2}
                                    onClick={() => router.push(`/books?bookType=${type.id}`)}>
                                  <StyledBookTypeBox>
                                      <Box sx={imageBoxStyles}>
                                          <CustomImage imageId={type.imageId} isBookType={true}></CustomImage>
                                      </Box>
                                      <Box sx={bookTypeNameStyles} className="bookTypeBox">{type.name}</Box>
                                  </StyledBookTypeBox>
                              </Grid>
                      ))}
                  </Grid>
                }

                {!!publishingHouses?.length &&
                  <Grid container>
                    <Grid item xs={12} p={2} sx={styleVariables.bigTitleFontSize}>Видавництва</Grid>

                      {publishingHouses.map((publishingHouse, index) =>
                          <Grid xs={12} sm={6} md={3} lg={2} key={index} item p={1}
                                onClick={() => router.push(`/books?publishingHouse=${publishingHouse.id}`)}>
                              <StyledMobileBookTypeBox gap={2}>
                                  <Box sx={mobileImageBoxStyles}>
                                      <CustomImage imageId={publishingHouse.imageId} isBookType={true}></CustomImage>
                                  </Box>
                                  {publishingHouse.name}
                              </StyledMobileBookTypeBox>
                          </Grid>)}
                  </Grid>
                }

                <StyledSocialsBox display="flex" alignItems="center" gap={2} width="100%" p={1} mt={1}
                                  justifyContent="end">
                    <Box>Соц. мережі:</Box>
                    <IconButton onClick={onInstagramClick}><InstagramIcon color="primary"
                                                                          fontSize="medium"/></IconButton>
                </StyledSocialsBox>
            </Box>
        </Box>
    );
}