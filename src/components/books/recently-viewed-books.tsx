import { Grid } from '@mui/material';
import React from 'react';
import { styleVariables } from '@/constants/styles-variables';
import BooksList from './books-list';
import { useAuth } from '@/components/auth-context';

export default function RecentlyViewedBooks() {
    const { user } = useAuth();

    return (
        !!user?.recentlyViewedBooks?.length &&
        <Grid container position="relative" display="flex" justifyContent="center" alignItems="center">
          <Grid item xs={12} sx={styleVariables.sectionTitle}>Нещодавно переглядали</Grid>

          <Grid container display="flex" justifyContent="center">
            <BooksList items={user.recentlyViewedBooks}></BooksList>
          </Grid>
        </Grid>
    );
}
