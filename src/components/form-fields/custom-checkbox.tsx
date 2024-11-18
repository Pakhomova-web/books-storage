import { Box } from '@mui/material';
import { CheckboxElement } from 'react-hook-form-mui';

import { styleVariables } from '@/constants/styles-variables';
import Loading from '@/components/loading';

interface ICustomCheckbox {
    loading?: boolean;
    label: string;
    name: string;
}

export default function CustomCheckbox({ loading, label, name }: ICustomCheckbox) {
    return (
        <Box position="relative">
            <Loading show={!!loading} isSmall={true}/>
            <CheckboxElement label={label} name={name} sx={{ marginLeft: 1 }}/>
        </Box>
    );
}