import { Box } from '@mui/material';
import React from 'react';
import { styled } from '@mui/material/styles';

import { priceStyles, styleVariables } from '@/constants/styles-variables';
import { useTopOfSoldBooks } from '@/lib/graphql/queries/book/hook';
import CustomImage from '@/components/custom-image';
import { renderPrice } from '@/utils/utils';
import { BookEntity } from '@/lib/data/types';
import { useRouter } from 'next/router';
import { useAuth } from '@/components/auth-context';
import CustomLink from '@/components/custom-link';

const StyledBookBox = styled(Box)(() => ({
    cursor: 'pointer',
    textAlign: 'center',
    ...styleVariables.hintFontSize,
    display: 'flex',
    flexDirection: 'column'
}));

const StyledMobileImage = styled(Box)(() => ({
    cursor: 'pointer',
    height: '65px',
    maxWidth: '65px'
}));

const StyledImage = styled(Box)(() => ({
    cursor: 'pointer',
    height: '80px',
    maxWidth: '100%'
}));

const StyledContainer = styled(Box)(() => ({
    position: 'absolute',
    width: '10%',
    top: '64px',
    height: 'calc(100svh - 64px)',
    overflowY: 'scroll'
}));

export default function TopSoldBooks({ mobile = false }) {
    const { setLoading } = useAuth();
    const { loading, items } = useTopOfSoldBooks(3);
    const router = useRouter();

    function onBookClick(book: BookEntity) {
        setLoading(true);
        router.push(`/books/${book.id}`);
    }

    function onTitleClick() {
        router.push(`/books?orderBy=numberSold&order=desc`);
    }

    return (
        mobile ?
            <Box my={1} display="flex" flexDirection="row" flexWrap="nowrap" alignItems="center"
                 justifyContent="space-between" gap={1}>
                <CustomLink href="/books?orderBy=numberSold&order=desc"><h2>Топ продажів</h2></CustomLink>

                <Box display="flex" flexDirection="row" flexWrap="nowrap" gap={1}>
                    {items.map((book, index) => (
                        <StyledMobileImage key={index} onClick={() => onBookClick(book)}>
                            <CustomImage imageId={book.imageIds ? book.imageIds[0] : null}/>
                        </StyledMobileImage>
                    ))}
                </Box>
            </Box> :
            <StyledContainer gap={1} py={1}>
                {!loading && !!items?.length && <Box display="flex" alignItems="center" flexDirection="column">
                  <h2><CustomLink href="/books?orderBy=numberSold&order=desc">Топ продажів</CustomLink></h2>

                    {items.map((book, index) =>
                        <StyledBookBox key={index} gap={1} p={1} onClick={() => onBookClick(book)}>
                            <StyledImage>
                                <CustomImage imageId={book.imageIds ? book.imageIds[0] : null}/>
                            </StyledImage>

                            <Box>{book.name}</Box>

                            <Box display="flex" justifyContent="center">
                                <Box sx={theme => priceStyles(theme, true)}>
                                    {renderPrice(book.price, book.discount)}
                                </Box>
                            </Box>
                        </StyledBookBox>)}
                </Box>}
            </StyledContainer>
    );
}
