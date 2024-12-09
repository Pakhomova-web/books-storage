import { Box, Button, Grid, IconButton } from '@mui/material';
import React from 'react';
import { styled } from '@mui/material/styles';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

import CustomImage from '@/components/custom-image';
import { borderRadius, styleVariables } from '@/constants/styles-variables';
import { getParamsQueryString, renderPrice } from '@/utils/utils';
import { BookEntity } from '@/lib/data/types';
import { useAuth } from '@/components/auth-context';
import { useRouter } from 'next/router';

const bookBoxStyles = { height: '250px', maxHeight: '50vw' };

const bookPriceStyles = (theme, inStock = true) => ({
    ...styleVariables.titleFontSize,
    color: inStock ? theme.palette.primary.main : 'black',
    ...(inStock ? styleVariables.boldFont : {})
});

const bookInfoStyles = {
    ...styleVariables.hintFontSize
};

const StyledGrid = styled(Grid)(() => ({
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: styleVariables.gray,
        borderRadius
    }
}));

export default function BooksList({ items, filters = {}, pageUrl = '/' }) {
    const { user, setLikedBook, setBookInBasket } = useAuth();
    const router = useRouter();

    function onLike(e, book: BookEntity) {
        e.stopPropagation();
        setLikedBook(book.id);
    }

    function isLiked(book: BookEntity) {
        return user?.likedBookIds?.some(id => id === book.id);
    }

    function isBookInBasket(book: BookEntity) {
        return user?.basketItems?.some(item => item.bookId === book.id);
    }

    function onBuy(e, book: BookEntity) {
        e.stopPropagation();
        setBookInBasket(book.id);
    }

    function onClick(book: BookEntity) {
        const filterQueries: string[] = Object.keys(filters)
            .map(key => !(filters[key] === null || filters[key] === undefined || filters[key].length === 0) ? `${key}=${filters[key]}` : '')
            .filter(query => !!query);
        const query = !!filterQueries.length ? filterQueries.join('&') : router.query.filters;

        router.push(`/books/details?${getParamsQueryString({ id: book.id, filters: query, pageUrl })}`);
    }

    return (
        items.map(((book, index) => (
            <StyledGrid item key={index} xl={2} lg={3} md={4} xs={6} p={1} onClick={() => onClick(book)}>
                <Box display="flex"
                     flexDirection="column"
                     alignItems="center"
                     justifyContent="space-between"
                     position="relative"
                     height="100%">
                    {!!book.discount && <Box sx={styleVariables.fixedDiscountBox()}>Знижка: {book.discount}%</Box>}

                    <Box sx={bookBoxStyles} mb={1} mt={book.discount ? 1 : 0}>
                        <CustomImage isBookDetails={true} imageId={book.imageIds[0]}></CustomImage>
                    </Box>
                    <Box sx={bookInfoStyles} textAlign="center">
                        {book.bookSeries.publishingHouse.name}{book.bookSeries.default ? '' : `. ${book.bookSeries.name}`}
                    </Box>
                    <Box sx={styleVariables.titleFontSize} textAlign="center" mb={1}>{book.name}</Box>

                    <Box sx={styleVariables.hintFontSize} mb={1}>
                        {book.language.name}
                    </Box>

                    <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={1} flexWrap="wrap">
                        <Box sx={theme => bookPriceStyles(theme, !!book.numberInStock)}>
                            {renderPrice(book.price, book.discount)}
                        </Box>
                        {!!book.discount && <Box sx={styleVariables.hintFontSize}>
                          <s>{renderPrice(book.price)}</s>
                        </Box>}
                    </Box>


                    <Grid container display="flex" alignItems="center">
                        <Grid item xs={9}>
                            {isBookInBasket(book) ?
                                <Button variant="outlined" fullWidth disabled={true}>В кошику</Button> :
                                <Button variant="outlined" fullWidth
                                        onClick={e => onBuy(e, book)}
                                        disabled={!book.numberInStock}>
                                    {!!book.numberInStock ? 'Купити' : 'Очікується'}
                                </Button>}
                        </Grid>

                        <Grid item xs={3} textAlign="center">
                            <IconButton onClick={e => onLike(e, book)} color="warning">
                                <Box gap={1} display="flex" alignItems="center">
                                    {isLiked(book) ? <FavoriteIcon/> : <FavoriteBorderIcon/>}
                                </Box>
                            </IconButton>
                        </Grid>
                    </Grid>
                </Box>
            </StyledGrid>
        )))
    );
}