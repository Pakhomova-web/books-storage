import { styled } from '@mui/material/styles';
import { styleVariables } from '@/constants/styles-variables';
import { PasswordElement, PasswordElementProps } from 'react-hook-form-mui';

const StyledPasswordElement = styled(PasswordElement)<PasswordElementProps>(() => ({
    marginBottom: 1
}));

export default function CustomPasswordElement(props: PasswordElementProps) {
    return <StyledPasswordElement {...props} variant="standard" />
}