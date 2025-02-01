import { Box, FormControlLabel, Radio } from '@mui/material';
import CustomImage from '@/components/custom-image';
import React from 'react';

export default function DeliveryRadioOption({ option, disabled = false }) {
    return (
        <FormControlLabel value={option.id}
                          disabled={disabled}
                          control={<Radio/>}
                          label={option.imageId ?
                              <Box width="100px" height="50px">
                                  <CustomImage
                                      imageId={option.imageId}></CustomImage>
                              </Box> : option.name}/>
    );
}