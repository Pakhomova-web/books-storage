import { Backdrop, CircularProgress } from '@mui/material';
import React from 'react';

interface ILoadingProps {
    show: boolean,
    fullHeight?: boolean
}

const backdropStyles = {
    backgroundColor: '#ffffff7d',
    color: 'var(--background)',
    zIndex: theme => theme.zIndex.drawer + 1,
    position: 'absolute'
};

export default function Loading({ show, fullHeight }: ILoadingProps) {
    return (
        <Backdrop sx={backdropStyles} open={show}>
            <CircularProgress color="inherit"/>
        </Backdrop>
    );
}