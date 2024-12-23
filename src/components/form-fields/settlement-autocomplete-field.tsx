import { Autocomplete, Box, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { getSettlements } from '@/lib/graphql/queries/nova-poshta/hooks';
import { NovaPoshtaSettlementEntity } from '@/lib/data/types';

export default function SettlementAutocompleteField({ disabled = false, city = null, region = null, district = null, onSelect }) {
    const [loading, setLoading] = useState<boolean>(false);
    const [options, setOptions] = useState<NovaPoshtaSettlementEntity[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const [selected, setSelected] = useState<NovaPoshtaSettlementEntity>(null);

    useEffect(() => {
        if (city && region && selected?.title !== inputValue) {
            setSelected(null);
            getOptions(`${city} ${region}`, city, region, district);
        }
    }, [city, region, district]);

    useEffect(() => {
        if (!!inputValue?.length && selected?.title !== inputValue) {
            setSelected(null);
            onSelect(null, true);
            getOptions(inputValue);
        } else if (!inputValue) {
            if (selected) {
                setInputValue('');
                setSelected(null);
                onSelect(null, true);
            }
            setOptions([]);
        }
    }, [inputValue]);

    function getOptions(value: string, city?: string, region?: string, district?: string) {
        setLoading(true);
        getSettlements(value).then((cities: NovaPoshtaSettlementEntity[]) => {
            setOptions(cities);
            if (city && region) {
                const val = cities.find(c => c.city === city && c.region === region && (!district && !c.district || c.district === district));

                setSelected(val);
                onSelect(val, false);
            }
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
                      onChange={(_, value: NovaPoshtaSettlementEntity) => {
                          setSelected(value);
                          onSelect(value, true);
                      }}
                      getOptionLabel={(opt: NovaPoshtaSettlementEntity) => opt.title}
                      renderInput={(params) => (
                          <TextField {...params} label="Місто" placeholder="Введіть місто" variant="outlined"/>
                      )}
                      renderOption={(p, option: NovaPoshtaSettlementEntity) =>
                          <Box component="li" {...p} key={option.ref}>{option.title}</Box>
                      }/>
    );
}
