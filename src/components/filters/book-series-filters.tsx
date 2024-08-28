import React from 'react';
import { FormContainer, useForm } from 'react-hook-form-mui';
import CustomSelectField from '@/components/form-fields/custom-select-field';
import { IBookSeriesFilter } from '@/lib/data/types';
import { usePublishingHouseOptions } from '@/lib/graphql/hooks';
import { Grid } from '@mui/material';
import CustomTextField from '@/components/form-fields/custom-text-field';
import SortFiltersContainer from '@/components/filters/sort-filters-container';

export function BookSeriesFilters({ tableKeys, pageSettings, onApply, onSort }) {
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
        <SortFiltersContainer tableKeys={tableKeys}
                              pageSettings={pageSettings}
                              onApply={() => onApply(formContext.getValues())}
                              onClear={() => onClearClick()}
                              onSort={onSort}>
            <FormContainer formContext={formContext}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <CustomTextField fullWidth
                                         id="book-name"
                                         label="Name"
                                         name="name"
                                         showClear={!!name}
                                         onClear={() => clearValue('name')}/>
                    </Grid>

                    <Grid item xs={12}>
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
        </SortFiltersContainer>
    );
}
