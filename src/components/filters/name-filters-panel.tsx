import React from 'react';
import { FormContainer, useForm } from 'react-hook-form-mui';

import { FiltersPanel } from '@/components/filters/filters-panel';
import { Grid } from '@mui/material';
import CustomTextField from '@/components/form-fields/custom-text-field';

interface INameForm {
    name: string
}

export function NameFiltersPanel({ onApply }) {
    const formContext = useForm<INameForm>({});

    function onClearClick() {
        formContext.reset();
        onApply();
    }

    function clearValue(controlName: keyof INameForm) {
        formContext.setValue(controlName, null);
    }

    return (
        <FiltersPanel onApply={() => onApply(formContext.getValues())} onClear={() => onClearClick()}>
            <FormContainer formContext={formContext}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={2}>
                        <CustomTextField fullWidth
                                         id="name"
                                         label="Name"
                                         name="name"
                                         showClear={!!formContext.getValues('name')}
                                         onClear={() => clearValue('name')}/>
                    </Grid>
                </Grid>
            </FormContainer>
        </FiltersPanel>
    );
}
