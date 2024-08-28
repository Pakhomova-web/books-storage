import React from 'react';
import { FormContainer, useForm } from 'react-hook-form-mui';

import { FiltersPanel } from '@/components/filters/filters-panel';
import { IBookFilter } from '@/lib/data/types';
import {
    useAuthorOptions,
    useBookTypeOptions,
    useCoverTypeOptions,
    useLanguageOptions,
    usePageTypeOptions
} from '@/lib/graphql/hooks';
import { Grid } from '@mui/material';
import CustomSelectField from '@/components/form-fields/custom-select-field';
import CustomTextField from '@/components/form-fields/custom-text-field';
import CustomCheckbox from '@/components/form-fields/custom-checkbox';
import SortFiltersContainer from '@/components/filters/sort-filters-container';

export function BookFilters({ tableKeys, onApply, onSort }) {
    const formContext = useForm<IBookFilter>();
    const { items: bookTypeOptions } = useBookTypeOptions();
    const { items: pageTypeOptions } = usePageTypeOptions();
    const { items: authorOptions } = useAuthorOptions();
    const { items: languageOptions } = useLanguageOptions();
    const { items: coverTypeOptions } = useCoverTypeOptions();
    const { quickSearch, bookType, author, coverType, pageType, name, language } = formContext.watch();

    function onClearClick() {
        formContext.reset();
        onApply();
    }

    function clearValue(controlName: keyof IBookFilter) {
        formContext.setValue(controlName, null);
    }

    return (
        <SortFiltersContainer tableKeys={tableKeys} onSort={onSort}>
            <FiltersPanel onApply={() => onApply(formContext.getValues())} onClear={() => onClearClick()}>
                <FormContainer formContext={formContext}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={2}>
                            <CustomTextField fullWidth
                                             id="quickSearch"
                                             label="Quick Search"
                                             name="quickSearch"
                                             showClear={!!quickSearch}
                                             onClear={() => clearValue('quickSearch')}/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={2}>
                            <CustomSelectField fullWidth
                                               options={bookTypeOptions}
                                               id="book-type-id"
                                               label="Book Type"
                                               name="bookType"
                                               showClear={!!bookType}
                                               onClear={() => clearValue('bookType')}/>
                        </Grid>

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
                                               options={languageOptions}
                                               id="language-id"
                                               label="Language"
                                               name="language"
                                               showClear={!!language}
                                               onClear={() => clearValue('language')}/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={2}>
                            <CustomSelectField fullWidth
                                               options={pageTypeOptions}
                                               id="page-type-id"
                                               label="Page Type"
                                               name="pageType"
                                               showClear={!!pageType}
                                               onClear={() => clearValue('pageType')}/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={2}>
                            <CustomSelectField fullWidth
                                               options={coverTypeOptions}
                                               id="cover-type-id"
                                               label="Cover Type"
                                               name="coverType"
                                               showClear={!!coverType}
                                               onClear={() => clearValue('coverType')}/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={2}>
                            <CustomSelectField fullWidth
                                               options={authorOptions}
                                               id="author"
                                               label="Author"
                                               name="author"
                                               showClear={!!author}
                                               onClear={() => clearValue('author')}/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={2}>
                            <CustomCheckbox label="In Stock" name="isInStock"/>
                        </Grid>
                    </Grid>
                </FormContainer>
            </FiltersPanel>
        </SortFiltersContainer>
    );
}
