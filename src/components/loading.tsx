import { Backdrop, Box, CircularProgress } from '@mui/material';
import React from 'react';
import { positionRelative, styleVariables } from '@/constants/styles-variables';

interface ILoadingProps {
    children: any,
    open: boolean,
    fullHeight?: boolean
}

const backdropStyles = {
    backgroundColor: '#ffffff7d',
    color: 'var(--background)',
    zIndex: theme => theme.zIndex.drawer + 1,
    position: 'absolute'
};

const fullHeightBoxStyles = {
    height: `calc(100vh - ${styleVariables.toolbarHeight}px)`
};

export default function Loading({ children, open, fullHeight }: ILoadingProps) {
    return (
        <Box sx={positionRelative}>
            <Backdrop sx={backdropStyles} open={open}>
                <CircularProgress color="inherit"/>
            </Backdrop>
            <Box sx={fullHeight ? fullHeightBoxStyles : null}>{children}</Box>
        </Box>
    );
}