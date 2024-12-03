import { Autocomplete, Box, TextField } from '@mui/material';

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
                          onChange={(_event: any, value: IOption<string>) => props.onChange(value)}
                          options={props.options}
                          getOptionLabel={opt => opt.label}
                          getOptionKey={opt => opt.id}
                          renderOption={(p, option: IOption<string>) =>
                              <Box component="li" {...p} key={p.id}>{option.label}</Box>
                          }
                          value={props.selected && !!props.options?.length ? props.options?.find(opt => opt.id === props.selected) : null}
                          renderInput={(params) => (
                              <TextField {...params} label={props.label} variant="outlined" required={props.required}/>
                          )}/>
            {!!props.selected && props.onClear && !props.disabled &&
              <Box sx={customFieldClearBtnStyles} onClick={props.onClear}>Очистити</Box>}
        </Box>
    );
}
