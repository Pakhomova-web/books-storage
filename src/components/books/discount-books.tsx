import { Button, Grid } from '@mui/material';
import { styleVariables } from '@/constants/styles-variables';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BooksList from './books-list';
import React from 'react';
import { useBooksWithDiscount } from '@/lib/graphql/queries/book/hook';
import { useRouter } from 'next/router';

const rowsPerPageBooksWithDiscount = 3;

export default function DiscountBooks() {
    const { loading, items } = useBooksWithDiscount(rowsPerPageBooksWithDiscount);
    const router = useRouter();

    return (
        <Grid container position="relative" display="flex" justifyContent="center" alignItems="center">
            {!loading && <>
              <Grid item xs={12} sx={styleVariables.sectionTitle}>
                Акційні товари

                  {items?.length === rowsPerPageBooksWithDiscount &&
                    <Button variant="outlined" onClick={() => router.push(`/books?withDiscount=true`)}>
                      Дивитися усі<ArrowForwardIcon/></Button>}
              </Grid>

              <Grid container display="flex" justifyContent="center">
                  {!!items?.length && <BooksList items={items}></BooksList>}
              </Grid>
            </>}
        </Grid>
    );
}
