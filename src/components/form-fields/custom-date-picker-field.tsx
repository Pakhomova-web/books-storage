import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { customFieldClearBtnStyles } from '@/constants/styles-variables';
import Loading from '@/components/loading';
import { DatePickerElement, DatePickerElementProps } from 'react-hook-form-mui/date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const StyledField = styled(DatePickerElement)(() => ({
    py: 1,
    width: '100%'
}));

interface IFieldElementProps extends DatePickerElementProps {
    loading?: boolean;
    showClear?: boolean;
    onClear?;
}

export default function CustomDatePickerField({ loading, showClear, onClear, ...props }: IFieldElementProps) {
    return (
        <Box position="relative">
            <Loading show={!!loading} isSmall={true}/>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <StyledField {...props}/>
            </LocalizationProvider>
            {showClear && onClear && <Box sx={customFieldClearBtnStyles} onClick={onClear}>Очистити</Box>}
        </Box>
    );
}