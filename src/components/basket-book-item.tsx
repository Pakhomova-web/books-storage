import { Box, Grid, IconButton } from '@mui/material';
import React from 'react';
import { useRouter } from 'next/router';
import ClearIcon from '@mui/icons-material/Clear';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { styled } from '@mui/material/styles';

import { priceStyles, primaryLightColor, styleVariables } from '@/constants/styles-variables';
import CustomImage from '@/components/custom-image';
import CustomLink from '@/components/custom-link';
import { getParamsQueryString, renderPrice } from '@/utils/utils';
import { BookEntity } from '@/lib/data/types';
import { useAuth } from '@/components/auth-context';

const StyledImageBox = styled(Box)(() => ({
    width: '150px',
    height: '150px'
}));

interface IProps {
    book: BookEntity,
    price?: number,
    discount?: number,
    editable?: boolean,
    count: number,
    pageUrl?: string,
    onRemove?: Function,
    onCountChange?: (count: number) => void
}

export default function BasketBookItem({ book, editable, price, discount, count, pageUrl, onCountChange, onRemove }: IProps) {
    const router = useRouter();
    const { setBookInBasket } = useAuth();

    function onBookClick(book: BookEntity) {
        router.push(`/books/details?${getParamsQueryString({ id: book.id, pageUrl: pageUrl || '/basket' })}`);
    }

    function onRemoveBook(book: BookEntity) {
        if (!onRemove) {
            setBookInBasket(book.id);
        } else {
            onRemove();
        }
    }

    return (
        <Grid container spacing={1} position="relative" alignItems="center">
            {editable && !book.numberInStock &&
              <Box sx={styleVariables.fixedInStockBox(false)} ml={2}>
                Немає в наявності
              </Box>}

            {editable && <Grid item sm={4} md={2} lg={1}
                               display={{ xs: 'none', md: 'flex' }}
                               alignItems="center"
                               justifyContent="center">
              <IconButton onClick={() => onRemoveBook(book)}>
                <ClearIcon color={!book.numberInStock ? 'warning' : 'inherit'}/>
              </IconButton>
            </Grid>}

            <Grid item xs={3} md={2} display="flex" alignItems="center"
                  justifyContent="center">
                <StyledImageBox>
                    <CustomImage imageId={book.imageIds[0]} isBookDetails={true}></CustomImage>
                </StyledImageBox>
            </Grid>

            <Grid item xs={9} md={editable ? 4 : 5} lg={editable ? 5 : 6}>
                <Grid container spacing={1}>
                    <Grid item xs={10} mt={{ xs: 2, sm: 0 }}
                          display="flex" flexDirection="column" gap={1}
                          position="relative" alignItems={{ xs: 'center', sm: 'flex-start' }}>
                        <Box sx={styleVariables.hintFontSize}>
                            {book.bookSeries.publishingHouse.name}. {book.bookSeries.name}
                        </Box>
                        <Box sx={styleVariables.titleFontSize} textAlign="center">
                            <CustomLink
                                onClick={() => onBookClick(book)}><b>{book.name}</b></CustomLink>
                        </Box>
                        <Box>{book.languages.map(l => l.name).join(', ')}</Box>

                        {!!(discount || book.discount) &&
                          <Box display="flex"><Box sx={styleVariables.discountBoxStyles}>
                            Знижка: {discount || book.discount}%
                          </Box></Box>}

                        <Box>{renderPrice(price || book.price)}</Box>
                    </Grid>

                    {editable && <Grid item xs={2} display={{ md: 'none', xs: 'flex' }} alignItems="start"
                                       justifyContent="center">
                      <IconButton onClick={() => onRemoveBook(book)}>
                        <ClearIcon color={!book.numberInStock ? 'warning' : 'inherit'}/>
                      </IconButton>
                    </Grid>}
                </Grid>
            </Grid>

            <Grid item xs={6} md={2} mt={{ xs: 2, sm: 0 }} display="flex"
                  flexDirection="column" gap={1}
                  alignItems="center">
                Кількість
                <Grid container spacing={1} display="flex" flexWrap="nowrap" alignItems="center"
                      justifyContent="center">
                    {editable && <Grid item>
                      <IconButton
                        disabled={!book.numberInStock || count === 1}
                        onClick={() => onCountChange(-1)}>
                        <RemoveCircleOutlineIcon fontSize="large"/>
                      </IconButton>
                    </Grid>}

                    <Grid item sx={styleVariables.titleFontSize}>{count}</Grid>

                    {editable && <Grid item>
                      <IconButton
                        disabled={!book.numberInStock || count === book.numberInStock}
                        onClick={() => onCountChange(1)}>
                        <AddCircleOutlineIcon fontSize="large"/>
                      </IconButton>
                    </Grid>}
                </Grid>
            </Grid>

            <Grid item xs={6} md={2} mt={{ xs: 2, sm: 0 }} display="flex"
                  flexDirection="column" gap={1}
                  alignItems="center">
                Кінцева ціна
                <Box sx={priceStyles} textAlign="center">
                    {renderPrice(count * (price || book.price), (discount || book.discount))}
                </Box>
            </Grid>

            <Grid item xs={12} mt={1}>
                <Box borderTop={1} borderColor={primaryLightColor} width="100%"></Box>
            </Grid>
        </Grid>
    );
}
