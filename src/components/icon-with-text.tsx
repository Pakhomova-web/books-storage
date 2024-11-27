import { Box } from '@mui/material';
import CustomImage from '@/components/custom-image';
import React from 'react';
import { styleVariables } from '@/constants/styles-variables';

const iconWithTextImageBox = {
    width: '100px',
    height: '100px',
    opacity: 0.5
};

export default function IconWithText({ text, imageLink }) {
    return (
        <Box p={1} display="flex" alignItems="center" flexDirection="column" gap={2}>
            <Box sx={iconWithTextImageBox}>
                <CustomImage imageLink={imageLink}></CustomImage>
            </Box>

            <Box sx={styleVariables.titleFontSize} textAlign="center" mb={1}>{text}</Box>
        </Box>
    );
}
