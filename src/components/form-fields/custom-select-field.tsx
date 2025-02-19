import { styled } from '@mui/material/styles';
import { customFieldClearBtnStyles } from '@/constants/styles-variables';
import { SelectElement, SelectElementProps } from 'react-hook-form-mui';
import { Box } from '@mui/material';
import Loading from '@/components/loading';

const StyledSelectField = styled(SelectElement)<SelectElementProps>(() => ({
    py: 1
}));

interface ICustomSelectField extends SelectElementProps {
    loading?: boolean;
    showClear?: boolean;
    onClear?;
}

export default function CustomSelectField({ loading, showClear, onClear, ...props}: ICustomSelectField) {
    return (
        <Box position="relative">
            <Loading show={!!loading} isSmall={true}/>
            <StyledSelectField {...props} variant="outlined"/>
            {showClear && onClear && <Box sx={customFieldClearBtnStyles} onClick={onClear}>Очистити</Box>}
        </Box>
    );
}