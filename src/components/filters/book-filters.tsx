import React, { useEffect } from 'react';
import { FormContainer, MultiSelectElement, useForm } from 'react-hook-form-mui';
import { BookEntity, BookFilter, BookSeriesFilter, IPageable } from '@/lib/data/types';
import { useLanguageOptions } from '@/lib/graphql/queries/language/hooks';
import { Box, Grid } from '@mui/material';
import CustomSelectField from '@/components/form-fields/custom-select-field';
import CustomTextField from '@/components/form-fields/custom-text-field';
import CustomCheckbox from '@/components/form-fields/custom-checkbox';
import SortFiltersContainer from '@/components/filters/sort-filters-container';
import { useBookTypeOptions } from '@/lib/graphql/queries/book-type/hook';
import { usePageTypeOptions } from '@/lib/graphql/queries/page-type/hook';
import { useAuthorOptions } from '@/lib/graphql/queries/author/hook';
import { useCoverTypeOptions } from '@/lib/graphql/queries/cover-type/hook';
import { usePublishingHouseOptions } from '@/lib/graphql/queries/publishing-house/hook';
import { TableKey } from '@/components/table/table-key';
import { useBookSeriesOptions } from '@/lib/graphql/queries/book-series/hook';
import { customFieldClearBtnStyles, styleVariables } from '@/constants/styles-variables';
import Ages from '@/components/ages';

interface IBookFiltersProps {
    defaultValues?: BookFilter,
    tableKeys: TableKey<BookEntity>[],
    onApply: (values?: BookFilter) => void,
    pageSettings: IPageable,
    showAlwaysSorting?: boolean,
    onSort: (pageSettings: IPageable) => void
}

export function BookFilters(props: IBookFiltersProps) {
    const formContext = useForm<BookFilter>({ defaultValues: props.defaultValues });
    const {
        quickSearch,
        bookType,
        coverType,
        pageType,
        name,
        language,
        tags,
        publishingHouse,
        bookSeries,
        ages,
        authors
    } = formContext.watch();
    const { items: bookTypeOptions } = useBookTypeOptions();
    const { items: pageTypeOptions } = usePageTypeOptions();
    const { items: authorOptions } = useAuthorOptions();
    const { items: languageOptions } = useLanguageOptions();
    const { items: coverTypeOptions } = useCoverTypeOptions();
    const { items: publishingHouses } = usePublishingHouseOptions();
    const {
        items: bookSeriesOptions,
        loading: loadingBookSeries,
        refetch: refetchBookSeries
    } = useBookSeriesOptions(publishingHouse ? new BookSeriesFilter({ publishingHouse }) : null, !publishingHouse);

    useEffect(() => {
        if (publishingHouses) {
            refetchBookSeries({ publishingHouse }, false);
        }
        formContext.setValue('bookSeries', null);
    }, [publishingHouse]);

    useEffect(() => {
        if (props.defaultValues) {
            Object.keys(props.defaultValues).forEach((key) => {
                formContext.setValue(key as keyof BookFilter, props.defaultValues[key]);
            });
        }
    }, [props.defaultValues]);

    function onClearClick() {
        formContext.reset();
        props.onApply();
    }

    function clearValue(controlName: keyof BookFilter) {
        formContext.setValue(controlName, []);
    }

    function onAgeClick(opt: number) {
        if (ages?.includes(opt)) {
            formContext.setValue('ages', ages.filter(age => age !== opt));
        } else {
            formContext.setValue('ages', ages ? [...ages, opt] : [opt]);
        }
    }

    return (
        <SortFiltersContainer tableKeys={props.tableKeys}
                              showAlwaysSorting={props.showAlwaysSorting}
                              pageSettings={props.pageSettings}
                              onApply={() => props.onApply(formContext.getValues())}
                              onClear={() => onClearClick()}
                              onSort={props.onSort}>
            <FormContainer formContext={formContext}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <CustomTextField fullWidth
                                         id="quickSearch"
                                         label="Швидкий пошук"
                                         name="quickSearch"
                                         showClear={!!quickSearch}
                                         onClear={() => clearValue('quickSearch')}/>
                    </Grid>

                    <Grid item xs={12}>
                        <CustomTextField fullWidth
                                         id="tags"
                                         label="Теги"
                                         name="tags"
                                         showClear={!!tags?.length}
                                         onClear={() => clearValue('tags')}/>
                    </Grid>

                    <Grid item xs={12}>
                        <CustomSelectField fullWidth
                                           options={publishingHouses}
                                           id="publishing-house-id"
                                           label="Видавництво"
                                           name="publishingHouse"
                                           showClear={!!publishingHouse}
                                           onClear={() => clearValue('publishingHouse')}/>
                    </Grid>

                    <Grid item xs={12}>
                        <CustomSelectField fullWidth
                                           options={bookSeriesOptions}
                                           id="book-series-id"
                                           loading={loadingBookSeries}
                                           label="Серія"
                                           name="bookSeries"
                                           showClear={!!bookSeries}
                                           onClear={() => clearValue('bookSeries')}/>
                    </Grid>

                    <Grid item xs={12}>
                        <CustomSelectField fullWidth
                                           options={bookTypeOptions}
                                           id="book-type-id"
                                           label="Тип книги"
                                           name="bookType"
                                           showClear={!!bookType}
                                           onClear={() => clearValue('bookType')}/>
                    </Grid>

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
                                           options={languageOptions}
                                           id="language-id"
                                           label="Мова"
                                           name="language"
                                           showClear={!!language}
                                           onClear={() => clearValue('language')}/>
                    </Grid>

                    <Grid item xs={12}>
                        <CustomSelectField fullWidth
                                           options={pageTypeOptions}
                                           id="page-type-id"
                                           label="Тип сторінок"
                                           name="pageType"
                                           showClear={!!pageType}
                                           onClear={() => clearValue('pageType')}/>
                    </Grid>

                    <Grid item xs={12}>
                        <CustomSelectField fullWidth
                                           options={coverTypeOptions}
                                           id="cover-type-id"
                                           label="Тип обкладинки"
                                           name="coverType"
                                           showClear={!!coverType}
                                           onClear={() => clearValue('coverType')}/>
                    </Grid>

                    <Grid item xs={12}>
                        <Box position="relative">
                            <MultiSelectElement fullWidth
                                                options={authorOptions}
                                                id="authors"
                                                label="Автори"
                                                name="authors" showCheckbox variant="outlined"/>
                            {!!authors?.length &&
                              <Box sx={customFieldClearBtnStyles} onClick={() => clearValue('authors')}>Очистити</Box>}
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Ages selected={ages} onOptionClick={onAgeClick}></Ages>
                    </Grid>

                    <Grid item xs={12}>
                        <CustomCheckbox label="В наявності" name="isInStock"/>
                    </Grid>

                    <Grid item xs={12}>
                        <CustomCheckbox label="Акційні" name="withDiscount"/>
                    </Grid>
                </Grid>
            </FormContainer>
        </SortFiltersContainer>
    );
}
