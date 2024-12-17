import { Autocomplete, Box, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { getWarehouses } from '@/lib/graphql/queries/nova-poshta/hooks';
import { NovaPoshtaWarehouseEntity } from '@/lib/data/types';

export default function WarehouseAutocompleteField({ settlementRef, warehouse = null, onSelect }) {
    const [loading, setLoading] = useState<boolean>(false);
    const [options, setOptions] = useState<NovaPoshtaWarehouseEntity[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const [selected, setSelected] = useState<NovaPoshtaWarehouseEntity>(null);

    useEffect(() => {
        if (warehouse) {
            setSelected(null);
            getOptions(`${warehouse}`, warehouse);
        }
    }, [warehouse]);

    useEffect(() => {
        setSelected(null);
        if (settlementRef) {
            getOptions(warehouse ? `${warehouse}` : '', warehouse);
        } else {
            setOptions([]);
            onSelect(selected, !warehouse);
        }
    }, [settlementRef]);

    useEffect(() => {
        if (selected?.description !== inputValue && !!settlementRef) {
            setSelected(null);
            onSelect(selected, true);
            getOptions(inputValue);
        } else if (!inputValue?.length) {
            if (selected) {
                setSelected(null);
                onSelect(selected, true);
            }
            setOptions([]);
        }
    }, [inputValue]);

    function getOptions(value: string, valueToSet: number = null) {
        if (settlementRef) {
            setLoading(true);
            getWarehouses(settlementRef, value).then((warehouses: NovaPoshtaWarehouseEntity[]) => {
                setOptions(warehouses);
                if (valueToSet) {
                    const val = warehouses.find(c => c.number === valueToSet);

                    setSelected(val);
                    onSelect(val, false);
                }
                setLoading(false);
            }).catch(() => {
                setOptions([]);
                setLoading(false);
            });
        } else {
            setOptions([]);
        }
    }

    return (
        <Autocomplete filterOptions={x => x}
                      clearOnBlur={false}
                      loading={loading}
                      disabled={!settlementRef}
                      value={selected}
                      onInputChange={(_, value) => setInputValue(value)}
                      options={options}
                      onChange={(_, value: NovaPoshtaWarehouseEntity) => {
                          setSelected(value);
                          onSelect(value, true);
                      }}
                      getOptionLabel={(opt: NovaPoshtaWarehouseEntity) => opt.description}
                      renderInput={(params) => (
                          <TextField {...params} label="№ відділення/поштомату" placeholder="Введіть номер"
                                     helperText={!settlementRef ? 'Виберіть місто' : ''}
                                     variant="outlined"/>
                      )}
                      renderOption={(p, option: NovaPoshtaWarehouseEntity) =>
                          <Box component="li" {...p} key={option.number}>{option.description}</Box>
                      }/>
    );
}
