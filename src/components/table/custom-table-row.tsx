import { TableRow } from '@mui/material';
import { styled } from '@mui/material/styles';
import { styleVariables } from '@/constants/styles-variables';

const StyledTableRow = styled(TableRow)(() => ({
    '&:nth-of-type(odd)': {
        backgroundColor: styleVariables.gray
    }
}));

interface StyledRowProps {
    children: any,
    isClickable?: boolean,
    onClick?: () => void
}

export default function CustomTableRow({ children, isClickable, onClick }: StyledRowProps) {
    return (
        <StyledTableRow className={isClickable ? 'clickable' : ''} onClick={() => onClick ? onClick() : null}>
            {children}
        </StyledTableRow>
    );
}
