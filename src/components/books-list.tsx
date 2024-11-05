import { Box, Button, Grid, IconButton } from '@mui/material';
import React from 'react';
import { styled } from '@mui/material/styles';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

import CustomImage from '@/components/custom-image';
import { borderRadius, styleVariables } from '@/constants/styles-variables';
import { renderPrice } from '@/utils/utils';
import { BookEntity } from '@/lib/data/types';
import { useAuth } from '@/components/auth-context';

const bookBoxStyles = { height: '250px', maxHeight: '50vw' };

const bookPriceStyles = (inStock = true) => ({
    ...styleVariables.titleFontSize,
    color: inStock ? 'var(--background)' : 'black',
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

export default function BooksList({ items, onClick }) {
    const { user, setLikedBook, setBookInBasket } = useAuth();

    function onLike(e, book: BookEntity) {
        e.stopPropagation();
        setLikedBook(book.id);
    }

    function isLiked(book: BookEntity) {
        return user?.likedBookIds?.some(id => id === book.id);
    }

    function isBookInBasket(book: BookEntity) {
        return user?.bookIdsInBasket?.some(id => id === book.id);
    }

    function onBuy(e, book: BookEntity) {
        e.stopPropagation();
        setBookInBasket(book.id);
    }

    return (
        items.map(((book, index) => (
            <StyledGrid item key={index} xl={2} md={3} sm={4} xs={6} p={2} onClick={() => onClick(book)}>
                <Box display="flex"
                     flexDirection="column"
                     alignItems="center"
                     justifyContent="space-between"
                     position="relative"
                     height="100%">
                    {!!book.discount && <Box sx={styleVariables.discountBoxStyles()}>Знижка: {book.discount}%</Box>}

                    <Box sx={bookBoxStyles} mb={1} mt={book.discount ? 1 : 0}>
                        <CustomImage isBookDetails={true} imageId={book.imageIds[0]}></CustomImage>
                    </Box>
                    <Box sx={bookInfoStyles} textAlign="center">
                        {book.bookSeries.publishingHouse.name}{book.bookSeries.name === '-' ? '' : `. ${book.bookSeries.name}`}
                    </Box>
                    <Box sx={styleVariables.titleFontSize} textAlign="center" mb={1}>{book.name}</Box>

                    {!!book.discount && <Box sx={styleVariables.hintFontSize} mb={1}>
                      <s>{renderPrice(book.price)}</s>
                    </Box>}
                    <Box sx={bookPriceStyles(!!book.numberInStock)}
                         mb={1}>{renderPrice(book.price, book.discount)}</Box>

                    <Grid container spacing={1}>
                        <Grid item xs={8}>
                            {isBookInBasket(book) ?
                                <Button variant="outlined" fullWidth disabled={true}>В кошику</Button> :
                                <Button variant="outlined" fullWidth
                                        onClick={e => onBuy(e, book)}
                                        disabled={!book.numberInStock}>
                                    {!!book.numberInStock ? 'Купити' : 'Очікується'}
                                </Button>}
                        </Grid>

                        <Grid item xs={4} textAlign="center">
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