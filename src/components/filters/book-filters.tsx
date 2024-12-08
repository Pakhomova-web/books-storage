import React, { useEffect, useState } from 'react';
import { MultiSelectElement, useForm } from 'react-hook-form-mui';
import { Box, Grid } from '@mui/material';

import { BookFilter, BookSeriesFilter, IOption, IPageable } from '@/lib/data/types';
import { useLanguageOptions } from '@/lib/graphql/queries/language/hooks';
import CustomSelectField from '@/components/form-fields/custom-select-field';
import CustomTextField from '@/components/form-fields/custom-text-field';
import CustomCheckbox from '@/components/form-fields/custom-checkbox';
import SortFiltersContainer from '@/components/filters/sort-filters-container';
import { useBookTypeOptions } from '@/lib/graphql/queries/book-type/hook';
import { usePageTypeOptions } from '@/lib/graphql/queries/page-type/hook';
import { useAuthorOptions } from '@/lib/graphql/queries/author/hook';
import { useCoverTypeOptions } from '@/lib/graphql/queries/cover-type/hook';
import { usePublishingHouseOptions } from '@/lib/graphql/queries/publishing-house/hook';
import { useBookSeriesOptions } from '@/lib/graphql/queries/book-series/hook';
import { customFieldClearBtnStyles } from '@/constants/styles-variables';
import Ages from '@/components/ages';
import { ISortKey } from '@/components/types';
import Loading from '@/components/loading';
import CustomAutocompleteField from '@/components/form-fields/custom-autocomplete-field';
import CustomMultipleAutocompleteField from '@/components/form-fields/custom-multiple-autocomplete-field';

interface IBookFiltersProps {
    defaultValues?: BookFilter,
    onApply: (values?: BookFilter) => void,
    pageSettings: IPageable,
    showAlwaysSorting?: boolean,
    onSort: (pageSettings: IPageable) => void,
    totalCount: number
}

export function BookFilters(props: IBookFiltersProps) {
    const formContext = useForm<BookFilter>({ defaultValues: props.defaultValues });
    const [sortKeys] = useState<ISortKey[]>([
        {
            title: 'Спочатку найдорожчі',
            orderBy: 'priceWithDiscount', order: 'desc'
        },
        {
            title: 'Спочатку найдешевші',
            orderBy: 'priceWithDiscount', order: 'asc'
        },
        {
            title: 'За наявністю',
            orderBy: 'numberInStock', order: 'desc'
        },
        {
            title: 'Спочатку акційні',
            orderBy: 'discount', order: 'desc'
        },
        {
            title: 'За популярністю',
            orderBy: 'numberSold', order: 'desc'
        }
    ]);
    const {
        quickSearch,
        bookTypes,
        coverType,
        pageType,
        name,
        priceMin,
        priceMax,
        languages,
        tags,
        publishingHouse,
        bookSeries,
        ages,
        authors
    } = formContext.watch();
    const { items: bookTypeOptions, loading: loadingBookTypes } = useBookTypeOptions();
    const { items: pageTypeOptions } = usePageTypeOptions();
    const { items: authorOptions, loading: loadingAuthors } = useAuthorOptions();
    const { items: languageOptions } = useLanguageOptions();
    const { items: coverTypeOptions } = useCoverTypeOptions();
    const { items: publishingHouses } = usePublishingHouseOptions();
    const {
        items: bookSeriesOptions,
        loading: loadingBookSeries
    } = useBookSeriesOptions(publishingHouse ? new BookSeriesFilter({ publishingHouse }) : null);

    useEffect(() => {
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
        formContext.setValue(controlName, null);
    }

    function onAgeClick(opt: number) {
        if (ages?.includes(opt)) {
            formContext.setValue('ages', ages.filter(age => age !== opt));
        } else {
            formContext.setValue('ages', ages ? [...ages, opt] : [opt]);
        }
    }

    function getValues() {
        const { priceMin, priceMax, ...values } = formContext.getValues();

        return {
            ...values,
            priceMin: +priceMin || null,
            priceMax: +priceMax || null
        };
    }

    return (
        <SortFiltersContainer sortKeys={sortKeys}
                              totalCount={props.totalCount}
                              showAlwaysSorting={props.showAlwaysSorting}
                              pageSettings={props.pageSettings}
                              onApply={() => props.onApply(getValues())}
                              onClear={() => onClearClick()}
                              formContext={formContext}
                              onSort={props.onSort}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <CustomTextField fullWidth
                                     id="quickSearch"
                                     label="Швидкий пошук"
                                     name="quickSearch"
                                     autoFocus={true}
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
                    <CustomAutocompleteField options={publishingHouses}
                                             label="Видавництво"
                                             selected={publishingHouse}
                                             onChange={val => formContext.setValue('publishingHouse', val?.id)}/>
                </Grid>

                <Grid item xs={12}>
                    <CustomAutocompleteField options={bookSeriesOptions}
                                             label="Серія"
                                             loading={loadingBookSeries}
                                             selected={bookSeries}
                                             onChange={val => formContext.setValue('bookSeries', val?.id)}/>
                </Grid>

                <Grid item xs={12}>
                    <CustomTextField fullWidth
                                     id="book-name"
                                     label="Назва"
                                     name="name"
                                     showClear={!!name}
                                     onClear={() => clearValue('name')}/>
                </Grid>

                <Grid item xs={6}>
                    <CustomTextField id="priceMin"
                                     label="Ціна від, грн"
                                     name="priceMin"
                                     showClear={!!priceMin}
                                     type="number"
                                     onClear={() => clearValue('priceMin')}/>
                </Grid>

                <Grid item xs={6}>
                    <CustomTextField id="priceMax"
                                     label="Ціна до, грн"
                                     name="priceMax"
                                     showClear={!!priceMax}
                                     type="number"
                                     onClear={() => clearValue('priceMax')}/>
                </Grid>

                <Grid item xs={12}>
                    <CustomSelectField fullWidth
                                       options={languageOptions}
                                       id="language-id"
                                       label="Мова"
                                       name="languages"
                                       showClear={!!languages}
                                       onClear={() => clearValue('languages')}/>
                </Grid>

                <Grid item xs={12}>
                    <Box position="relative" mb={1}>
                        <Loading isSmall={true} show={loadingBookTypes}></Loading>
                        <MultiSelectElement fullWidth
                                            options={bookTypeOptions}
                                            id="bookTypes"
                                            label="Типи"
                                            name="bookTypes" showCheckbox variant="outlined"/>
                        {!!bookTypes?.length &&
                          <Box sx={customFieldClearBtnStyles}
                               onClick={() => clearValue('bookTypes')}>
                            Очистити
                          </Box>}
                    </Box>
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
                                       label="Обкладинка"
                                       name="coverType"
                                       showClear={!!coverType}
                                       onClear={() => clearValue('coverType')}/>
                </Grid>

                <Grid item xs={12}>
                    <CustomMultipleAutocompleteField options={authorOptions}
                                                     label="Автори, іллюстратори"
                                                     showClear={!!authors?.length}
                                                     onClear={() => formContext.setValue('authors', [])}
                                                     loading={loadingAuthors}
                                                     selected={authors}
                                                     onChange={(values: IOption<string>[]) => formContext.setValue('authors', values.map(v => v.id))}/>
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
        </SortFiltersContainer>
    );
}
