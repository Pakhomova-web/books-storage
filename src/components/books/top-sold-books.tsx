import { Grid } from '@mui/material';
import React from 'react';

import { styleVariables } from '@/constants/styles-variables';
import BooksList from './books-list';
import { useTopOfSoldBooks } from '@/lib/graphql/queries/book/hook';

export default function TopSoldBooks() {
    const { loading, items } = useTopOfSoldBooks(3);

    return (
        <Grid container position="relative" display="flex" justifyContent="center" alignItems="center">
            {!loading && !!items?.length && <>
              <Grid item xs={12} sx={styleVariables.sectionTitle}>
                Топ продажів
              </Grid>

              <Grid container display="flex" justifyContent="center">
                <BooksList items={items}></BooksList>
              </Grid>
            </>}
        </Grid>
    );
}
