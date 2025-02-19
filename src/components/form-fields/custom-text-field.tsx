import { Box, TextFieldProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { customFieldClearBtnStyles } from '@/constants/styles-variables';
import { TextFieldElement, TextFieldElementProps } from 'react-hook-form-mui';
import Loading from '@/components/loading';

const StyledTextField = styled(TextFieldElement)<TextFieldProps>(() => ({
    py: 1
}));

interface ITextFieldElementProps extends TextFieldElementProps {
    loading?: boolean;
    showClear?: boolean;
    onClear?;
}

export default function CustomTextField({ loading, showClear, onClear, ...props }: ITextFieldElementProps) {
    return (
        <Box position="relative">
            <Loading show={!!loading} isSmall={true}/>
            <StyledTextField {...props} variant="outlined"/>
            {showClear && onClear && <Box sx={customFieldClearBtnStyles} onClick={onClear}>Очистити</Box>}
        </Box>
    );
}