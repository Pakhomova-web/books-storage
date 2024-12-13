import { Box } from '@mui/material';
import React, { ReactNode } from 'react';

import { borderRadius, boxPadding, primaryLightColor } from '@/constants/styles-variables';

const optStyles = (selected = false) => ({
    padding: boxPadding,
    borderRadius,
    cursor: selected ? 'default' : 'pointer',
    border: `1px solid ${primaryLightColor}`,
    ...(selected ? {
        backgroundColor: primaryLightColor
    } : {})
});

interface IOptProps {
    selected?: boolean,
    onClick?: () => void,
    children: ReactNode
}

export default function ClickableOption(props: IOptProps) {
    return (
        <Box display="flex" alignItems="center" flexWrap="wrap" gap={1} my={2}>
            <Box sx={optStyles(props.selected)} onClick={() => props.onClick && props.onClick()}>
                {props.children}
            </Box>
        </Box>
    );
}
