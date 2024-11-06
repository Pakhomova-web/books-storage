import { Box, Grid, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import { useBooksByIds } from '@/lib/graphql/queries/book/hook';
import {
    borderRadius,
    boxPadding,
    pageStyles,
    positionRelative,
    primaryLightColor,
    styleVariables
} from '@/constants/styles-variables';
import Loading from '@/components/loading';
import ErrorNotification from '@/components/error-notification';
import { useAuth } from '@/components/auth-context';
import { styled } from '@mui/material/styles';
import CustomImage from '@/components/custom-image';
import { BookEntity } from '@/lib/data/types';
import { renderPrice } from '@/utils/utils';

const StyledImageBox = styled(Box)(() => ({
    width: '150px',
    height: '150px'
}));

const TitleBoxStyled = styled(Box)(({ theme }) => ({
    ...styleVariables.bigTitleFontSize(theme),
    borderBottom: `1px solid ${primaryLightColor}`,
    textAlign: 'center'
}));

const priceStyles = (theme) => ({
    color: 'var(--background)',
    fontSize: styleVariables.bigTitleFontSize(theme),
    borderRadius,
    padding: boxPadding,
    border: `1px solid ${primaryLightColor}`
});

export default function Basket() {
    const { user, setBookInBasket } = useAuth();
    const { loading, error, items, refetch } = useBooksByIds(user?.basketItems.map(({ bookId }) => bookId));
    const [countFields, setCountFields] = useState<Map<string, number>>(new Map());

    useEffect(() => {
        setCountFields(new Map());
        const map = new Map();

        items.forEach(({ id }) => {
            map.set(id, user.basketItems.find(({ bookId }) => bookId === id).count);
        });
        setCountFields(map);
    }, [items, user]);

    function onRemoveBook(book: BookEntity) {
        setBookInBasket(book.id);
    }

    function onChangeCountInBasket(bookId: string, count: number) {

    }

    return (
        <Box sx={positionRelative}>
            <Loading show={loading}/>

            <Box sx={pageStyles}>
                <TitleBoxStyled pb={1} m={1}>Кошик</TitleBoxStyled>

                <Grid container display="flex" justifyContent="center">
                    <Grid item xs={12} md={9} display="flex" flexDirection="column" gap={1}>
                        {items.map((book, index) => (
                            <Grid container key={index} p={2} borderBottom={1} borderColor={primaryLightColor} mb={1}>
                                <Grid item xs={6} sm={4} md={2} lg={1} display="flex" alignItems="center">
                                    <IconButton onClick={() => onRemoveBook(book)}>
                                        <ClearIcon color={!book.numberInStock ? 'warning' : 'inherit'}/>
                                    </IconButton>
                                </Grid>

                                <Grid item xs={6} sm={4} md={2} display="flex" alignItems="center" position="relative">
                                    {!book.numberInStock &&
                                      <Box sx={styleVariables.fixedInStockBox(false)}>Немає в наявності</Box>}

                                    <StyledImageBox>
                                        <CustomImage imageId={book.imageIds[0]} isBookDetails={true}></CustomImage>
                                    </StyledImageBox>
                                </Grid>

                                <Grid item xs={6} sm={4} md={3} display="flex" flexDirection="column" gap={1}
                                      position="relative">
                                    <Box sx={styleVariables.hintFontSize}>
                                        {book.bookSeries.publishingHouse.name}. {book.bookSeries.name}
                                    </Box>
                                    <Box sx={styleVariables.titleFontSize}><b>{book.name}</b></Box>

                                    {!!book.discount && <Box display="flex"><Box sx={styleVariables.discountBoxStyles}>
                                      Знижка: {book.discount}%
                                    </Box></Box>}

                                    <Box>{renderPrice(book.price)}</Box>
                                </Grid>

                                <Grid item xs={6} sm={4} md={2} display="flex" flexDirection="column" gap={2}
                                      alignItems="center">
                                    Кількість
                                    <Grid container spacing={2} display="flex" flexWrap="nowrap" alignItems="center"
                                          justifyContent="center">
                                        <Grid item>
                                            <IconButton disabled={!book.numberInStock || countFields.get(book.id) === 1}
                                                        onClick={() => onChangeCountInBasket(book.id, 1)}>
                                                <RemoveCircleOutlineIcon fontSize="large"/>
                                            </IconButton>
                                        </Grid>
                                        <Grid item>{countFields.get(book.id)}</Grid>
                                        <Grid item>
                                            <IconButton disabled={!book.numberInStock}
                                                        onClick={() => onChangeCountInBasket(book.id, -1)}>
                                                <AddCircleOutlineIcon fontSize="large"/>
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item xs={6} sm={4} md={2} display="flex" flexDirection="column" gap={2}
                                      alignItems="center">
                                    Кінцева ціна
                                    <Box sx={priceStyles}>{renderPrice(book.price, book.discount)}</Box>
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>

                {error && <ErrorNotification error={error}/>}
            </Box>
        </Box>
    );
}
