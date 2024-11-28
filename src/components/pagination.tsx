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

    function isSecondFromTheEnd() {
        return page === countPages - 2;
    }

    function isThirdFromTheEnd() {
        return page === countPages - 3;
    }

    function isMoreThan5Pages() {
        return countPages > 5;
    }

    function isMoreThan1Page() {
        return countPages > 1;
    }

    function isSelectedFromFirst3() {
        return page < 3;
    }

    function isSelectedFromLast3() {
        return page >= countPages - 3;
    }

    function isFirstPage() {
        return page === 0;
    }

    function isSecondPage() {
        return page === 1;
    }

    function isThirdPage() {
        return page === 2;
    }

    return (
        <Grid container display="flex" alignItems="center" rowGap={2} mt={2}>
            <Grid item xs={12} md={8} display="flex" alignItems="center"
                  justifyContent={{ xs: 'center', md: 'flex-start' }} gap={1}>
                <CircleClickableBox className={isFirstPage() ? 'selected' : ''}
                                    onClick={() => onPageChange(0)}>1</CircleClickableBox>

                {isMoreThan5Pages() && isSelectedFromFirst3() &&
                  <>
                    <CircleClickableBox className={isSecondPage() ? 'selected' : ''}
                                        onClick={() => onPageChange(1)}>
                        {2}
                    </CircleClickableBox>

                    <CircleClickableBox className={isThirdPage() ? 'selected' : ''}
                                        onClick={() => onPageChange(2)}>
                        {3}
                    </CircleClickableBox>

                    {!isFirstPage() && !isSecondPage() &&
                        <CircleClickableBox onClick={() => onPageChange(3)}>
                        {4}
                    </CircleClickableBox>}

                    <b>...</b>
                  </>}

                {(countPages === 3 || countPages === 4 || countPages === 5) &&
                  <CircleClickableBox className={isSecondPage() ? 'selected' : ''}
                                      onClick={() => onPageChange(1)}>
                      {2}
                  </CircleClickableBox>}

                {(countPages === 4 || countPages === 5) &&
                  <CircleClickableBox className={isThirdPage() ? 'selected' : ''}
                                      onClick={() => onPageChange(2)}>
                      {3}
                  </CircleClickableBox>}

                {countPages === 5 &&
                  <CircleClickableBox className={isSecondFromTheEnd() ? 'selected' : ''}
                                      onClick={() => onPageChange(3)}>
                      {4}
                  </CircleClickableBox>}

                {isMoreThan5Pages() && (!isSelectedFromFirst3() && !isSelectedFromLast3()) &&
                  <>
                    <b>...</b>

                    <CircleClickableBox onClick={() => onPageChange(page - 1)}>{page}</CircleClickableBox>

                    <CircleClickableBox className="selected">{page + 1}</CircleClickableBox>

                    <CircleClickableBox onClick={() => onPageChange(page + 1)}>{page + 2}</CircleClickableBox>

                    <b>...</b>
                  </>}

                {isMoreThan5Pages() && isSelectedFromLast3() &&
                  <>
                    <b>...</b>

                      {!isLastPage() && !isSecondFromTheEnd() &&
                        <CircleClickableBox onClick={() => onPageChange(countPages - 4)}>
                            {countPages - 3}
                        </CircleClickableBox>}

                    <CircleClickableBox className={isThirdFromTheEnd() ? 'selected' : ''}
                                        onClick={() => onPageChange(countPages - 3)}>
                        {countPages - 2}
                    </CircleClickableBox>

                    <CircleClickableBox className={isSecondFromTheEnd() ? 'selected' : ''}
                                        onClick={() => onPageChange(countPages - 2)}>
                        {countPages - 1}
                    </CircleClickableBox>
                  </>}

                {isMoreThan1Page() &&
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
