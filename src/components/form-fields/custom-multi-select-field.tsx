import { styled } from '@mui/material/styles';
import { customFieldClearBtnStyles, styleVariables } from '@/constants/styles-variables';
import { MultiSelectElement, MultiSelectElementProps } from 'react-hook-form-mui';
import { Box } from '@mui/material';
import Loading from '@/components/loading';

const StyledMultiSelectField = styled(MultiSelectElement)(() => ({
    marginBottom: styleVariables.margin
}));

export default function CustomMultiSelectField(props) {
    return (
        <Box sx={styleVariables.positionRelative}>
            <Loading show={!!props.loading} isSmall={true}/>
            <StyledMultiSelectField {...props} showCheckbox variant="standard"/>
            {props.showClear && props.onClear &&
              <Box sx={customFieldClearBtnStyles} onClick={props.onClear}>Clear</Box>}
        </Box>
    );
}