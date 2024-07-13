import React from 'react';
import { FormContainer, useForm } from 'react-hook-form-mui';

import { FiltersPanel } from '@/components/filters/filters-panel';
import CustomSelectField from '@/components/modals/custom-select-field';
import { BookEntity } from '@/lib/data/types';
import {
    useAuthorOptions,
    useBookTypeOptions,
    useCoverTypeOptions,
    useLanguageOptions,
    usePageTypeOptions
} from '@/lib/graphql/hooks';
import { Grid } from '@mui/material';
import CustomTextField from '@/components/modals/custom-text-field';

export function BookFilters({ onApply }) {
    const formContext = useForm<BookEntity>({});
    const { items: bookTypeOptions } = useBookTypeOptions();
    const { items: pageTypeOptions } = usePageTypeOptions();
    const { items: authorOptions } = useAuthorOptions();
    const { items: languageOptions } = useLanguageOptions();
    const { items: coverTypeOptions } = useCoverTypeOptions();

    function onClearClick() {
        formContext.reset();
        onApply();
    }

    return (
        <FiltersPanel onApply={() => onApply(formContext.getValues())} onClear={() => onClearClick()}>
            <FormContainer formContext={formContext}>
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <CustomSelectField fullWidth
                                           options={bookTypeOptions}
                                           id="book-type-id"
                                           label="Book Type"
                                           name="bookTypeId"/>
                    </Grid>

                    <Grid item xs={2}>
                        <CustomTextField fullWidth
                                         id="book-name"
                                         label="Name"
                                         name="name"/>
                    </Grid>

                    <Grid item xs={2}>
                        <CustomSelectField fullWidth
                                           options={languageOptions}
                                           id="language-id"
                                           label="Language"
                                           name="languageId"/>
                    </Grid>

                    <Grid item xs={2}>
                        <CustomSelectField fullWidth
                                           options={pageTypeOptions}
                                           id="page-type-id"
                                           label="Page Type"
                                           name="pageTypeId"/>
                    </Grid>

                    <Grid item xs={2}>
                        <CustomSelectField fullWidth
                                           options={coverTypeOptions}
                                           id="cover-type-id"
                                           label="Cover Type"
                                           name="coverTypeId"/>
                    </Grid>

                    <Grid item xs={2}>
                        <CustomSelectField fullWidth
                                           options={authorOptions}
                                           id="author"
                                           label="Author"
                                           name="authorId"/>
                    </Grid>
                </Grid>
            </FormContainer>
        </FiltersPanel>
    );
}
