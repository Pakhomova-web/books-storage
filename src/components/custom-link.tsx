import { styled } from "@mui/material/styles";
import { Box, Link, Tooltip } from "@mui/material";

const StyledLink = styled(Link)(() => ({
    color: 'black',
    cursor: 'pointer',
    textDecoration: 'underline',
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
