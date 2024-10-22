import { styled } from '@mui/material/styles';
import { customFieldClearBtnStyles, styleVariables } from '@/constants/styles-variables';
import { SelectElement, SelectElementProps } from 'react-hook-form-mui';
import { Box } from '@mui/material';
import Loading from '@/components/loading';

const StyledSelectField = styled(SelectElement)<SelectElementProps>(() => ({
    marginBottom: styleVariables.margin
}));

interface ICustomSelectField extends SelectElementProps {
    loading?: boolean;
    showClear?: boolean;
    onClear?;
}

export default function CustomSelectField({ loading, showClear, onClear, ...props}: ICustomSelectField) {
    return (
        <Box sx={styleVariables.positionRelative}>
            <Loading show={!!loading} isSmall={true}/>
            <StyledSelectField {...props} variant="standard" />
            {showClear && onClear && <Box sx={customFieldClearBtnStyles} onClick={onClear}>Clear</Box>}
        </Box>
    );
}