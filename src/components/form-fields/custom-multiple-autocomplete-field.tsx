import { Autocomplete, Box, Button, Checkbox, Chip, TextField, Tooltip } from '@mui/material';

import { customFieldClearBtnStyles } from '@/constants/styles-variables';
import Loading from '@/components/loading';
import { IOption } from '@/lib/data/types';
import { useState } from 'react';

interface IAutocompleteProps {
    loading?: boolean;
    showClear?: boolean;
    required?: boolean;
    disabled?: boolean;
    onClear?;
    onAdd?: (_val: string) => void;
    onChange;
    label: string;
    options: IOption<string>[];
    selected: string[];
}

export default function CustomMultipleAutocompleteField(props: IAutocompleteProps) {
    const [inputValue, setInputValue] = useState<string>('');

    function renderOption(p, option: IOption<string>) {
        return (
            <Box component="li" {...p} key={option.id}>
                <Checkbox checked={props.selected?.includes(option.id)} disabled={props.disabled}/>
                {option.label}{option.description ? ` (${option.description})` : ''}
            </Box>
        );
    }

    function renderInput(params) {
        return (
            <TextField {...params} label={props.label} variant="outlined" required={props.required}/>
        );
    }

    function renderNoOptionsBox() {
        return (
            <Box display="flex" flexDirection="column" gap={1} textAlign="center">
                Немає такої опції
                {props.onAdd &&
                  <Button fullWidth onClick={() => props.onAdd(inputValue)}>Додати</Button>}
            </Box>
        );
    }

    return (
        <Box position="relative" mb={1}>
            <Loading show={!!props.loading} isSmall={true}/>
            <Autocomplete multiple={true}
                          disableClearable={true}
                          clearOnBlur={false}
                          onInputChange={(_, value) => setInputValue(value)}
                          clearOnEscape={false}
                          disableCloseOnSelect={true}
                          disabled={props.disabled}
                          onChange={(_event: any, values: IOption<string>[]) => props.onChange(values)}
                          options={props.options}
                          value={!!props.selected?.length ? props.options.filter(opt => props.selected?.includes(opt.id)) : []}
                          renderInput={renderInput}
                          getOptionKey={opt => opt.id}
                          renderOption={renderOption}
                          noOptionsText={renderNoOptionsBox()}
                          renderTags={(values, getTagProps) =>
                              values.length < 3 ?
                                  values.map((option: IOption<string>, index) =>
                                      <Tooltip title={option.label} key={index}>
                                          <Chip {...getTagProps({ index })} label={option.label} key={index}/>
                                      </Tooltip>) :
                                  <>
                                      <Tooltip title={values[0].label} key={0}>
                                          <Chip {...getTagProps({ index: 0 })} label={values[0].label} key={0}/>
                                      </Tooltip>
                                      <Tooltip title={values[1].label} key={1}>
                                          <Chip {...getTagProps({ index: 1 })} label={values[1].label} key={1}/>
                                      </Tooltip>
                                      <Tooltip key={2} title={
                                          <Box display="flex" flexDirection="column" key={2}>
                                              {values.map((opt, i) => i > 1 && <Box key={i}>{opt.label}</Box>)}
                                          </Box>}>
                                          <Chip label={`+${values.length - 2}`} sx={{ cursor: 'default' }} key={2}/>
                                      </Tooltip>
                                  </>
                          }/>

            {props.showClear && props.onClear && !props.disabled &&
              <Box sx={customFieldClearBtnStyles} onClick={props.onClear}>Очистити</Box>}
        </Box>
    );
}
