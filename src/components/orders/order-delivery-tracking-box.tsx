import { Box, Grid, IconButton, Tooltip } from '@mui/material';
import React from 'react';
import FmdGoodIcon from '@mui/icons-material/FmdGood';

import { OrderEntity } from '@/lib/data/types';
import CustomImage from '@/components/custom-image';
import CustomLink from '@/components/custom-link';
import { getLinkForTracking, isSelfPickup } from '@/utils/utils';
import CustomTextField from '@/components/form-fields/custom-text-field';

export default function OrderDeliveryTrackingBox({ order, editable = false }) {
    function onTTNClick(e, order: OrderEntity) {
        e?.preventDefault();
        window.open(getLinkForTracking(order.delivery.id, order.trackingNumber), "_blank")
    }

    function renderDeliveryName() {
        return order.delivery.imageId ?
            <Box sx={{ width: '80px', height: '40px' }} display="flex" justifyContent="center"
                 alignItems="center">
                <CustomImage imageId={order.delivery.imageId}/>
            </Box> : order.delivery.name;
    }

    return (
        editable ?
            <Grid container display="flex" width="100%" alignItems="center" justifyContent="flex-end" flexWrap="nowrap"
                  spacing={2}>
                {!isSelfPickup(order.delivery.id) &&
                  <Grid item xs={9} md={6}><CustomTextField name="trackingNumber" label="ТТН" fullWidth/></Grid>}

                <Grid item xs={3} md={6} display="flex" alignItems="center" gap={2}>
                    {renderDeliveryName()}

                    {!isSelfPickup(order.delivery.id) && <Tooltip title="Перевірити пересування посилки">
                      <IconButton onClick={e => onTTNClick(e, order)}>
                        <FmdGoodIcon/>
                      </IconButton>
                    </Tooltip>}
                </Grid>
            </Grid> :
            <Box mb={1} display="flex" alignItems="center" flexWrap="wrap" gap={1} width="100%">
                {renderDeliveryName()}

                {!isSelfPickup(order.delivery.id) && <Box>ТТН: {!!order.trackingNumber ?
                    <CustomLink onClick={e => onTTNClick(e, order)}>
                        {order.trackingNumber}
                    </CustomLink> : '---'}
                </Box>}
            </Box>
    );
}