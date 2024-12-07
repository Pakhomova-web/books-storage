import { Box } from '@mui/material';
import React from 'react';
import { styled } from '@mui/material/styles';

import { priceStyles, styleVariables } from '@/constants/styles-variables';
import { useTopOfSoldBooks } from '@/lib/graphql/queries/book/hook';
import CustomImage from '@/components/custom-image';
import { renderPrice } from '@/utils/utils';

const StyledBookBox = styled(Box)(() => ({
    cursor: 'pointer',
    textAlign: 'center',
    ...styleVariables.hintFontSize,
    display: 'flex',
    flexDirection: 'column'
}));

const StyledTopSoldBook = styled(Box)(() => ({
    position: 'absolute',
    width: '10%',
    top: '64px',
    height: 'calc(100svh - 64px)',
    overflowY: 'scroll'
}));

export default function TopSoldBooks() {
    const { loading, items } = useTopOfSoldBooks(3);

    return (
        <StyledTopSoldBook gap={1} py={1}>
            {!loading && !!items?.length && <Box>
              <Box sx={styleVariables.hintFontSize} display="flex" flexDirection="row" flexWrap="nowrap"
                   alignItems="center" justifyContent="center" gap={1}>
                <Box height="25px"><CustomImage imageLink="/top_star.png"/></Box>
                Топ продажів
                <Box height="25px"><CustomImage imageLink="/top_star.png"/></Box>
              </Box>


                {items.map((book, index) =>
                    <StyledBookBox key={index} gap={1} p={1}>
                        <Box sx={{ height: '80px', width: '100%' }}>
                            <CustomImage imageId={book.imageIds[0]}/>
                        </Box>

                        <Box>{book.name}</Box>

                        <Box display="flex" justifyContent="center">
                            <Box sx={theme => priceStyles(theme, true)}>
                                {renderPrice(book.price, book.discount)}
                            </Box>
                        </Box>
                    </StyledBookBox>)}
            </Box>}
        </StyledTopSoldBook>
    );
}
