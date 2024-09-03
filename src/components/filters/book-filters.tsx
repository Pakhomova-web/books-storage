import React from 'react';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { IBookFilter } from '@/lib/data/types';
import { useLanguageOptions } from '@/lib/graphql/queries/language/hooks';
import { Grid } from '@mui/material';
import CustomSelectField from '@/components/form-fields/custom-select-field';
import CustomTextField from '@/components/form-fields/custom-text-field';
import CustomCheckbox from '@/components/form-fields/custom-checkbox';
import SortFiltersContainer from '@/components/filters/sort-filters-container';
import { useBookTypeOptions } from '@/lib/graphql/queries/book-type/hook';
import { usePageTypeOptions } from '@/lib/graphql/queries/page-type/hook';
import { useAuthorOptions } from '@/lib/graphql/queries/author/hook';
import { useCoverTypeOptions } from '@/lib/graphql/queries/cover-type/hook';

export function BookFilters({ tableKeys, onApply, pageSettings, onSort }) {
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
        <SortFiltersContainer tableKeys={tableKeys}
                              pageSettings={pageSettings}
                              onApply={() => onApply(formContext.getValues())}
                              onClear={() => onClearClick()}
                              onSort={onSort}>
            <FormContainer formContext={formContext}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <CustomTextField fullWidth
                                         id="quickSearch"
                                         label="Quick Search"
                                         name="quickSearch"
                                         showClear={!!quickSearch}
                                         onClear={() => clearValue('quickSearch')}/>
                    </Grid>

                    <Grid item xs={12}>
                        <CustomSelectField fullWidth
                                           options={bookTypeOptions}
                                           id="book-type-id"
                                           label="Book Type"
                                           name="bookType"
                                           showClear={!!bookType}
                                           onClear={() => clearValue('bookType')}/>
                    </Grid>

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
                                           options={languageOptions}
                                           id="language-id"
                                           label="Language"
                                           name="language"
                                           showClear={!!language}
                                           onClear={() => clearValue('language')}/>
                    </Grid>

                    <Grid item xs={12}>
                        <CustomSelectField fullWidth
                                           options={pageTypeOptions}
                                           id="page-type-id"
                                           label="Page Type"
                                           name="pageType"
                                           showClear={!!pageType}
                                           onClear={() => clearValue('pageType')}/>
                    </Grid>

                    <Grid item xs={12}>
                        <CustomSelectField fullWidth
                                           options={coverTypeOptions}
                                           id="cover-type-id"
                                           label="Cover Type"
                                           name="coverType"
                                           showClear={!!coverType}
                                           onClear={() => clearValue('coverType')}/>
                    </Grid>

                    <Grid item xs={12}>
                        <CustomSelectField fullWidth
                                           options={authorOptions}
                                           id="author"
                                           label="Author"
                                           name="author"
                                           showClear={!!author}
                                           onClear={() => clearValue('author')}/>
                    </Grid>

                    <Grid item xs={12}>
                        <CustomCheckbox label="In Stock" name="isInStock"/>
                    </Grid>
                </Grid>
            </FormContainer>
        </SortFiltersContainer>
    );
}
