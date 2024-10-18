import { Box, BoxProps, Grid, useTheme } from '@mui/material';
import React from 'react';
import Loading from '@/components/loading';
import { pageStyles, positionRelative, styleVariables } from '@/constants/styles-variables';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { useBookTypes } from '@/lib/graphql/queries/book-type/hook';
import CustomImage from '@/components/custom-image';
import useMediaQuery from '@mui/material/useMediaQuery';

const bookTypeBoxStyles = {
    borderRadius: styleVariables.borderRadius,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: styleVariables.gray,
    ':hover': {
        transform: 'scale(1.02)'
    }
};

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
    ...bookTypeBoxStyles
}));

const imageBoxStyles = {
    height: '100%',
    width: '100%'
};

const bookTypeNameStyles = {
    ...styleVariables.titleFontSize,
    position: 'absolute',
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.5)',
    width: '100%',
    padding: styleVariables.doublePadding,
    textAlign: 'center'
};

const mobileImageBoxStyles = {
    height: '50px',
    width: '50px',
    borderRadius: '50%',
    overflow: 'hidden'
};

export default function Home() {
    const { loading, items } = useBookTypes({ orderBy: 'name', order: 'asc' });
    const router = useRouter();
    const theme = useTheme();
    const mobileMatches = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box sx={positionRelative}>
            <Loading show={loading}></Loading>

            <Box sx={pageStyles} p={1}>
                {!!items?.length &&
                  <Grid container>
                      {items?.map((type, index) => (
                          mobileMatches ?
                              <Grid xs={12} sm={6} key={index} item p={1}>
                                  <StyledMobileBookTypeBox gap={2}
                                                           onClick={() => router.push(`/books?bookTypeId=${type.id}`)}>
                                      <Box sx={mobileImageBoxStyles}>
                                          <CustomImage imageId={type.imageId} isBookType={true}></CustomImage>
                                      </Box>
                                      {type.name}
                                  </StyledMobileBookTypeBox>
                              </Grid> :
                              <Grid key={index} item p={1} md={3} lg={2}>
                                  <StyledBookTypeBox>
                                      <Box sx={imageBoxStyles}>
                                          <CustomImage imageId={type.imageId} isBookType={true}></CustomImage>
                                      </Box>
                                      <Box sx={bookTypeNameStyles}>{type.name}</Box>
                                  </StyledBookTypeBox>
                              </Grid>
                      ))}
                  </Grid>
                }
            </Box>
        </Box>
    );
}