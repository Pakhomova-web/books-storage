import Loading from '@/components/loading';
import { Grid } from '@mui/material';
import React from 'react';
import { styleVariables } from '@/constants/styles-variables';
import BooksList from './books-list';
import { useBooksByIds } from '@/lib/graphql/queries/book/hook';
import { useAuth } from '@/components/auth-context';

export default function RecentlyViewedBooks() {
    const { user } = useAuth();
    const { loading, items } = useBooksByIds(user?.recentlyViewedBookIds || []);

    return (
        <Grid container position="relative" display="flex" justifyContent="center" alignItems="center">
            <Loading show={loading}></Loading>

            {!loading && !!items?.length &&
              <Grid item xs={12} mb={loading ? 1 : 0} sx={styleVariables.sectionTitle}>
                Нещодавно переглядали
              </Grid>}

            <Grid container display="flex" justifyContent="center">
                {!!items?.length &&
                  <BooksList items={items}></BooksList>}
            </Grid>
        </Grid>
    );
}
