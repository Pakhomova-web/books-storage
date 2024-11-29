import { Box, Grid, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';

import { borderRadius, boxPadding, primaryLightColor, styleVariables } from '@/constants/styles-variables';
import { isAdmin } from '@/utils/utils';
import { useAuth } from '@/components/auth-context';

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
    const [countPages, setCountPages] = useState<number>(1);
    const { user } = useAuth();

    useEffect(() => {
        const notRounded = count / rowsPerPage;
        const rounded = Math.floor(notRounded);

        setCountPages(notRounded === rounded ? rounded : rounded + 1);
    }, [count, rowsPerPage]);

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

    function renderPageOption(title: number, value: number, isSelected = false) {
        return (
            <CircleClickableBox className={isSelected ? 'selected' : ''}
                                onClick={() => onPageChange(value)}>
                <Tooltip title="Сторінка">
                    <Box>{title}</Box>
                </Tooltip>
            </CircleClickableBox>
        );
    }

    return (
        <Grid container display="flex" alignItems="center" rowGap={2} my={2} px={1}>
            <Grid item xs={12} md={8} display="flex" alignItems="center"
                  justifyContent={{ xs: 'center', md: 'flex-start' }} gap={1}>
                {renderPageOption(1, 0, isFirstPage())}

                {isMoreThan5Pages() && isSelectedFromFirst3() &&
                  <>
                      {renderPageOption(2, 1, isSecondPage())}
                      {renderPageOption(3, 2, isThirdPage())}
                      {!isFirstPage() && !isSecondPage() && renderPageOption(4, 3)}
                    <b>...</b>
                  </>}

                {(countPages === 3 || countPages === 4 || countPages === 5) && renderPageOption(2, 1, isSecondPage())}
                {(countPages === 4 || countPages === 5) && renderPageOption(3, 2, isThirdPage())}
                {(countPages === 5) && renderPageOption(4, 3, isSecondFromTheEnd())}

                {isMoreThan5Pages() && (!isSelectedFromFirst3() && !isSelectedFromLast3()) &&
                  <>
                    <b>...</b>
                      {renderPageOption(page, page - 1)}
                      {renderPageOption(page + 1, page, true)}
                      {renderPageOption(page + 2, page + 1)}
                    <b>...</b>
                  </>}

                {isMoreThan5Pages() && isSelectedFromLast3() &&
                  <>
                    <b>...</b>

                      {!isLastPage() && !isSecondFromTheEnd() && renderPageOption(countPages - 3, countPages - 4, true)}
                      {renderPageOption(countPages - 2, countPages - 3, isThirdFromTheEnd())}
                      {renderPageOption(countPages - 1, countPages - 2, isSecondFromTheEnd())}
                  </>}

                {isMoreThan1Page() && renderPageOption(countPages, countPages - 1, isLastPage())}
                {isAdmin(user) && count}
            </Grid>

            <Grid item xs={12} md={4} display="flex" gap={1} justifyContent={{ xs: 'center', md: 'flex-end' }}>
                {rowsPerPageOptions.map((opt, i) => (
                    <StyledRowsPerPageBox key={i}
                                          className={rowsPerPage === opt ? 'selected' : ''}
                                          onClick={() => onRowsPerPageChange(opt)}>
                        <Tooltip title="Кількість на сторінці">
                            <Box>{opt}</Box>
                        </Tooltip>
                    </StyledRowsPerPageBox>
                ))}
            </Grid>
        </Grid>
    );
}
