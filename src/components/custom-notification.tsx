import { Backdrop, Box, CircularProgress } from '@mui/material';
import React from 'react';
import { ApolloError } from '@apollo/client';

interface ICustomNotificationProps {
    error: ApolloError
}

export default function CustomNotification({ error }: ICustomNotificationProps) {
    return (
        <Box sx={{ color: 'red' }}>
            {error?.graphQLErrors.map(err => err.extensions?.message).join(' ')}
            {error?.networkError?.message}
            {error?.protocolErrors.map(err => err.message).join(' ')}
        </Box>
    );
}