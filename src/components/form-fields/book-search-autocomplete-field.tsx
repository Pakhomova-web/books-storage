import { Autocomplete, Box, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

import { IOption } from '@/lib/data/types';
import { getBookNamesByQuickSearch } from '@/lib/graphql/queries/book/hook';

export default function BookSearchAutocompleteField({ disabled = false, onSelect, onInputChange = null }) {
    const [loading, setLoading] = useState<boolean>(false);
    const [options, setOptions] = useState<IOption<string>[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const [selected, setSelected] = useState<IOption<string>>(null);

    useEffect(() => {
        if (onInputChange) {
            onInputChange(inputValue);
        }
        if (!!inputValue?.length && selected?.label !== inputValue) {
            setSelected(null);
            getOptions(inputValue);
        } else if (!inputValue) {
            if (selected) {
                setInputValue('');
                setSelected(null);
            }
            setOptions([]);
        }
    }, [inputValue]);

    function getOptions(value: string) {
        setLoading(true);
        getBookNamesByQuickSearch(value).then((opts: IOption<string>[]) => {
            setOptions(opts);
            setLoading(false);
        }).catch(() => {
            setOptions([]);
            setLoading(false);
        });
    }

    return (
        <Autocomplete filterOptions={x => x}
                      clearOnBlur={false}
                      loading={loading}
                      disabled={disabled}
                      value={selected}
                      onInputChange={(_, value) => setInputValue(value)}
                      options={options}
                      onChange={(_, value: IOption<string>) => {
                          setSelected(value);
                          onSelect(value);
                      }}
                      getOptionLabel={(opt: IOption<string>) => opt.label}
                      renderInput={(params) => (
                          <TextField {...params}
                                     label="Пошук книги"
                                     variant="outlined"
                                     helperText="Введіть мін. 3 літери"/>
                      )}
                      renderOption={(p, option: IOption<string>) =>
                          <Box component="li" {...p} key={option.id}>{option.label} ({option.description})</Box>
                      }/>
    );
}
