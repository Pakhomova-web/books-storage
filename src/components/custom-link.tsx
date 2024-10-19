import { styled } from "@mui/material/styles";
import { Link } from "@mui/material";

const StyledLink = styled(Link)(() => ({
  color: 'black',
  cursor: 'pointer',
  textDecoration: 'underline',
}));

export default function CustomLink({ children, onClick }) {
  return (
    <StyledLink onClick={onClick}>{children}</StyledLink>
  );
}
