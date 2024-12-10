import { styled } from "@mui/material/styles";
import { Box, Link, Tooltip } from "@mui/material";
import { primaryLightColor } from '@/constants/styles-variables';

const StyledLink = styled(Link)(({ theme }) => ({
    color: 'black',
    cursor: 'pointer',
    textDecoration: 'none',
    ':hover': {
        color: theme.palette.primary.main
    }
}));

export default function CustomLink({ children, tooltip = '', disabled = false, onClick }) {
    return (
        !disabled ?
            <StyledLink onClick={onClick}>{children}</StyledLink> :
            <Tooltip title={tooltip}>
                <Box>{children}</Box>
            </Tooltip>
    );
}
