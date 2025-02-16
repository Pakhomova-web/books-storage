import { styled } from "@mui/material/styles";
import { Box, Link, Tooltip } from "@mui/material";

const StyledLink = styled(Link)(({ theme }) => ({
    color: 'black',
    cursor: 'pointer',
    textDecoration: 'none',
    ':hover': {
        color: theme.palette.primary.main
    }
}));

export default function CustomLink({ children, href = null, tooltip = '', disabled = false, onClick = null }) {
    return (
        !disabled ?
            <StyledLink href={href} onClick={onClick}>{children}</StyledLink> :
            <Tooltip title={tooltip}>
                <Box>{children}</Box>
            </Tooltip>
    );
}
