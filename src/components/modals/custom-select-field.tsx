import { styled } from '@mui/material/styles';
import { styleVariables } from '@/constants/styles-variables';
import { SelectElement, SelectElementProps } from 'react-hook-form-mui';

const StyledSelectField = styled(SelectElement)<SelectElementProps>(() => ({
    marginBottom: styleVariables.margin
}));

export default function CustomSelectField(props: SelectElementProps) {
    return <StyledSelectField {...props} variant="standard" />
}