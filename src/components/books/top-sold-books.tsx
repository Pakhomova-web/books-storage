import { Box } from '@mui/material';
import React from 'react';
import { styled } from '@mui/material/styles';

import { priceStyles, styleVariables } from '@/constants/styles-variables';
import { useTopOfSoldBooks } from '@/lib/graphql/queries/book/hook';
import CustomImage from '@/components/custom-image';
import { renderPrice } from '@/utils/utils';
import { BookEntity } from '@/lib/data/types';
import { useRouter } from 'next/router';

const StyledBookBox = styled(Box)(() => ({
    cursor: 'pointer',
    textAlign: 'center',
    ...styleVariables.hintFontSize,
    display: 'flex',
    flexDirection: 'column'
}));

const StyledMobileTopSoldBook = styled(Box)(() => ({
    cursor: 'pointer',
    height: '65px',
    mxWidth: '65px'
}));

const StyledTitle = styled(Box)(() => ({
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
}));

const StyledTopSoldBook = styled(Box)(() => ({
    position: 'absolute',
    width: '10%',
    top: '64px',
    height: 'calc(100svh - 64px)',
    overflowY: 'scroll'
}));

export default function TopSoldBooks({ mobile = false }) {
    const { loading, items } = useTopOfSoldBooks(3);
    const router = useRouter();

    function onBookClick(book: BookEntity) {
        router.push(`/books/${book.id}`);
    }

    function onTitleClick() {
        router.push(`/books?orderBy=numberSold&order=desc`);
    }

    return (
        mobile ?
            <Box my={1} display="flex" flexDirection="row" flexWrap="nowrap" alignItems="center"
                 justifyContent="space-between" gap={1}>
                <StyledTitle gap={1} onClick={() => onTitleClick()}>
                    <Box height="25px"><CustomImage imageLink="/top_star.png"/></Box>
                    Топ продажів
                </StyledTitle>

                <Box display="flex" flexDirection="row" flexWrap="nowrap" gap={1}>
                    {items.map((book, index) => (
                        <StyledMobileTopSoldBook key={index} onClick={() => onBookClick(book)}>
                            <CustomImage imageId={book.imageIds ? book.imageIds[0] : null}/>
                        </StyledMobileTopSoldBook>
                    ))}
                </Box>
            </Box> :
            <StyledTopSoldBook gap={1} py={1}>
                {!loading && !!items?.length && <Box>
                  <StyledTitle sx={styleVariables.hintFontSize} justifyContent="center" gap={1}
                               onClick={() => onTitleClick()}>
                    <Box height="25px"><CustomImage imageLink="/top_star.png"/></Box>
                    Топ продажів
                    <Box height="25px"><CustomImage imageLink="/top_star.png"/></Box>
                  </StyledTitle>


                    {items.map((book, index) =>
                        <StyledBookBox key={index} gap={1} p={1} onClick={() => onBookClick(book)}>
                            <Box sx={{ height: '80px', width: '100%' }}>
                                <CustomImage imageId={book.imageIds ? book.imageIds[0] : null}/>
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
