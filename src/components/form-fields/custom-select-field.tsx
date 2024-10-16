import { styled } from '@mui/material/styles';
import { styleVariables } from '@/constants/styles-variables';
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

const clearBtnStyles = {
    position: 'absolute',
    top: 0,
    right: 0,
    cursor: 'pointer',
    ...styleVariables.hintFontSize
};

export default function CustomSelectField({ loading, showClear, onClear, ...props}: ICustomSelectField) {
    return (
        <Box sx={styleVariables.positionRelative}>
            <Loading show={!!loading} isSmall={true}/>
            <StyledSelectField {...props} variant="standard" />
            {showClear && onClear && <Box sx={clearBtnStyles} onClick={onClear}>Clear</Box>}
        </Box>
    );
}