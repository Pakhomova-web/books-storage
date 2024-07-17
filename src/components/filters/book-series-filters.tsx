import React from 'react';
import { FormContainer, useForm } from 'react-hook-form-mui';

import { FiltersPanel } from '@/components/filters/filters-panel';
import CustomSelectField from '@/components/modals/custom-select-field';
import { IBookSeriesFilter } from '@/lib/data/types';
import { usePublishingHouseOptions } from '@/lib/graphql/hooks';
import { Grid } from '@mui/material';
import CustomTextField from '@/components/modals/custom-text-field';

export function BookSeriesFilters({ onApply }) {
    const formContext = useForm<IBookSeriesFilter>({});
    const { items: publishingHouseOptions } = usePublishingHouseOptions();

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
                                         id="book-name"
                                         label="Name"
                                         name="name"/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={2}>
                        <CustomSelectField fullWidth
                                           options={publishingHouseOptions}
                                           id="publishing-house-id"
                                           label="Publishing House"
                                           name="publishingHouse"/>
                    </Grid>
                </Grid>
            </FormContainer>
        </FiltersPanel>
    );
}
