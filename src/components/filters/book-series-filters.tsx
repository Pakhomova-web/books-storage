import React from 'react';
import { FormContainer, useForm } from 'react-hook-form-mui';

import { FiltersPanel } from '@/components/filters/filters-panel';
import CustomSelectField from '@/components/form-fields/custom-select-field';
import { IBookSeriesFilter } from '@/lib/data/types';
import { usePublishingHouseOptions } from '@/lib/graphql/hooks';
import { Grid } from '@mui/material';
import CustomTextField from '@/components/form-fields/custom-text-field';

export function BookSeriesFilters({ onApply }) {
    const formContext = useForm<IBookSeriesFilter>({});
    const { items: publishingHouseOptions } = usePublishingHouseOptions();
    const { name, publishingHouse } = formContext.watch();

    function onClearClick() {
        formContext.reset();
        onApply();
    }

    function clearValue(controlName: keyof IBookSeriesFilter) {
        formContext.setValue(controlName, null);
    }

    return (
        <FiltersPanel onApply={() => onApply(formContext.getValues())} onClear={() => onClearClick()}>
            <FormContainer formContext={formContext}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={2}>
                        <CustomTextField fullWidth
                                         id="book-name"
                                         label="Name"
                                         name="name"
                                         showClear={!!name}
                                         onClear={() => clearValue('name')}/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={2}>
                        <CustomSelectField fullWidth
                                           options={publishingHouseOptions}
                                           id="publishing-house-id"
                                           label="Publishing House"
                                           name="publishingHouse"
                                           showClear={!!publishingHouse}
                                           onClear={() => clearValue('publishingHouse')}/>
                    </Grid>
                </Grid>
            </FormContainer>
        </FiltersPanel>
    );
}
