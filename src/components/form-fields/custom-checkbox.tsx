import { Box, Checkbox } from '@mui/material';
import { CheckboxElement } from 'react-hook-form-mui';
import Loading from '@/components/loading';
import React from 'react';

interface ICustomCheckbox {
    loading?: boolean;
    disabled?: boolean;
    checked?: boolean; // for disabled values
    label: string;
    name: string;
}

export default function CustomCheckbox({ loading, label, name, disabled = false, checked = false }: ICustomCheckbox) {
    return (
        <Box position="relative">
            <Loading show={!!loading} isSmall={true}/>
            {disabled ?
                <Box display="flex" alignItems="center" sx={{ marginLeft: '-11px' }}>
                    <Checkbox checked={checked} disabled={true}/>{label}
                </Box> :
                <CheckboxElement label={label} name={name}/>}
        </Box>
    );
}