import { Autocomplete, Box, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

import { UkrPoshtaWarehouse } from '@/lib/data/types';
import { useAuth } from '@/components/auth-context';

export default function UkrPoshtaWarehouseAutocompleteField({ disabled = false, onSelect, onInputChange = null }) {
    const [options, setOptions] = useState<UkrPoshtaWarehouse[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const [selected, setSelected] = useState<UkrPoshtaWarehouse>(null);
    const { ukrPoshtaWarehouses } = useAuth();

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
        const temp = value.trim().toLowerCase();

        setOptions(ukrPoshtaWarehouses
            .filter(opt => opt.city.includes(temp) || opt.warehouse.toString().includes(temp))
            .slice(0, 50));
    }

    return (
        <Autocomplete filterOptions={x => x}
                      clearOnBlur={false}
                      disabled={disabled}
                      value={selected}
                      onInputChange={(_, value) => setInputValue(value)}
                      options={options}
                      onChange={(_, value: UkrPoshtaWarehouse) => {
                          setSelected(value);
                          onSelect(value);
                      }}
                      getOptionLabel={(opt: UkrPoshtaWarehouse) => opt.label}
                      renderInput={(params) => (
                          <TextField {...params}
                                     label="Пошук міста по назві/індексу"
                                     variant="outlined"
                                     fullWidth
                                     helperText="Введіть мін. 3 символи"/>
                      )}
                      renderOption={(p, option: UkrPoshtaWarehouse) =>
                          <Box component="li" {...p} key={`${option.warehouse}-${option.city}`}>{option.label}</Box>
                      }/>
    );
}
