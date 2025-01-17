import { Box, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { styleVariables } from '@/constants/styles-variables';
import CustomImage from '@/components/custom-image';
import { useAuth } from '@/components/auth-context';
import { getDeliveryOptions } from '@/lib/graphql/queries/delivery/hook';

export default function DeliveriesBox() {
    const { deliveries, setDeliveries } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!deliveries?.length) {
            setLoading(true);
            getDeliveryOptions().then(items => {
                setDeliveries(items);
                setLoading(false);
            })
        }
    }, []);

    return (
        !loading && <Grid container position="relative">
          <Grid item xs={12} sx={styleVariables.sectionTitle}>Способи доставки</Grid>

            {!!deliveries?.length && deliveries.map((delivery, index) =>
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