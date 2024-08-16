import { Box, TextFieldProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { styleVariables } from '@/constants/styles-variables';
import { TextFieldElement, TextFieldElementProps } from 'react-hook-form-mui';
import Loading from '@/components/loading';

const StyledTextField = styled(TextFieldElement)<TextFieldProps>(() => ({
    marginBottom: styleVariables.margin
}));

interface ITextFieldElementProps extends TextFieldElementProps {
    loading?: boolean;
}

export default function CustomTextField({ loading, ...props }: ITextFieldElementProps) {
    return (
        <Box sx={styleVariables.positionRelative}>
            <Loading show={!!loading} isSmall={true}/>
            <StyledTextField {...props} variant="standard"/>
        </Box>
    );
}