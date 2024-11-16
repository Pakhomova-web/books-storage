import { Box, BoxProps, Button, Grid, useTheme } from '@mui/material';
import React from 'react';
import Loading from '@/components/loading';
import { borderRadius, pageStyles, positionRelative, styleVariables } from '@/constants/styles-variables';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { useBookTypes } from '@/lib/graphql/queries/book-type/hook';
import CustomImage from '@/components/custom-image';
import useMediaQuery from '@mui/material/useMediaQuery';
import { usePublishingHouses } from '@/lib/graphql/queries/publishing-house/hook';
import SocialMediaBox from '@/components/social-media-box';
import BooksList from '@/components/books-list';
import { useBooksWithDiscounts } from '@/lib/graphql/queries/book/hook';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const bookTypeBoxStyles = {
    borderRadius,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: styleVariables.gray
};

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
    textAlign: 'center'
};

const mobileImageBoxStyles = {
    height: '70px',
    width: '70px',
    overflow: 'hidden'
};

const rowsPerPageBooksWithDiscount = 5;

export default function Home() {
    const { loading: loadingBookTypes, items: bookTypes } = useBookTypes({ orderBy: 'name', order: 'asc' });
    const {
        loading: loadingBooksWithDiscounts,
        items: booksWithDiscounts
    } = useBooksWithDiscounts(rowsPerPageBooksWithDiscount);
    const { loading: loadingPublishingHouses, items: publishingHouses } = usePublishingHouses({
        orderBy: 'name',
        order: 'asc'
    });
    const router = useRouter();
    const theme = useTheme();
    const mobileMatches = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box sx={positionRelative}>
            <Loading show={loadingBookTypes && loadingBooksWithDiscounts && loadingPublishingHouses}></Loading>

            <Box sx={pageStyles}>
                <Grid container sx={positionRelative}>
                    <Loading
                        show={loadingBooksWithDiscounts && (!loadingBookTypes && loadingPublishingHouses || loadingBookTypes && !loadingPublishingHouses)}></Loading>

                    {(loadingBooksWithDiscounts && !booksWithDiscounts?.length ||
                            !loadingBooksWithDiscounts && !!booksWithDiscounts?.length) &&
                      <Grid item xs={12} p={2} display="flex" justifyContent="center"
                            mb={loadingBooksWithDiscounts ? 1 : 0}
                            sx={styleVariables.sectionTitle}>
                        Акційні товари
                      </Grid>}

                    {!!booksWithDiscounts?.length && <>
                      <Grid item xs={12} display="flex" justifyContent="center">
                        <BooksList items={booksWithDiscounts}></BooksList>
                      </Grid>

                        {booksWithDiscounts?.length === rowsPerPageBooksWithDiscount &&
                          <Grid item xs={12} textAlign="center">
                            <Button variant="outlined" onClick={() => router.push(`/books?withDiscount=true`)}>
                              Подивитися усі книги<ArrowForwardIcon/></Button>
                          </Grid>}
                    </>}
                </Grid>


                <Grid container sx={positionRelative} mb={loadingBookTypes ? 1 : 0}>
                    <Loading
                        show={loadingBookTypes && (!loadingPublishingHouses && loadingBooksWithDiscounts || loadingPublishingHouses && !loadingBooksWithDiscounts)}></Loading>

                    <Grid item xs={12} p={2} display="flex" justifyContent="center" sx={styleVariables.sectionTitle}>
                        Типи книг
                    </Grid>

                    {!!bookTypes?.length && bookTypes?.map((type, index) => (
                        mobileMatches ?
                            <Grid xs={12} sm={6} key={index} item p={1}
                                  onClick={() => router.push(`/books?bookType=${type.id}`)}>
                                <Box sx={bookTypeBoxStyles} gap={1} p={1}>
                                    <Box sx={mobileImageBoxStyles}>
                                        <CustomImage imageId={type.imageId} isBookType={true}></CustomImage>
                                    </Box>
                                    {type.name}
                                </Box>
                            </Grid> :
                            <Grid key={index} item p={1} md={3} lg={2}
                                  onClick={() => router.push(`/books?bookType=${type.id}`)}>
                                <StyledBookTypeBox>
                                    <Box sx={imageBoxStyles}>
                                        <CustomImage imageId={type.imageId} isBookType={true}></CustomImage>
                                    </Box>
                                    <Box sx={bookTypeNameStyles} p={2} className="bookTypeBox">{type.name}</Box>
                                </StyledBookTypeBox>
                            </Grid>
                    ))}
                </Grid>

                <Grid container sx={positionRelative}>
                    <Loading
                        show={loadingPublishingHouses && (!loadingBookTypes && loadingBooksWithDiscounts || loadingBookTypes && !loadingBooksWithDiscounts)}></Loading>

                    <Grid item xs={12} p={2} display="flex" justifyContent="center" sx={styleVariables.sectionTitle}>
                        Видавництва
                    </Grid>

                    {!!publishingHouses?.length && publishingHouses.map((publishingHouse, index) =>
                        <Grid xs={12} sm={6} md={3} lg={2} key={index} item p={1}
                              onClick={() => router.push(`/books?publishingHouse=${publishingHouse.id}`)}>
                            <Box sx={bookTypeBoxStyles} gap={1} p={1}>
                                <Box sx={mobileImageBoxStyles}>
                                    <CustomImage imageId={publishingHouse.imageId}
                                                 isBookType={true}></CustomImage>
                                </Box>
                                {publishingHouse.name}
                            </Box>
                        </Grid>)}
                </Grid>

                <SocialMediaBox></SocialMediaBox>
            </Box>
        </Box>
    );
}