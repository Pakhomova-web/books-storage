import { Box, Grid } from '@mui/material';
import React from 'react';
import { styled } from '@mui/material/styles';

import CustomImage from '@/components/custom-image';
import { borderRadius, greenLightColor, redLightColor, styleVariables } from '@/constants/styles-variables';
import { renderPrice } from '@/utils/utils';

const bookBoxStyles = { height: '250px', maxHeight: '50vw' };

const bookPriceStyles = (inStock = true) => ({
    ...styleVariables.titleFontSize,
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

const inStockStyles = (inStock = true) => ({
    backgroundColor: inStock ? greenLightColor : redLightColor,
    borderRadius,
    padding: styleVariables.boxPadding,
    display: 'flex',
    alignItems: 'center'
});

export default function BookBox({ book, key, onClick, isAdmin }) {
    return (
        <StyledGrid item key={key} xl={2} md={3} sm={4} xs={6} p={2}
                    onClick={onClick}>
            <Box display="flex"
                 flexDirection="column"
                 alignItems="center"
                 justifyContent="space-between"
                 height="100%">
                <Box sx={bookBoxStyles} mb={1}>
                    <CustomImage isBookDetails={true}
                                 imageId={book.imageIds[0]}></CustomImage>
                </Box>
                <Box sx={bookInfoStyles} textAlign="center">
                    {book.bookSeries.publishingHouse.name}{book.bookSeries.name === '-' ? '' : `. ${book.bookSeries.name}`}
                </Box>
                <Box sx={styleVariables.titleFontSize} textAlign="center" mb={1}>{book.name}</Box>

                <Box display="flex" mb={1}>
                    {book.numberInStock ?
                        <Box sx={inStockStyles(true)}>
                            В наявності{isAdmin && ` (${book.numberInStock})`}
                        </Box> :
                        <Box sx={inStockStyles(false)}>Немає в наявності</Box>
                    }
                </Box>
                <Box sx={bookPriceStyles(!!book.numberInStock)}>{renderPrice(book.price)} грн</Box>
            </Box>
        </StyledGrid>
    );
}