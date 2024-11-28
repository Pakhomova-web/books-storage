import { Box, Grid } from '@mui/material';
import React from 'react';

import { styleVariables } from '@/constants/styles-variables';
import CustomImage from '@/components/custom-image';
import Loading from '@/components/loading';
import { useDeliveries } from '@/lib/graphql/queries/delivery/hook';

export default function DeliveriesBox() {
    const { loading, items } = useDeliveries({ orderBy: 'name', order: 'asc' });

    return (
        !loading && <Grid container position="relative">
            <Grid item xs={12} sx={styleVariables.sectionTitle}>Способи доставки</Grid>

            {!!items?.length && items.map((delivery, index) =>
                <Grid key={index} item xs={12} sm={4} display="flex" alignItems="center"
                      justifyContent="center"
                      p={1} gap={1}>
                    {delivery.imageId ? <Box sx={{ width: '100px', height: '50px' }}><CustomImage
                        imageId={delivery.imageId}></CustomImage></Box> : delivery.name}
                </Grid>
            )}
        </Grid>
    );
}