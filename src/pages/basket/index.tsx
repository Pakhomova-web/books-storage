import { Box, Grid, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import { useBooksByIds, useUpdateBookCountInBasket } from '@/lib/graphql/queries/book/hook';
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
import { getParamsQueryString, renderPrice } from '@/utils/utils';
import CustomLink from '@/components/custom-link';
import { useRouter } from 'next/router';

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
    const router = useRouter();
    const { user, setUser, setBookInBasket } = useAuth();
    const { loading, error, items } = useBooksByIds(user?.basketItems.map(({ bookId }) => bookId));
    const [countFields, setCountFields] = useState<Map<string, number>>(new Map());
    const [finalFullSum, setFinalFullSum] = useState<number>();
    const [finalSumWithDiscounts, setFinalSumWithDiscounts] = useState<number>();
    const { updating, updatingError, update } = useUpdateBookCountInBasket();

    useEffect(() => {
        if (!!items?.length) {
            const map = new Map();
            let finalSum = 0;
            let finalSumWithDiscounts = 0;

            items.forEach(({ id, price, discount }) => {
                const count = user.basketItems.find(({ bookId }) => bookId === id).count;

                map.set(id, count);
                finalSum += count * price;
                finalSumWithDiscounts += count * price * (100 - discount) / 100;
            });
            setCountFields(map);
            setFinalFullSum(finalSum);
            setFinalSumWithDiscounts(finalSumWithDiscounts);
        }
    }, [items, user]);

    function onRemoveBook(book: BookEntity) {
        setBookInBasket(book.id);
    }

    function onChangeCountInBasket(bookId: string, count: number) {
        const newCount = countFields.get(bookId) + count;

        update(bookId, newCount)
            .then(items => setUser({ ...user, basketItems: items }))
            .catch(() => {
            });
    }

    function onBookClick(book: BookEntity) {
        router.push(`/books/details?${getParamsQueryString({ id: book.id, pageUrl: '/basket' })}`);
    }

    return (
        <Box sx={positionRelative}>
            <Loading show={loading || updating}/>

            <Box sx={pageStyles}>
                <TitleBoxStyled pb={1} m={1}>Кошик</TitleBoxStyled>

                <Grid container display="flex" justifyContent="center">
                    <Grid item xs={12} sm={11} md={10} lg={9} display="flex" flexDirection="column" gap={1}
                          px={{ xs: 1 }}>
                        {items.map((book, index) => (
                            <Box key={index}>
                                <Grid container spacing={1} position="relative">
                                    {!book.numberInStock &&
                                      <Box sx={styleVariables.fixedInStockBox(false)} ml={2}>
                                        Немає в наявності
                                      </Box>}

                                    <Grid item xs={6} sm={4} md={2} lg={1} display="flex"
                                          alignItems={{ md: 'center', xs: 'flex-start' }}
                                          justifyContent={{ md: 'center', xs: 'flex-end' }}
                                          order={{ xs: 2, sm: 3, md: 1 }}>
                                        <IconButton onClick={() => onRemoveBook(book)}>
                                            <ClearIcon color={!book.numberInStock ? 'warning' : 'inherit'}/>
                                        </IconButton>
                                    </Grid>

                                    <Grid item xs={6} sm={4} md={2} display="flex" alignItems="center"
                                          justifyContent="center"
                                          order={{ xs: 1, sm: 1, md: 2 }}>
                                        <StyledImageBox>
                                            <CustomImage imageId={book.imageIds[0]} isBookDetails={true}></CustomImage>
                                        </StyledImageBox>
                                    </Grid>

                                    <Grid item xs={12} sm={4} md={4} lg={5} mt={{ xs: 2, sm: 0 }}
                                          display="flex" flexDirection="column" gap={1}
                                          order={{ xs: 3, sm: 2, md: 3 }}
                                          position="relative" alignItems={{ xs: 'center', sm: 'flex-start' }}>
                                        <Box sx={styleVariables.hintFontSize}>
                                            {book.bookSeries.publishingHouse.name}. {book.bookSeries.name}
                                        </Box>
                                        <Box sx={styleVariables.titleFontSize} textAlign="center">
                                            <CustomLink
                                                onClick={() => onBookClick(book)}><b>{book.name}</b></CustomLink>
                                        </Box>

                                        {!!book.discount &&
                                          <Box display="flex"><Box sx={styleVariables.discountBoxStyles}>
                                            Знижка: {book.discount}%
                                          </Box></Box>}

                                        <Box>{renderPrice(book.price)}</Box>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={2} order={4} mt={{ xs: 2, sm: 0 }} display="flex"
                                          flexDirection="column" gap={1}
                                          alignItems="center">
                                        Кількість
                                        <Grid container spacing={1} display="flex" flexWrap="nowrap" alignItems="center"
                                              justifyContent="center">
                                            <Grid item>
                                                <IconButton
                                                    disabled={!book.numberInStock || countFields.get(book.id) === 1}
                                                    onClick={() => onChangeCountInBasket(book.id, -1)}>
                                                    <RemoveCircleOutlineIcon fontSize="large"/>
                                                </IconButton>
                                            </Grid>
                                            <Grid item
                                                  sx={styleVariables.titleFontSize}>{countFields.get(book.id)}</Grid>
                                            <Grid item>
                                                <IconButton
                                                    disabled={!book.numberInStock || countFields.get(book.id) === book.numberInStock}
                                                    onClick={() => onChangeCountInBasket(book.id, 1)}>
                                                    <AddCircleOutlineIcon fontSize="large"/>
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={2} mt={{ xs: 2, sm: 0 }} order={5} display="flex"
                                          flexDirection="column" gap={1}
                                          alignItems="center">
                                        Кінцева ціна
                                        <Box sx={priceStyles} textAlign="center">
                                            {renderPrice(countFields.get(book.id) * book.price, book.discount)}
                                        </Box>
                                    </Grid>
                                </Grid>

                                <Grid item xs={12} mt={1}>
                                    <Box borderTop={1} borderColor={primaryLightColor} width="100%"></Box>
                                </Grid>
                            </Box>
                        ))}

                        <Grid container display="flex" alignItems="center" spacing={1} mb={2}>
                            {!loading && <>
                              <Grid item xs={7} sm={8} md={9} display="flex" justifyContent="flex-end" textAlign="end">
                                Сума замовлення без знижки:
                              </Grid>
                              <Grid item xs={5} sm={4} md={3} textAlign="center">
                                  {renderPrice(finalFullSum)}
                              </Grid>

                              <Grid item xs={12}>
                                <Box borderTop={1} borderColor={primaryLightColor} width="100%"></Box>
                              </Grid>

                              <Grid item xs={7} sm={8} md={9} display="flex" justifyContent="flex-end" textAlign="end">
                                Знижка:
                              </Grid>
                              <Grid item xs={5} sm={4} md={3} textAlign="center">
                                  {renderPrice(finalFullSum - finalSumWithDiscounts)}
                              </Grid>

                              <Grid item xs={12}>
                                <Box borderTop={1} borderColor={primaryLightColor} width="100%"></Box>
                              </Grid>

                              <Grid item xs={7} sm={8} md={9} display="flex" justifyContent="flex-end"
                                    sx={styleVariables.titleFontSize} textAlign="end">
                                <b>Кінцева сума замовлення:</b>
                              </Grid>
                              <Grid item xs={5} sm={4} md={3} display="flex" justifyContent="center">
                                <Box sx={priceStyles} textAlign="center">{renderPrice(finalSumWithDiscounts)}</Box>
                              </Grid>

                              <Grid item xs={12}>
                                <Box borderTop={1} borderColor={primaryLightColor} width="100%"></Box>
                              </Grid>
                            </>}
                        </Grid>
                    </Grid>
                </Grid>

                {error && <ErrorNotification error={error}/>}
                {updatingError && <ErrorNotification error={updatingError}/>}
            </Box>
        </Box>
    );
}
