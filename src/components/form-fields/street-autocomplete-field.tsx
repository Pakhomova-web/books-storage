import { Autocomplete, Box, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { getStreets } from '@/lib/graphql/queries/nova-poshta/hooks';
import { NovaPoshtaStreetEntity } from '@/lib/data/types';

export default function StreetAutocompleteField({ settlementRef, street = null, onSelect }) {
    const [loading, setLoading] = useState<boolean>(false);
    const [options, setOptions] = useState<NovaPoshtaStreetEntity[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const [selected, setSelected] = useState<NovaPoshtaStreetEntity>(null);

    useEffect(() => {
        setSelected(null);
        if (street && settlementRef) {
            getOptions(`${street}`, street);
        } else if (!settlementRef && !street) {
            setInputValue('');
            onSelect(null, true);
        }
    }, [street, settlementRef]);

    useEffect(() => {
        if (!!inputValue && selected?.description !== inputValue) {
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

    function getOptions(value: string, valueToSet: string = null) {
        setLoading(true);
        getStreets(settlementRef, value).then((streets: NovaPoshtaStreetEntity[]) => {
            setOptions(streets);
            if (valueToSet) {
                const val = streets.find(c => c.description === valueToSet);

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
                      disabled={!settlementRef}
                      value={selected}
                      onInputChange={(_, value) => setInputValue(value)}
                      options={options}
                      onChange={(_, value: NovaPoshtaStreetEntity) => {
                          setSelected(value);
                          onSelect(value, true);
                      }}
                      getOptionLabel={(opt: NovaPoshtaStreetEntity) => opt.description}
                      renderInput={(params) => (
                          <TextField {...params} label="Вулиця" placeholder="Введіть вулицю"
                                     helperText={!settlementRef ? 'Виберіть місто' : ''}
                                     variant="outlined"/>
                      )}
                      renderOption={(p, option: NovaPoshtaStreetEntity) =>
                          <Box component="li" {...p} key={option.description}>{option.description}</Box>
                      }/>
    );
}
