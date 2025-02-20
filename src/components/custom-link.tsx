import { styled } from "@mui/material/styles";
import { Box, Link, Tooltip } from "@mui/material";

const StyledLink = styled(Link)(({ theme }) => ({
    color: theme.palette.primary.contrastText,
    cursor: 'pointer',
    textDecoration: 'none',
    ':hover': {
        color: theme.palette.primary.main
    }
}));

export default function CustomLink({ children, href = null, tooltip = '', selected = false, disabled = false, onClick = null }) {
    return (
        !disabled ?
            <StyledLink href={href} onClick={onClick} className={selected ? 'selected' : ''}>{children}</StyledLink> :
            <Tooltip title={tooltip}>
                <Box>{children}</Box>
            </Tooltip>
    );
}
