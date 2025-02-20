import { Button, Grid, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import useMediaQuery from '@mui/material/useMediaQuery';
import React, { useEffect } from 'react';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import BooksList from './books-list';
import { useBooksWithDiscount } from '@/lib/graphql/queries/book/hook';

export default function DiscountBooks() {
    const theme = useTheme();
    const mobileMatches = useMediaQuery(theme.breakpoints.down('md'));
    const mediumMatches = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const largeMatches = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
    const extraLargeMatches = useMediaQuery(theme.breakpoints.up('xl'));
    const [limit, setLimit] = React.useState<number>(6);
    const { loading, items } = useBooksWithDiscount(limit);
    const router = useRouter();

    useEffect(() => {
        if (extraLargeMatches) {
            setLimit(6);
        } else if (largeMatches) {
            setLimit(4);
        } else if (mediumMatches) {
            setLimit(3);
        } else if (mobileMatches) {
            setLimit(2);
        }
    }, [mobileMatches, mediumMatches, extraLargeMatches, largeMatches]);

    return (
        <Grid container position="relative" display="flex" justifyContent="center" alignItems="center">
            {!loading && <>
              <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
                <h1>Акційні товари</h1>

                <Button onClick={() => router.push(`/books?withDiscount=true`)}>
                  Дивитися усі<ArrowRightAltIcon/>
                </Button>
              </Grid>

              <Grid container display="flex" justifyContent="center">
                  {!!items?.length && <BooksList items={items}></BooksList>}
              </Grid>
            </>}
        </Grid>
    );
}
