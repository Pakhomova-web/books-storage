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
}

export default function CustomSelectField(props: ICustomSelectField) {
    return (
        <Box sx={styleVariables.positionRelative}>
            <Loading show={!!props.loading} isSmall={true}/>
            <StyledSelectField {...props} variant="standard" />
        </Box>
    );
}