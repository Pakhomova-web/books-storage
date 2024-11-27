import { Box, Grid } from '@mui/material';
import React, { useState } from 'react';
import { styled } from '@mui/material/styles';

import { borderRadius, boxPadding, primaryLightColor, styleVariables } from '@/constants/styles-variables';

const rowsPerPageOptions = [6, 12, 24, 36];
const boxStyles = {
    padding: boxPadding,
    height: '44px',
    width: '44px',
    '&.selected': {
        backgroundColor: primaryLightColor
    },
    cursor: 'pointer',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    ...styleVariables.hintFontSize
};
const StyledRowsPerPageBox = styled(Box)(() => ({
    borderRadius,
    ...boxStyles
}));

const CircleClickableBox = styled(Box)(() => ({
    ...boxStyles,
    border: `1px solid ${primaryLightColor}`,
    borderRadius: '50%',
    '&.selected': {
        border: 'none',
        backgroundColor: primaryLightColor
    },
}));

export default function Pagination({ rowsPerPage, onRowsPerPageChange, page, count, onPageChange }) {
    const [countPages] = useState<number>(Math.floor(count / rowsPerPage) + 1);

    function isLastPage() {
        return page === countPages - 1;
    }

    function isOneBeforeLastPage() {
        return page === countPages - 2;
    }

    function isOneOfLast2Pages() {
        return page > countPages - 3;
    }

    function isMoreThan4Pages() {
        return countPages > 4;
    }

    function isPageMoreThan2() {
        return page > 1;
    }

    function isFirstPage() {
        return page === 0;
    }

    function isSecondPage() {
        return page === 1;
    }

    function isOneOfFirst2Pages() {
        return page < 2;
    }

    return (
        <Grid container display="flex" alignItems="center" rowGap={2}>
            <Grid item xs={12} md={8} display="flex" alignItems="center"
                  justifyContent={{ xs: 'center', md: 'flex-start' }} gap={1}>
                <CircleClickableBox className={isFirstPage() ? 'selected' : ''}
                                    onClick={() => onPageChange(0)}>1</CircleClickableBox>

                {isPageMoreThan2() && isMoreThan4Pages() && <b>...</b>}

                <CircleClickableBox className={isSecondPage() ? 'selected' : ''}
                                    onClick={() => onPageChange(isOneOfFirst2Pages() ? 1 : (isOneOfLast2Pages() ? countPages - 3 : page - 1))}>
                    {isOneOfFirst2Pages() ? 2 : (isOneOfLast2Pages() ? countPages - 2 : page)}
                </CircleClickableBox>

                {isPageMoreThan2() && !isOneOfLast2Pages() && isMoreThan4Pages() &&
                  <CircleClickableBox className="selected">{page + 1}</CircleClickableBox>}

                <CircleClickableBox className={isOneBeforeLastPage() ? 'selected' : ''}
                                    onClick={() => onPageChange(isOneOfFirst2Pages() ? 2 : (isOneOfLast2Pages() ? countPages - 2 : page + 1))}>
                    {isOneOfFirst2Pages() ? 3 : (isOneOfLast2Pages() ? countPages - 1 : page + 2)}
                </CircleClickableBox>

                {!isOneOfLast2Pages() && countPages > 4 && <b>...</b>}

                {countPages > 1 &&
                  <CircleClickableBox className={isLastPage() ? 'selected' : ''}
                                      onClick={() => onPageChange(countPages - 1)}>
                      {countPages}
                  </CircleClickableBox>}
            </Grid>
            <Grid item xs={12} md={4} display="flex" gap={1} justifyContent={{ xs: 'center', md: 'flex-end' }}>
                {rowsPerPageOptions.map((opt, i) => (
                    <StyledRowsPerPageBox key={i}
                                          className={rowsPerPage === opt ? 'selected' : ''}
                                          onClick={() => onRowsPerPageChange(opt)}>
                        {opt}
                    </StyledRowsPerPageBox>
                ))}
            </Grid>
        </Grid>
    );
}
