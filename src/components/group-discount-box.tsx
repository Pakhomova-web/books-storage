import { Box, Button, Grid, IconButton, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { LocalMall } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import useMediaQuery from '@mui/material/useMediaQuery';
import ClearIcon from '@mui/icons-material/Clear';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { styled } from '@mui/material/styles';

import CustomImage from '@/components/custom-image';
import { priceStyles, primaryLightColor, styleVariables, warnColor } from '@/constants/styles-variables';
import { isAdmin, renderPrice } from '@/utils/utils';
import { useAuth } from '@/components/auth-context';

const StyledContainer = styled(Box)(() => ({
    width: '250px',
    maxHeight: '300px',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap'
}));

const CircleBox = styled(Box)(({ theme }) => ({
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    border: `1px solid ${primaryLightColor}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.primary.main,
    backgroundColor: 'white',
    zIndex: 2
}));

const StyledDivider = styled(Box)(() => ({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ':before': {
        content: '""',
        height: '250px',
        position: 'absolute',
        top: 0,
        right: '16px',
        borderRight: `1px solid ${primaryLightColor}`
    }
}))

export default function GroupDiscountBox({
                                             books,
                                             count = 1,
                                             onCountChange = null,
                                             key = null,
                                             discount,
                                             editable = true,
                                             onDeleteBook = null,
                                             onEditBook = null,
                                             onBuyClick = null,
                                             isInBasket = false,
                                             onDeleteGroupClick = null,
                                             onBookClick = null
                                         }) {
    const [fullSum, setFullSum] = useState<number>();
    const { user } = useAuth();
    const theme = useTheme();
    const mobileMatches = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        setFullSum(count * books.reduce((a, b) => a + b.price, 0));
    }, [books, count])

    return (
        !!books.length &&
      <>
          {!!onCountChange && <>
            <Box sx={styleVariables.sectionTitle}>
              <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
                Акційний комплект
                  {editable && !!onDeleteGroupClick &&
                    <IconButton onClick={onDeleteGroupClick}><ClearIcon/></IconButton>}
              </Box>
            </Box>
          </>}

        <Box display="flex" gap={1} py={2} width="100%" overflow="hidden" key={key} justifyContent="center"
             flexDirection={{ xs: 'column', sm: 'row' }} alignItems="center">

          <Box sx={{ overflowX: 'scroll', overflowY: 'hidden' }} display="flex" gap={1} width="100%"
               justifyContent="flex-end">
              {books.map((book, index) =>
                  (<>
                      {index !== 0 && <StyledDivider><CircleBox>+</CircleBox></StyledDivider>}

                      <StyledContainer key={index} gap={1}>
                          <Box display="flex" alignItems="center" justifyContent="space-between"
                               flexDirection="column"
                               gap={1} width="100%"
                               position="relative" px={1}>
                              <Box display="flex" alignItems="center" justifyContent="center" gap={1}
                                   flexDirection="column" className={!!onBookClick ? 'cursor-pointer' : ''}
                                   position="relative"
                                   onClick={() => !!onBookClick && onBookClick(book.id)}>
                                  {isAdmin(user) ?
                                      <Box sx={styleVariables.fixedInStockBox(!!book.numberInStock)} ml={2}>
                                          {!book.numberInStock ? 'Немає в наявності' : `В наявності (${book.numberInStock})`}
                                      </Box> :
                                      !book.numberInStock &&
                                    <Box sx={styleVariables.fixedInStockBox(false)} ml={2}>
                                      Немає в наявності
                                    </Box>
                                  }

                                  <Box height="120px" width="120px">
                                      <CustomImage imageId={book.imageIds[0]}/>
                                  </Box>
                                  <Box textAlign="center">
                                      {book.bookSeries.default ? '' : `${book.bookSeries.name}. `}{book.name}
                                  </Box>
                                  <Box sx={styleVariables.hintFontSize}>
                                      {book.languages.map(l => l.name).join(', ')}
                                  </Box>
                                  <Box><b>{renderPrice(book.price)}</b></Box>
                              </Box>

                              {editable && !!onDeleteBook &&
                                <Button variant="outlined" color="warning" onClick={() => onDeleteBook(book.id)}>
                                  Видалити
                                </Button>}
                          </Box>
                      </StyledContainer>
                  </>))}

              {!mobileMatches && <StyledDivider><CircleBox>=</CircleBox></StyledDivider>}
          </Box>

          <StyledContainer gap={1}>
            <Box display="flex" flexDirection="column" alignItems="center" gap={2} justifyContent="center"
                 width="100%">

                {editable && !!onCountChange && <>
                  <Box sx={{ ...styleVariables.hintFontSize, color: warnColor }} textAlign="center">
                      {books.some(b => b.numberInStock < count) && 'Деяких позицій не вистачає в наявності'}
                  </Box>

                  <Grid container spacing={1} display="flex" flexWrap="nowrap" alignItems="center"
                        justifyContent="center">

                    <Grid item>
                      <IconButton onClick={() => onCountChange(-1)}
                                  disabled={count === 1}>
                        <RemoveCircleOutlineIcon fontSize="large"/>
                      </IconButton>
                    </Grid>

                    <Grid item sx={styleVariables.titleFontSize}>{count}</Grid>

                    <Grid item>
                      <IconButton onClick={() => onCountChange(1)}>
                        <AddCircleOutlineIcon fontSize="large"/>
                      </IconButton>
                    </Grid>
                  </Grid>
                </>}

              <Box display="flex" flexDirection={{ xs: 'row', sm: 'column' }} alignItems="center" gap={1}>
                <Box><s>{renderPrice(fullSum)}</s></Box>
                <Box sx={priceStyles}>{renderPrice(fullSum, discount)}</Box>
              </Box>

                {!!onBuyClick && (isInBasket ? <Button disabled={true} variant="outlined">В кошику</Button> :
                    <Button variant="contained" onClick={onBuyClick}>
                        <Box display="flex" alignItems="center" gap={1}><LocalMall/>Купити комплект</Box>
                    </Button>)}

              <Box display="flex" gap={1}>
                  {editable && !!onEditBook &&
                    <IconButton onClick={onEditBook} color="primary"><EditIcon/></IconButton>}

                  {editable && !onCountChange && !!onDeleteGroupClick &&
                    <Button variant="outlined" color="warning" onClick={onDeleteGroupClick}>
                      Видалити
                    </Button>}
              </Box>
            </Box>
          </StyledContainer>
        </Box>
      </>);
}