import { BookEntity, BookSeriesEntity, BookSeriesFilter } from '@/lib/data/types';
import { FormContainer, MultiSelectElement, useForm } from 'react-hook-form-mui';
import { useCreateBook, useUpdateBook } from '@/lib/graphql/queries/book/hook';
import React, { useEffect, useState } from 'react';
import { Box, Button, Grid } from '@mui/material';

import CustomModal from '@/components/modals/custom-modal';
import CustomTextField from '@/components/form-fields/custom-text-field';
import CustomSelectField from '@/components/form-fields/custom-select-field';
import ErrorNotification from '@/components/error-notification';
import { useAuth } from '@/components/auth-context';
import { usePageTypeOptions } from '@/lib/graphql/queries/page-type/hook';
import { useAuthorOptions } from '@/lib/graphql/queries/author/hook';
import { useLanguageOptions } from '@/lib/graphql/queries/language/hooks';
import { useBookTypeOptions } from '@/lib/graphql/queries/book-type/hook';
import { usePublishingHouseOptions } from '@/lib/graphql/queries/publishing-house/hook';
import { useCoverTypeOptions } from '@/lib/graphql/queries/cover-type/hook';
import { getBookSeriesOptions } from '@/lib/graphql/queries/book-series/hook';
import CustomImage from '@/components/custom-image';
import Tag from '@/components/tag';
import { parseImageFromLink } from '@/utils/utils';
import {
    borderRadius,
    customFieldClearBtnStyles,
    primaryLightColor,
    styleVariables
} from '@/constants/styles-variables';
import Loading from '@/components/loading';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Ages from '@/components/ages';

interface IBookModalProps {
    open: boolean,
    item?: BookEntity,
    isSubmitDisabled?: boolean,
    isAdmin?: boolean,
    onClose: (updated?: boolean) => void
}

const imageBoxStyles = { height: '150px', maxHeight: '50vw', cursor: 'pointer' };

interface IForm {
    name: string,
    description: string,
    isbn: string,
    format: string,
    numberOfPages: number,
    numberInStock: number,
    price: number,
    authorIds: string[],
    coverTypeId: string,
    languageId: string,
    pageTypeId: string,
    bookTypeId: string,
    bookSeriesId: string,
    publishingHouseId?: string,
    imageIds: string[],
    imageLink: string,
    tags: string[],
    tag: string,
    ages: number[],
    discount: number,
    finalPrice: number
}

