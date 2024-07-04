import { Backdrop, Box, CircularProgress } from '@mui/material';
import React from 'react';

interface ILoadingProps {
    children: any,
    open: boolean,
    fullHeight?: boolean
}

export default function Loading({ children, open, fullHeight }: ILoadingProps) {
    return (
        <Box sx={{ position: 'relative' }}>
            <Backdrop sx={{
                backgroundColor: '#ffffff7d',
                color: 'var(--background)',
                zIndex: theme => theme.zIndex.drawer + 1,
                position: 'absolute'
            }}
                      open={open}>
                <CircularProgress color="inherit"/>
            </Backdrop>
            <Box sx={fullHeight ? { height: 'calc(100vh - 85px)' } : null}>{children}</Box>
        </Box>
    );
}