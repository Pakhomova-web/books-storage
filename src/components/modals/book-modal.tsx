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
import { customFieldClearBtnStyles, styleVariables } from '@/constants/styles-variables';
import Loading from '@/components/loading';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

interface IBookModalProps {
    open: boolean,
    item?: BookEntity,
    isSubmitDisabled?: boolean,
    isAdmin?: boolean,
    onClose: (updated?: boolean) => void
}

const bookBoxStyles = { height: '150px', maxHeight: '50vw' };

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
    imageIds?: string[],
    imageLink?: string,
    tags?: string[],
    tag?: string
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
            isbn: item?.isbn,
            format: item?.format,
            description: item?.description,
            publishingHouseId: item?.bookSeries.publishingHouse.id,
            imageIds: item?.id ? item.imageIds : null,
            tags: item?.tags
        }
    });
    const { publishingHouseId, bookSeriesId, imageLink, tags, tag } = formContext.watch();
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
    const { checkAuth } = useAuth();

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

    async function onSubmit() {
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
                await update(data);
            } else {
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

    return (
        <CustomModal title={(!item || !item.id ? 'Додати' : (!isAdmin ? 'Подивитися' : 'Відредагувати')) + ' книгу'}
                     open={open}
                     disableBackdropClick={true}
                     onClose={() => onClose()}
                     loading={updating || creating}
                     isSubmitDisabled={!formContext.formState.isValid}
                     onSubmit={isAdmin ? onSubmit : null}>
            <FormContainer formContext={formContext}>
                <CustomTextField fullWidth
                                 required
                                 disabled={!isAdmin}
                                 autoFocus
                                 id="book-name"
                                 label="Назва"
                                 name="name"/>

                <CustomSelectField fullWidth
                                   required
                                   disabled={!isAdmin}
                                   options={bookTypeOptions}
                                   loading={loadingBookTypes}
                                   id="book-type-id"
                                   label="Тип"
                                   name="bookTypeId"/>

                <CustomSelectField fullWidth
                                   required
                                   disabled={!isAdmin}
                                   loading={loadingPublishingHouses}
                                   options={publishingHouseOptions}
                                   id="publishing-house-id"
                                   label="Видавництво"
                                   name="publishingHouseId"/>

                <CustomSelectField fullWidth
                                   required
                                   disabled={!isAdmin || !publishingHouseId}
                                   loading={loadingBookSeries}
                                   options={bookSeriesOptions}
                                   id="book-series-id"
                                   label="Серія"
                                   name="bookSeriesId"/>

                <CustomSelectField fullWidth
                                   required
                                   disabled={!isAdmin}
                                   loading={loadingLanguages}
                                   options={languageOptions}
                                   id="language-id"
                                   label="Мова"
                                   name="languageId"/>

                <CustomSelectField fullWidth
                                   required
                                   disabled={!isAdmin}
                                   loading={loadingPageTypes}
                                   options={pageTypeOptions}
                                   id="page-type-id"
                                   label="Тип сторінок"
                                   name="pageTypeId"/>

                <CustomSelectField fullWidth
                                   required
                                   disabled={!isAdmin}
                                   loading={loadingCoverTypes}
                                   options={coverTypeOptions}
                                   id="cover-type-id"
                                   label="Тип обкладинки"
                                   name="coverTypeId"/>

                <CustomTextField fullWidth
                                 disabled={!isAdmin}
                                 id="description"
                                 label="Опис"
                                 name="description"/>

                <CustomTextField fullWidth
                                 disabled={!isAdmin}
                                 id="isbn"
                                 label="ISBN"
                                 name="isbn"/>

                <CustomTextField fullWidth
                                 disabled={!isAdmin}
                                 id="format"
                                 label="Формат, мм"
                                 name="format"/>

                <CustomTextField fullWidth
                                 required
                                 disabled={!isAdmin}
                                 id="numberOfPages"
                                 type="number"
                                 label="Кількість сторінок"
                                 name="numberOfPages"/>


                <Box sx={styleVariables.positionRelative} mb={1}>
                    <Loading isSmall={true} show={loadingAuthors}></Loading>
                    <MultiSelectElement fullWidth
                                        options={authorOptions}
                                        id="authors"
                                        label="Автори"
                                        name="authorIds" showCheckbox variant="standard"/>
                    <Box sx={customFieldClearBtnStyles} onClick={() => formContext.setValue('authorIds', null)}>
                        Очистити
                    </Box>
                </Box>

                {isAdmin && <CustomTextField fullWidth
                                             id="numberInStock"
                                             disabled={!isAdmin}
                                             type="number"
                                             label="Кількість в наявності"
                                             name="numberInStock"/>}

                <CustomTextField fullWidth
                                 required
                                 disabled={!isAdmin}
                                 type="number"
                                 id="price"
                                 label="Price"
                                 name="price"/>

                <CustomTextField fullWidth
                                 disabled={!isAdmin}
                                 id="tag"
                                 label="Тег"
                                 helperText="Натисність Enter, щоб додати. Мін 3 літери"
                                 onKeyDown={addTag}
                                 name="tag"></CustomTextField>

                {!!tags?.length && <Grid container gap={1} mb={1}>
                    {tags.map(((tag, index) =>
                        <Tag key={index}
                             tag={tag}
                             gap={1}
                             onRemove={isAdmin ? (tag: string) => removeTag(tag) : null}/>))}
                </Grid>}

                <CustomTextField fullWidth
                                 disabled={!isAdmin}
                                 id="imageLink"
                                 label="Посилання на фото"
                                 name="imageLink"/>
                {!!imageLink &&
                  <Button fullWidth variant="outlined" onClick={parseImage}>Додати фото</Button>}

                {formContext.getValues('imageIds')?.map((imageId, index) =>
                    <Box key={index} mt={1}>
                        <Box sx={bookBoxStyles} mb={1}>
                            <CustomImage isBookDetails={true} imageId={imageId}></CustomImage>
                        </Box>
                        <Box display="flex" justifyContent="center" gap={1}>
                            {index === 0 ? 'Головне фото' : 'Додаткове фото'}
                            <RemoveCircleOutlineIcon fontSize="small"
                                                     sx={styleVariables.deleteIconBtn}
                                                     onClick={() => removeImage(imageId)}/></Box>
                    </Box>)}
            </FormContainer>

            {(creatingError || updatingError) &&
              <ErrorNotification error={creatingError || updatingError}></ErrorNotification>
            }
        </CustomModal>
    );
}
