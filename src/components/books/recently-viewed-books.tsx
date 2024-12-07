import { Grid, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';

import { styleVariables } from '@/constants/styles-variables';
import BooksList from './books-list';
import { useAuth } from '@/components/auth-context';
import { BookEntity } from '@/lib/data/types';

export default function RecentlyViewedBooks() {
    const { user } = useAuth();
    const theme = useTheme();
    const mobileMatches = useMediaQuery(theme.breakpoints.down('md'));
    const mediumMatches = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const largeMatches = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
    const extraLargeMatches = useMediaQuery(theme.breakpoints.up('xl'));
    const [itemsToView, setItemsToView] = useState<BookEntity[]>([]);


    useEffect(() => {
        let limit = 6;

        if (extraLargeMatches) {
            limit = 6;
        } else if (largeMatches) {
            limit = 4;
        } else if (mediumMatches) {
            limit = 3;
        } else if (mobileMatches) {
            limit = 2;
        }
        setItemsToView(user?.recentlyViewedBooks?.slice(0, limit) || []);
    }, [mobileMatches, mediumMatches, extraLargeMatches, largeMatches]);

    return (
        !!user?.recentlyViewedBooks?.length &&
        <Grid container position="relative" display="flex" justifyContent="center" alignItems="center">
          <Grid item xs={12} sx={styleVariables.sectionTitle}>Нещодавно переглядали</Grid>

          <Grid container display="flex" justifyContent="center">
            <BooksList items={itemsToView}></BooksList>
          </Grid>
        </Grid>
    );
}
