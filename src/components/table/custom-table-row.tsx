import { TableRow } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
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