export default function BookModal({ open, item, onClose, isAdmin }: IBookModalProps) {
    const formContext = useForm<IForm>({
        defaultValues: {
            name: item?.name,
            numberOfPages: item?.numberOfPages,
            numberInStock: item?.numberInStock,
            price: item?.price,
            authorIds: item?.authors.map(({ id }) => id),
            languageId: item?.language?.id,
            coverTypeId: item?.coverType.id,
            pageTypeId: item?.pageType.id,
            bookTypeId: item?.bookType.id,
            bookSeriesId: item?.bookSeries.id,
            isbn: item?.id ? item?.isbn : null,
            format: item?.format,
            description: item?.description,
            publishingHouseId: item?.bookSeries.publishingHouse.id,
            imageIds: item?.id ? item.imageIds : null,
            tags: item?.tags,
            ages: item?.ages || [],
            discount: item?.discount,
            finalPrice: item ? +(item.price * (100 - item.discount) / 100).toFixed(2) : 0
        }
    });
    const {
        publishingHouseId,
        bookSeriesId,
        imageLink,
        imageIds,
        tags,
        tag,
        description,
        ages,
        authorIds,
        discount
    } = formContext.watch();
    const { update, updating, updatingError } = useUpdateBook();
    const { create, creating, creatingError } = useCreateBook();
    const { items: pageTypeOptions, loading: loadingPageTypes } = usePageTypeOptions();
    const { items: authorOptions, loading: loadingAuthors } = useAuthorOptions();
    const { items: languageOptions, loading: loadingLanguages } = useLanguageOptions();
    const [bookSeriesOptions, setBookSeriesOptions] = useState<BookSeriesEntity[]>([]);
    const { items: bookTypeOptions, loading: loadingBookTypes } = useBookTypeOptions();
    const { items: publishingHouseOptions, loading: loadingPublishingHouses } = usePublishingHouseOptions();
    const { items: coverTypeOptions, loading: loadingCoverTypes } = useCoverTypeOptions();
    const [loadingBookSeries, setLoadingBookSeries] = useState<boolean>();
    const [showModalForSeries, setShowModalForSeries] = useState<boolean>();
    const { checkAuth } = useAuth();
    const [activeImage, setActiveImage] = useState<string>();

    useEffect(() => {
        if (publishingHouseId) {
            setLoadingBookSeries(true);
            setBookSeriesOptions([]);
            getBookSeriesOptions({ publishingHouse: publishingHouseId } as BookSeriesFilter)
                .then(options => {
                    setLoadingBookSeries(false);
                    setBookSeriesOptions(options);
                    formContext.setValue('bookSeriesId', bookSeriesId ? options.find(({ id }) => id === bookSeriesId)?.id : null);
                })
                .catch(() => {
                    setLoadingBookSeries(false);
                });
        }
    }, [publishingHouseId]);

    useEffect(() => {
        formContext.setValue('finalPrice', +(formContext.getValues().price * (100 - discount) / 100).toFixed(2));
    }, [discount]);

    async function onSubmit(updateAllBooksInSeries = false) {
        setShowModalForSeries(false);
        parseImage();
        const { imageLink, ...values } = formContext.getValues();

        delete values.publishingHouseId;
        delete values.tag;
        const data = {
            id: item?.id,
            ...values,
            price: Number(values.price),
            numberOfPages: Number(values.numberOfPages),
            numberInStock: values.numberInStock ? Number(values.numberInStock) : 0
        };

        try {
            if (item?.id) {
                await update(data, updateAllBooksInSeries);
            } else {
                delete data.id;
                await create(data);
            }
            onClose(true);
        } catch (err) {
            checkAuth(err);
        }
    }

    function parseImage() {
        const id = parseImageFromLink(imageLink);

        if (id) {
            const imageIds = formContext.getValues().imageIds || [];

            if (!imageIds.some(imageId => id === imageId)) {
                formContext.setValue('imageIds', [...imageIds, id]);
            }
            formContext.setValue('imageLink', null);
        }
    }

    function addTag(e?) {
        if (!e || e.key === 'Enter') {
            const value = tag?.trim();

            if (value?.length >= 3) {
                if (tags) {
                    if (!tags.includes(value)) {
                        tags.push(value);
                    }
                } else {
                    formContext.setValue('tags', [value]);
                }
                formContext.setValue('tag', null);
            }
        }
    }

    function removeImage(imageId: string) {
        formContext.setValue('imageIds', formContext.getValues().imageIds.filter(id => imageId !== id));
    }

    function removeTag(tag: string) {
        formContext.setValue('tags', tags.filter(t => t !== tag));
    }

    function onAgeClick(opt: number) {
        if (ages.includes(opt)) {
            formContext.setValue('ages', ages.filter(age => age !== opt));
        } else {
            formContext.setValue('ages', [...ages, opt]);
        }
    }

    function onImageClick(imageId: string) {
        if (activeImage === imageId) {
            setActiveImage(null);
        } else if (activeImage) {
            const imageIds = formContext.getValues().imageIds;
            const indexActive = imageIds.findIndex(id => id === activeImage);
            const index = imageIds.findIndex(id => id === imageId);

            imageIds[indexActive] = imageId;
            imageIds[index] = activeImage;
            setActiveImage(null);
        } else {
            setActiveImage(imageId);
        }
    }

    return (
        <CustomModal title={(!item || !item.id ? 'Додати' : (!isAdmin ? 'Подивитися' : 'Відредагувати')) + ' книгу'}
                     open={open}
                     disableBackdropClick={true}
                     big={true}
                     onClose={() => onClose()}
                     loading={updating || creating}
                     isSubmitDisabled={!formContext.formState.isValid}
                     onSubmit={isAdmin ? () => (!item || item?.bookSeries.default ? onSubmit() : setShowModalForSeries(true)) : null}>
            <FormContainer formContext={formContext}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3} lg={2}>
                        <CustomTextField fullWidth
                                         required
                                         disabled={!isAdmin}
                                         autoFocus
                                         id="book-name"
                                         label="Назва"
                                         name="name"/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3} lg={2}>
                        <CustomSelectField fullWidth
                                           required
                                           disabled={!isAdmin}
                                           options={bookTypeOptions}
                                           loading={loadingBookTypes}
                                           id="book-type-id"
                                           label="Тип"
                                           name="bookTypeId"/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3} lg={2}>
                        <CustomSelectField fullWidth
                                           required
                                           disabled={!isAdmin}
                                           loading={loadingPublishingHouses}
                                           options={publishingHouseOptions}
                                           id="publishing-house-id"
                                           label="Видавництво"
                                           name="publishingHouseId"/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3} lg={2}>
                        <CustomSelectField fullWidth
                                           required
                                           disabled={!isAdmin || !publishingHouseId}
                                           loading={loadingBookSeries}
                                           options={bookSeriesOptions}
                                           id="book-series-id"
                                           label="Серія"
                                           name="bookSeriesId"/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3} lg={2}>
                        <CustomSelectField fullWidth
                                           required
                                           disabled={!isAdmin}
                                           loading={loadingLanguages}
                                           options={languageOptions}
                                           id="language-id"
                                           label="Мова"
                                           name="languageId"/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3} lg={2}>
                        <CustomSelectField fullWidth
                                           required
                                           disabled={!isAdmin}
                                           loading={loadingPageTypes}
                                           options={pageTypeOptions}
                                           id="page-type-id"
                                           label="Тип сторінок"
                                           name="pageTypeId"/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3} lg={2}>
                        <CustomSelectField fullWidth
                                           required
                                           disabled={!isAdmin}
                                           loading={loadingCoverTypes}
                                           options={coverTypeOptions}
                                           id="cover-type-id"
                                           label="Тип обкладинки"
                                           name="coverTypeId"/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3} lg={2}>
                        <CustomTextField fullWidth
                                         disabled={!isAdmin}
                                         id="isbn"
                                         label="ISBN"
                                         name="isbn"/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3} lg={2}>
                        <CustomTextField fullWidth
                                         disabled={!isAdmin}
                                         id="format"
                                         label="Формат, мм"
                                         name="format"/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3} lg={2}>
                        <CustomTextField fullWidth
                                         required
                                         disabled={!isAdmin}
                                         id="numberOfPages"
                                         type="number"
                                         label="Кількість сторінок"
                                         name="numberOfPages"/>
                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                        <Box sx={styleVariables.positionRelative} mb={1}>
                            <Loading isSmall={true} show={loadingAuthors}></Loading>
                            <MultiSelectElement fullWidth
                                                options={authorOptions}
                                                id="authors"
                                                label="Автори"
                                                name="authorIds" showCheckbox variant="standard"/>
                            {isAdmin && !!authorIds?.length &&
                              <Box sx={customFieldClearBtnStyles}
                                   onClick={() => formContext.setValue('authorIds', null)}>
                                Очистити
                              </Box>}
                        </Box>
                    </Grid>

                    {isAdmin &&
                      <Grid item xs={12} sm={6} md={3} lg={2}>
                        <CustomTextField fullWidth
                                         id="numberInStock"
                                         type="number"
                                         label="Кількість в наявності"
                                         name="numberInStock"/>
                      </Grid>}

                    <Grid item xs={12} sm={6} md={3} lg={2}>
                        <CustomTextField fullWidth
                                         required
                                         disabled={!isAdmin}
                                         type="number"
                                         id="price"
                                         label="Ціна, грн"
                                         name="price"/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3} lg={2}>
                        <CustomTextField fullWidth
                                         disabled={!isAdmin}
                                         type="number"
                                         id="discount"
                                         label="Знижка, %"
                                         showClear={!!discount}
                                         onClear={() => formContext.setValue('discount', null)}
                                         name="discount"/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3} lg={2}>
                        <CustomTextField fullWidth
                                         disabled={true}
                                         type="number"
                                         id="finalPrice"
                                         label="Ціна зі знижкою, грн"
                                         name="finalPrice"/>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Ages selected={ages} onOptionClick={isAdmin ? onAgeClick : null}></Ages>
                </Grid>

                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12}>
                        <CustomTextField fullWidth
                                         disabled={!isAdmin}
                                         id="description"
                                         label="Опис"
                                         multiline={true}
                                         name="description"/>
                    </Grid>

                    {description && <Grid item xs={12}>
                      <Box mb={1}><b>Попередній огляд опису:</b></Box>
                      <Box dangerouslySetInnerHTML={{ __html: description }}></Box>
                    </Grid>}

                    <Grid item xs={12} sm={6} md={3} lg={2}>
                        <CustomTextField fullWidth
                                         disabled={!isAdmin}
                                         id="tag"
                                         label="Тег"
                                         helperText="Мін. 3 літери"
                                         onKeyDown={addTag}
                                         name="tag"></CustomTextField>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3} lg={2}>
                        <Button fullWidth disabled={!tag} variant="outlined" onClick={() => addTag()}>
                            Додати тег
                        </Button>
                    </Grid>

                    <Grid item xs={12}>
                        {!!tags?.length && <Grid container gap={1} mb={1}>
                            {tags.map(((tag, index) =>
                                <Tag key={index}
                                     tag={tag}
                                     gap={1}
                                     onRemove={isAdmin ? (tag: string) => removeTag(tag) : null}/>))}
                        </Grid>}
                    </Grid>

                    <Grid item xs={12} sm={6} md={3} lg={2}>
                        <CustomTextField fullWidth
                                         disabled={!isAdmin || imageIds.length === 5}
                                         id="imageLink"
                                         label="Посилання на фото"
                                         helperText="Макс. 5 фото"
                                         name="imageLink"/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3} lg={2}>
                        <Button fullWidth variant="outlined" disabled={!imageLink} onClick={parseImage}>
                            Додати фото
                        </Button>
                    </Grid>

                    <Grid item xs={12} display="flex" flexWrap="wrap" gap={1}>
                        {formContext.getValues('imageIds')?.map((imageId, index) =>
                            <Box key={index} mt={1} border={activeImage === imageId ? 3 : 1}
                                 borderColor={primaryLightColor} p={1}
                                 borderRadius={borderRadius}>
                                <Box sx={imageBoxStyles} mb={1} onClick={() => onImageClick(imageId)}>
                                    <CustomImage isBookDetails={true} imageId={imageId}></CustomImage>
                                </Box>
                                <Box display="flex" justifyContent="center" gap={1}>
                                    {index === 0 ? 'Головне фото' : `Додаткове фото ${index}`}
                                    {isAdmin &&
                                      <RemoveCircleOutlineIcon fontSize="small"
                                                               sx={styleVariables.deleteIconBtn}
                                                               onClick={() => removeImage(imageId)}/>}
                                </Box>
                            </Box>)}
                    </Grid>
                </Grid>

            </FormContainer>

            {(creatingError || updatingError) &&
              <ErrorNotification error={creatingError || updatingError}></ErrorNotification>
            }

            {showModalForSeries &&
              <CustomModal open={true} title="Відредагувати одну книгу чи всю серію?">
                <Box textAlign="center" mb={1}>В усій серії буде відредаговано:</Box>
                <Box textAlign="center" mb={2}>формат, опис, теги, вік, авторів.</Box>

                <Box display="flex" gap={1} alignItems="center" justifyContent="center" flexWrap="wrap">
                  <Button variant="contained" onClick={() => onSubmit(true)}>
                    Усю серію
                  </Button>

                  <Button variant="contained" onClick={() => onSubmit()}>
                    Одну книгу
                  </Button>

                  <Button variant="outlined" onClick={() => setShowModalForSeries(false)}>
                    Закрити
                  </Button>
                </Box>
              </CustomModal>}
        </CustomModal>
    );
}
