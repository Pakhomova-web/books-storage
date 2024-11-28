import React, { useState } from 'react';
import { useForm } from 'react-hook-form-mui';
import { Grid } from '@mui/material';
import CustomTextField from '@/components/form-fields/custom-text-field';
import SortFiltersContainer from '@/components/filters/sort-filters-container';
import { ISortKey } from '@/components/types';

interface INameForm {
    name: string
}

export function NameFiltersPanel({ pageSettings, onSort, onApply }) {
    const formContext = useForm<INameForm>({});
    const [sortKeys] = useState<ISortKey[]>([
        {
            title: 'Назва в алфавітному порядку',
            orderBy: 'name',
            order: 'asc'
        },
        {
            title: 'Назва в оборотному порядку',
            orderBy: 'name',
            order: 'asc'
        }
    ]);

    function onClearClick() {
        formContext.reset();
        onApply();
    }

    function clearValue(controlName: keyof INameForm) {
        formContext.setValue(controlName, null);
    }

    return (
        <SortFiltersContainer sortKeys={sortKeys}
                              pageSettings={pageSettings}
                              formContext={formContext}
                              onApply={() => onApply(formContext.getValues())}
                              onClear={() => onClearClick()}
                              onSort={onSort}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <CustomTextField fullWidth
                                     id="name"
                                     autoFocus={true}
                                     label="Назва"
                                     name="name"
                                     showClear={!!formContext.getValues('name')}
                                     onClear={() => clearValue('name')}/>
                </Grid>
            </Grid>
        </SortFiltersContainer>
    );
}
