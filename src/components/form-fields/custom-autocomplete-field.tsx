import { Autocomplete, Box, Checkbox, Chip, TextField, Tooltip } from '@mui/material';

import { customFieldClearBtnStyles } from '@/constants/styles-variables';
import Loading from '@/components/loading';
import { IOption } from '@/lib/data/types';

interface IAutocompleteProps {
    loading?: boolean;
    showClear?: boolean;
    disabled?: boolean;
    required?: boolean;
    onClear?;
    onChange;
    label: string;
    options: IOption<string>[];
    selected: string;
}

export default function CustomAutocompleteField(props: IAutocompleteProps) {
    return (
        <Box position="relative" mb={1}>
            <Loading show={!!props.loading} isSmall={true}/>
            <Autocomplete disabled={props.disabled}
                          disableClearable={true}
                          onChange={(_event: any, values: IOption<string>) => props.onChange(values)}
                          options={props.options}
                          value={props.options?.find(opt => props.selected === opt.id)}
                          renderInput={(params) => (
                              <TextField {...params} label={props.label} variant="outlined" required={props.required}/>
                          )}/>
            {props.showClear && props.onClear && !props.disabled &&
              <Box sx={customFieldClearBtnStyles} onClick={props.onClear}>Очистити</Box>}
        </Box>
    );
}
