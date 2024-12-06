import { Autocomplete, Box, Button, TextField } from '@mui/material';
import Loading from '@/components/loading';
import { IOption } from '@/lib/data/types';
import { useState } from 'react';

interface IAutocompleteProps {
    loading?: boolean;
    showClear?: boolean;
    disabled?: boolean;
    required?: boolean;
    onClear?;
    onChange;
    label: string;
    onAdd?: (_val: string) => void;
    options: IOption<string>[];
    selected: string;
    error?: string;
}

export default function CustomAutocompleteField(props: IAutocompleteProps) {
    const [inputValue, setInputValue] = useState<string>('');

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
            <Autocomplete disabled={props.disabled}
                          clearOnBlur={false}
                          noOptionsText={renderNoOptionsBox()}
                          onInputChange={(_, value) => setInputValue(value)}
                          onChange={(_event: any, value: IOption<string>) => props.onChange(value)}
                          options={props.options}
                          getOptionLabel={opt => opt?.label || ''}
                          getOptionKey={opt => opt.id}
                          renderOption={(p, option: IOption<string>) =>
                              <Box component="li" {...p} key={p.id}>
                                  {option.label}{option.description ? ` (${option.description})` : ''}
                              </Box>
                          }
                          value={props.selected && !!props.options?.length ? props.options?.find(opt => opt.id === props.selected) : null}
                          renderInput={(params) => (
                              <TextField {...params} label={props.label} variant="outlined" required={props.required}/>
                          )}/>
        </Box>
    );
}
