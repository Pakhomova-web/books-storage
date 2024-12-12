import { Box, Button, IconButton } from '@mui/material';
import CustomImage from '@/components/custom-image';
import { priceStyles, primaryLightColor, styleVariables } from '@/constants/styles-variables';
import { styled } from '@mui/material/styles';
import { renderPrice } from '@/utils/utils';
import { useEffect, useState } from 'react';
import { LocalMall } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';

const StyledContainer = styled(Box)(() => ({
    width: '250px',
    height: '300px',
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
        height: '300px',
        position: 'absolute',
        top: 0,
        right: '16px',
        borderRight: `1px solid ${primaryLightColor}`
    }
}))

export default function GroupDiscountBox({
                                             books,
                                             discount,
                                             onDeleteBook = null,
                                             onEditBook = null,
                                             onBuyClick = null,
                                             onDeleteGroupClick = null
                                         }) {
    const [fullSum, setFullSum] = useState<number>();

    useEffect(() => {
        setFullSum(books.reduce((a, b) => a + b.price, 0));
    }, [books])

    return (
        !!books.length &&
        <Box display="flex" gap={1} py={2} width="100%" overflow="hidden">
          <Box sx={{ overflowX: 'scroll' }} display="flex" gap={1}>
              {books.map((book, index) =>
                  (<>
                      {index !== 0 && <StyledDivider><CircleBox>+</CircleBox></StyledDivider>}

                      <StyledContainer key={index} gap={1}>
                          <Box display="flex" alignItems="center" justifyContent="space-between"
                               flexDirection="column"
                               gap={1} width="100%"
                               position="relative" px={1}>
                              <Box display="flex" alignItems="center" justifyContent="center" gap={1}
                                   flexDirection="column">
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

                              {!!onDeleteBook &&
                                <Button variant="outlined" color="warning" onClick={() => onDeleteBook(book.id)}>
                                  Видалити
                                </Button>}
                          </Box>
                      </StyledContainer>
                  </>))}
          </Box>

          <StyledDivider><CircleBox>=</CircleBox></StyledDivider>

          <StyledContainer gap={1}>
            <Box display="flex" flexDirection="column" alignItems="center" gap={2} justifyContent="center"
                 width="100%">
              <Box><s>{renderPrice(fullSum)}</s></Box>
              <Box sx={priceStyles}>{renderPrice(fullSum, discount)}</Box>

                {!!onBuyClick &&
                  <Button variant="outlined" onClick={onBuyClick}>
                    <Box display="flex" alignItems="center" gap={1}><LocalMall/>Купити комплект</Box>
                  </Button>}

              <Box display="flex" gap={1}>
                  {!!onEditBook &&
                    <IconButton onClick={onEditBook} color="primary"><EditIcon/></IconButton>}

                  {!!onDeleteGroupClick &&
                    <Button variant="outlined" color="warning" onClick={onDeleteGroupClick}>
                      Видалити
                    </Button>}
              </Box>
            </Box>
          </StyledContainer>
        </Box>
    );
}