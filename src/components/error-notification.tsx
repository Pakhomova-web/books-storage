import { Box, BoxProps } from '@mui/material';
import React from 'react';
import { ApolloError } from '@apollo/client';
import { styled } from '@mui/material/styles';
import { styleVariables } from '@/constants/styles-variables';
import Error from '@mui/icons-material/Error';

interface IErrorNotificationProps {
    apolloError?: ApolloError,
    error?: string
}

const mainContainer = {
    display: 'flex',
    margin: styleVariables.margin
};

const errorIcon = {
    marginRight: styleVariables.margin,
    outline: `1px solid ${styleVariables.warnColor}`,
    boxShadow: '0 0 1px 6px #F9E9E8',
    borderRadius: '50%'
};

const StyledBox = styled(Box)<BoxProps>(() => ({
    display: 'flex',
    alignItems: 'center',
    padding: styleVariables.padding,
    color: styleVariables.warnColor
}));

export default function ErrorNotification({ error, apolloError }: IErrorNotificationProps) {
    return (
        <Box sx={mainContainer}>
            <StyledBox>
                <Error sx={errorIcon}></Error>
                <Box>
                    {error}
                    {apolloError?.message}
                    {apolloError?.graphQLErrors.map(err => err.extensions?.message).join(' ')}
                    {apolloError?.networkError?.message}
                    {apolloError?.protocolErrors.map(err => err.message).join(' ')}
                </Box>
            </StyledBox>
        </Box>
    );
}