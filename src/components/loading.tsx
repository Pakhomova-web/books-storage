import { Backdrop, CircularProgress } from '@mui/material';
import React from 'react';

interface ILoadingProps {
    show: boolean,
    isSmall?: boolean
}

const backdropStyles = (theme) => ({
    backgroundColor: '#ffffff7d',
    color: theme.palette.primary.main,
    zIndex: theme.zIndex.drawer + 1,
    position: 'absolute',
    height: '100%'
});

export default function Loading({ show, isSmall }: ILoadingProps) {
    return (
        <Backdrop sx={backdropStyles} open={show}>
            <CircularProgress color="inherit" size={!isSmall ? 40 : 20}/>
        </Backdrop>
    );
}