import Loading from '@/components/loading';
import { Button, Grid } from '@mui/material';
import { styleVariables } from '@/constants/styles-variables';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BooksList from '@/components/books-list';
import React from 'react';
import { useBooksWithDiscount } from '@/lib/graphql/queries/book/hook';
import { useRouter } from 'next/router';

const rowsPerPageBooksWithDiscount = 3;

export default function DiscountBooks() {
    const {
        loading: loadingBooksWithDiscounts,
        items: booksWithDiscounts
    } = useBooksWithDiscount(rowsPerPageBooksWithDiscount);
    const router = useRouter();

    return (
        <Grid container position="relative" display="flex" justifyContent="center" alignItems="center">
            <Loading show={loadingBooksWithDiscounts}></Loading>

            {!loadingBooksWithDiscounts && !!booksWithDiscounts?.length &&
              <Grid item xs={12} mb={loadingBooksWithDiscounts ? 1 : 0} sx={styleVariables.sectionTitle}>
                Акційні товари

                  {booksWithDiscounts?.length === rowsPerPageBooksWithDiscount &&
                    <Button variant="outlined" onClick={() => router.push(`/books?withDiscount=true`)}>
                      Дивитися усі<ArrowForwardIcon/></Button>}
              </Grid>}

            <Grid container display="flex" justifyContent="center">
                {!!booksWithDiscounts?.length &&
                  <BooksList items={booksWithDiscounts}></BooksList>}
            </Grid>
        </Grid>
    );
}
