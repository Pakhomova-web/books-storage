import { Box, Grid, IconButton, Tooltip } from '@mui/material';
import React from 'react';
import FmdGoodIcon from '@mui/icons-material/FmdGood';

import CustomImage from '@/components/custom-image';
import CustomLink from '@/components/custom-link';
import { getLinkForTracking, isSelfPickup } from '@/utils/utils';
import CustomTextField from '@/components/form-fields/custom-text-field';

export default function OrderDeliveryTrackingBox({ delivery, trackingNumber, editable = false }) {
    function onTTNClick(e) {
        e?.preventDefault();
        window.open(getLinkForTracking(delivery.id, trackingNumber), "_blank")
    }

    function renderDeliveryName() {
        return delivery.imageId ?
            <Box sx={{ width: '80px', height: '40px' }} display="flex" justifyContent="center"
                 alignItems="center">
                <CustomImage imageId={delivery.imageId}/>
            </Box> : delivery.name;
    }

    return (
        editable ?
            (!isSelfPickup(delivery.id) &&
              <Grid container spacing={2}>
                <Grid item xs={10} md={6}><CustomTextField name="trackingNumber" label="ТТН" fullWidth/></Grid>

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
    );
}