import React from 'react';
import { FormContainer, useForm } from 'react-hook-form-mui';

import { FiltersPanel } from '@/components/filters/filters-panel';
import { Grid } from '@mui/material';
import CustomTextField from '@/components/form-fields/custom-text-field';

export function NameFiltersPanel({ onApply }) {
    const formContext = useForm<{ name: string }>({});

    function onClearClick() {
        formContext.reset();
        onApply();
    }

    return (
        <FiltersPanel onApply={() => onApply(formContext.getValues())} onClear={() => onClearClick()}>
            <FormContainer formContext={formContext}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={2}>
                        <CustomTextField fullWidth
                                         id="name"
                                         label="Name"
                                         name="name"/>
                    </Grid>
                </Grid>
            </FormContainer>
        </FiltersPanel>
    );
}
