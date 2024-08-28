import React from 'react';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { Grid } from '@mui/material';
import CustomTextField from '@/components/form-fields/custom-text-field';
import SortFiltersContainer from '@/components/filters/sort-filters-container';

interface INameForm {
    name: string
}

export function NameFiltersPanel({ tableKeys, pageSettings, onSort, onApply }) {
    const formContext = useForm<INameForm>({});

    function onClearClick() {
        formContext.reset();
        onApply();
    }

    function clearValue(controlName: keyof INameForm) {
        formContext.setValue(controlName, null);
    }

    return (
        <SortFiltersContainer tableKeys={tableKeys}
                              pageSettings={pageSettings}
                              onApply={() => onApply(formContext.getValues())}
                              onClear={() => onClearClick()}
                              onSort={onSort}>
            <FormContainer formContext={formContext}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <CustomTextField fullWidth
                                         id="name"
                                         label="Name"
                                         name="name"
                                         showClear={!!formContext.getValues('name')}
                                         onClear={() => clearValue('name')}/>
                    </Grid>
                </Grid>
            </FormContainer>
        </SortFiltersContainer>
    );
}
