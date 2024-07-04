import { TextFieldProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { styleVariables } from '@/constants/styles-variables';
import { TextFieldElement, TextFieldElementProps } from 'react-hook-form-mui';

const StyledTextField = styled(TextFieldElement)<TextFieldProps>(() => ({
    marginBottom: styleVariables.margin
}));

export default function CustomTextField(props: TextFieldElementProps) {
    return <StyledTextField {...props} variant="standard" />
}