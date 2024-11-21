import { Box } from '@mui/material';
import React from 'react';

import { OrderEntity } from '@/lib/data/types';
import CustomImage from '@/components/custom-image';
import CustomLink from '@/components/custom-link';
import { getLinkForTracking } from '@/utils/utils';

export default function OrderDeliveryTrackingBox({ order }) {
    function onTTNClick(e, order: OrderEntity) {
        e?.preventDefault();
        window.open(getLinkForTracking(order.delivery.id, order.trackingNumber), "_blank")
    }

    return (
        <Box mb={1} display="flex" alignItems="center" flexWrap="wrap" gap={1}>
            <Box sx={{ width: '50px', height: '25' }} display="flex" justifyContent="center" alignItems="center">
                <CustomImage imageId={order.delivery.imageId}></CustomImage>
            </Box>

            <Box>ТТН: {!!order.trackingNumber ?
              <CustomLink onClick={e => onTTNClick(e, order)}>
                  {order.trackingNumber}
              </CustomLink> : '---'}
            </Box>
        </Box>
    );
}