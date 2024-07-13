import { Box, BoxProps } from '@mui/material';
import { ApolloError } from '@apollo/client';
import { styled } from '@mui/material/styles';
import { styleVariables } from '@/constants/styles-variables';
import Error from '@mui/icons-material/Error';

interface IErrorNotificationProps {
    error?: ApolloError
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

export default function ErrorNotification({ error }: IErrorNotificationProps) {
    return (
        <Box sx={mainContainer}>
            <StyledBox>
                <Error sx={errorIcon}></Error>

                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {!!error?.graphQLErrors?.length &&
                      <Box>{String(error?.graphQLErrors[error.graphQLErrors.length - 1].extensions.message || error?.message)}</Box>
                    }

                    {error?.networkError && <Box>{error?.networkError?.message}</Box>}
                    {error?.protocolErrors?.map((err, index) => (<Box key={index}>{err.message}</Box>))}
                </Box>
            </StyledBox>
        </Box>
    );
}