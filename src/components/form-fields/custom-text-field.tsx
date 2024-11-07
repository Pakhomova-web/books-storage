import { Box, TextFieldProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { customFieldClearBtnStyles, styleVariables } from '@/constants/styles-variables';
import { TextFieldElement, TextFieldElementProps } from 'react-hook-form-mui';
import Loading from '@/components/loading';

const StyledTextField = styled(TextFieldElement)<TextFieldProps>(() => ({
    mb: 1
}));

interface ITextFieldElementProps extends TextFieldElementProps {
    loading?: boolean;
    showClear?: boolean;
    onClear?;
}

export default function CustomTextField({ loading, showClear, onClear, ...props }: ITextFieldElementProps) {
    return (
        <Box sx={styleVariables.positionRelative}>
            <Loading show={!!loading} isSmall={true}/>
            <StyledTextField {...props} variant="standard"/>
            {showClear && onClear && <Box sx={customFieldClearBtnStyles} onClick={onClear}>Очистити</Box>}
        </Box>
    );
}