import { Autocomplete, Box, Checkbox, Chip, TextField, Tooltip } from '@mui/material';

import { customFieldClearBtnStyles } from '@/constants/styles-variables';
import Loading from '@/components/loading';
import { IOption } from '@/lib/data/types';

interface IAutocompleteProps {
    loading?: boolean;
    showClear?: boolean;
    required?: boolean;
    disabled?: boolean;
    onClear?;
    onChange;
    label: string;
    options: IOption<string>[];
    selected: string[];
}

export default function CustomMultipleAutocompleteField(props: IAutocompleteProps) {
    return (
        <Box position="relative" mb={1}>
            <Loading show={!!props.loading} isSmall={true}/>
            <Autocomplete multiple={true}
                          disableClearable={true}
                          disabled={props.disabled}
                          onChange={(_event: any, values: IOption<string>[]) => props.onChange(values)}
                          options={props.options}
                          value={!!props.selected?.length ? props.options.filter(opt => props.selected?.includes(opt.id)) : []}
                          renderInput={(params) => (
                              <TextField {...params} label={props.label} variant="outlined" required={props.required}/>
                          )}
                          getOptionKey={opt => opt.id}
                          renderOption={(p, option: IOption<string>) =>
                              <Box component="li" {...p}>
                                  <Checkbox checked={props.selected?.includes(option.id)}
                                            disabled={props.disabled}/>
                                  {option.label}
                              </Box>
                          }
                          renderTags={(values, getTagProps) =>
                              values.length < 3 ?
                                  values.map((option: IOption<string>, index) =>
                                      <Tooltip title={option.label} key={index}>
                                          <Chip {...getTagProps({ index })} label={option.label}/>
                                      </Tooltip>) :
                                  <>
                                      <Tooltip title={values[0].label} key={0}>
                                          <Chip {...getTagProps({ index: 0 })} label={values[0].label}/>
                                      </Tooltip>
                                      <Tooltip title={values[1].label} key={1}>
                                          <Chip {...getTagProps({ index: 1 })} label={values[1].label}/>
                                      </Tooltip>
                                      <Tooltip key={2} title={
                                          <Box display="flex" flexDirection="column">
                                              {values.map((opt, i) => <Box key={i}>{opt.label}</Box>)}
                                          </Box>}>
                                          <Chip label={`+${values.length - 2}`} sx={{ cursor: 'default' }}/>
                                      </Tooltip>
                                  </>
                          }/>
            {props.showClear && props.onClear && !props.disabled &&
              <Box sx={customFieldClearBtnStyles} onClick={props.onClear}>Очистити</Box>}
        </Box>
    );
}
