import { Box, Grid } from '@mui/material';
import React from 'react';
import { useBooks } from '@/lib/graphql/queries/book/hook';
import Loading from '@/components/loading';
import { positionRelative } from '@/constants/styles-variables';

export default function Home() {
    let pageSettings;
    let filters;
    const { items, totalCount, gettingError, loading, refetch } = useBooks(pageSettings, filters);

    return (
        <Box sx={positionRelative}>
            <Loading show={loading}></Loading>

            <Grid container gap={2} m={2}>
                {items.map(((book, i) =>
                        <Grid item key={i}>
                            <Box style={{ width: '200px', height: '200px' }}>
                                {book.imageId &&
                                  <img src={`https://drive.google.com/thumbnail?id=${book.imageId}&sz=w1000`}
                                       alt="Image 1" width="100%" height="100%" style={{ objectFit: 'contain' }}/>}
                            </Box>
                            {book.name}
                        </Grid>
                ))}
            </Grid>
        </Box>
    );
}