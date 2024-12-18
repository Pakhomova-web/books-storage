import { Box, Grid, IconButton, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import FmdGoodIcon from '@mui/icons-material/FmdGood';

import CustomImage from '@/components/custom-image';
import CustomLink from '@/components/custom-link';
import { getLinkForTracking, isSelfPickup } from '@/utils/utils';
import CustomTextField from '@/components/form-fields/custom-text-field';
import { useAuth } from '@/components/auth-context';

export default function OrderDeliveryTrackingBox({ deliveryId, trackingNumber, editable = false, disabled = false }) {
    const { deliveries } = useAuth();
    const [delivery, setDelivery] = useState(deliveries?.find(({ id }) => id === deliveryId));

    useEffect(() => {
        setDelivery(deliveries?.find(({ id }) => id === deliveryId));
    }, [deliveries, deliveryId]);

    function onTTNClick(e) {
        e?.preventDefault();
        e?.stopPropagation();
        window.open(getLinkForTracking(delivery.id, trackingNumber), "_blank")
    }

    function renderDeliveryName() {
        return delivery.imageId ?
            <Box sx={{ width: '80px', height: '40px' }} display="flex" justifyContent="center"
                 alignItems="center">
                <CustomImage imageId={delivery.imageId}/>
            </Box> : delivery.name;
    }

    return (delivery && (
            editable ?
                (!isSelfPickup(delivery.id) &&
                  <Grid container spacing={2}>
                    <Grid item xs={10} md={6}>
                      <CustomTextField name="trackingNumber" disabled={disabled} label="ТТН" fullWidth/>
                    </Grid>

                    <Grid item xs={2} md={6} display="flex" alignItems="center"
                          justifyContent={{ md: 'flex-start', xs: 'center' }}>
                      <Tooltip title="Перевірити пересування посилки">
                        <IconButton onClick={e => onTTNClick(e)}>
                          <FmdGoodIcon/>
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>) :
                <Box mb={1} display="flex" alignItems="center" flexWrap="wrap" gap={1} width="100%">
                    {renderDeliveryName()}

                    {!isSelfPickup(delivery.id) && <Box>ТТН: {!!trackingNumber ?
                        <CustomLink onClick={e => onTTNClick(e)}>
                            {trackingNumber}
                        </CustomLink> : '---'}
                    </Box>}
                </Box>
        )
    );
}