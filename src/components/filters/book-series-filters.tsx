import React from 'react';
import { FormContainer, useForm } from 'react-hook-form-mui';
import CustomSelectField from '@/components/form-fields/custom-select-field';
import { BookSeriesFilter } from '@/lib/data/types';
import { usePublishingHouseOptions } from '@/lib/graphql/queries/publishing-house/hook';
import { Grid } from '@mui/material';
import CustomTextField from '@/components/form-fields/custom-text-field';
import SortFiltersContainer from '@/components/filters/sort-filters-container';

export function BookSeriesFilters({ tableKeys, pageSettings, onApply, onSort }) {
    const formContext = useForm<BookSeriesFilter>({});
    const { items: publishingHouseOptions } = usePublishingHouseOptions();
    const { name, publishingHouse } = formContext.watch();

    function onClearClick() {
        formContext.reset();
        onApply();
    }

    function clearValue(controlName: keyof BookSeriesFilter) {
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
                                         label="Назва"
                                         name="name"
                                         showClear={!!name}
                                         onClear={() => clearValue('name')}/>
                    </Grid>

                    <Grid item xs={12}>
                        <CustomSelectField fullWidth
                                           options={publishingHouseOptions}
                                           id="publishing-house-id"
                                           label="Видавництво"
                                           name="publishingHouse"
                                           showClear={!!publishingHouse}
                                           onClear={() => clearValue('publishingHouse')}/>
                    </Grid>
                </Grid>
            </FormContainer>
        </SortFiltersContainer>
    );
}
