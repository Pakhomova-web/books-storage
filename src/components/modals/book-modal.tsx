import { BookEntity, BookSeriesEntity, IBookSeriesFilter, IOption } from '@/lib/data/types';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { useCreateBook, useUpdateBook } from '@/lib/graphql/queries/book/hook';
import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, GridProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

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
import { styleVariables } from '@/constants/styles-variables';

interface IBookModalProps {
    open: boolean,
    item?: BookEntity,
    isSubmitDisabled?: boolean,
    isAdmin?: boolean,
    onClose: (updated?: boolean) => void
}

const StyledTagGrid = styled(Grid)<GridProps>(({ theme }) => ({
    padding: '3px 6px',
    borderRadius: styleVariables.borderRadius,
    backgroundColor: theme.palette.action.hover,
    display: 'flex',
    alignItems: 'center'
}));

const bookBoxStyles = { height: '150px', maxHeight: '50vw' };

interface IForm {
    name: string,
    description: string,
    isbn: string,
    format: string,
    numberOfPages: number,
    numberInStock: number,
    price: number,
    coverTypeId: string,
    languageId: string,
    pageTypeId: string,
    bookTypeId: string,
    bookSeriesId: string,
    authorId?: string,
    publishingHouseId?: string,
    imageId?: string,
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
            authorId: item?.author?.id,
            languageId: item?.language?.id,
            coverTypeId: item?.coverType.id,
            pageTypeId: item?.pageType.id,
            bookTypeId: item?.bookType.id,
            bookSeriesId: item?.bookSeries.id,
            publishingHouseId: item?.bookSeries.publishingHouse.id,
            imageId: item?.imageId,
            tags: item?.tags
        }
    });
    const { publishingHouseId, bookSeriesId, imageLink, tags, tag } = formContext.watch();
    const { update, updating, updatingError } = useUpdateBook();
    const { create, creating, creatingError } = useCreateBook();
    const { items: pageTypeOptions, loading: loadingPageTypes } = usePageTypeOptions<IOption>();
    const { items: authorOptions, loading: loadingAuthors } = useAuthorOptions<IOption>();
    const { items: languageOptions, loading: loadingLanguages } = useLanguageOptions<IOption>();
    const [bookSeriesOptions, setBookSeriesOptions] = useState<BookSeriesEntity[]>([]);
    const { items: bookTypeOptions, loading: loadingBookTypes } = useBookTypeOptions<IOption>();
    const { items: publishingHouseOptions, loading: loadingPublishingHouses } = usePublishingHouseOptions<IOption>();
    const { items: coverTypeOptions, loading: loadingCoverTypes } = useCoverTypeOptions<IOption>();
    const [loadingBookSeries, setLoadingBookSeries] = useState<boolean>();
    const { checkAuth } = useAuth();

    useEffect(() => {
        if (publishingHouseId) {
            setLoadingBookSeries(true);
            setBookSeriesOptions([]);
            getBookSeriesOptions({ publishingHouse: publishingHouseId } as IBookSeriesFilter)
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
        } as BookEntity;

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
        if (imageLink) {
            // link example: https://drive.google.com/file/d/EXAMPLE_ID/view?usp=drive_link
            try {
                formContext.setValue('imageId', imageLink.split('https://drive.google.com/file/d/')[1].split('/')[0]);
            } catch (err) {
                console.log(err);
            }
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

    function removeTag(tag: string) {
        formContext.setValue('tags', tags.filter(t => t !== tag));
    }

    return (
        <CustomModal title={(!item || !item.id ? 'Add' : (!isAdmin ? 'View' : 'Edit')) + ' Book'}
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
                                 label="Name"
                                 name="name"/>

                <CustomSelectField fullWidth
                                   required
                                   disabled={!isAdmin}
                                   options={bookTypeOptions}
                                   loading={loadingBookTypes}
                                   id="book-type-id"
                                   label="Book Type"
                                   name="bookTypeId"/>

                <CustomSelectField fullWidth
                                   required
                                   disabled={!isAdmin}
                                   loading={loadingPublishingHouses}
                                   options={publishingHouseOptions}
                                   id="publishing-house-id"
                                   label="Publishing House"
                                   name="publishingHouseId"/>

                <CustomSelectField fullWidth
                                   required
                                   disabled={!isAdmin || !publishingHouseId}
                                   loading={loadingBookSeries}
                                   options={bookSeriesOptions}
                                   id="book-series-id"
                                   label="Book Series"
                                   name="bookSeriesId"/>

                <CustomSelectField fullWidth
                                   required
                                   disabled={!isAdmin}
                                   loading={loadingLanguages}
                                   options={languageOptions}
                                   id="language-id"
                                   label="Language"
                                   name="languageId"/>

                <CustomSelectField fullWidth
                                   required
                                   disabled={!isAdmin}
                                   loading={loadingPageTypes}
                                   options={pageTypeOptions}
                                   id="page-type-id"
                                   label="Page Type"
                                   name="pageTypeId"/>

                <CustomSelectField fullWidth
                                   required
                                   disabled={!isAdmin}
                                   loading={loadingCoverTypes}
                                   options={coverTypeOptions}
                                   id="cover-type-id"
                                   label="Cover Type"
                                   name="coverTypeId"/>

                <CustomTextField fullWidth
                                 disabled={!isAdmin}
                                 id="description"
                                 label="Description"
                                 name="description"/>

                <CustomTextField fullWidth
                                 disabled={!isAdmin}
                                 id="isbn"
                                 label="ISBN"
                                 name="isbn"/>

                <CustomTextField fullWidth
                                 disabled={!isAdmin}
                                 id="format"
                                 label="Format"
                                 name="format"/>

                <CustomTextField fullWidth
                                 required
                                 disabled={!isAdmin}
                                 id="numberOfPages"
                                 type="number"
                                 label="Number of Pages"
                                 name="numberOfPages"/>

                <CustomSelectField fullWidth
                                   options={authorOptions}
                                   disabled={!isAdmin}
                                   loading={loadingAuthors}
                                   id="author"
                                   label="Author"
                                   name="authorId"/>

                {isAdmin && <CustomTextField fullWidth
                                             id="numberInStock"
                                             disabled={!isAdmin}
                                             type="number"
                                             label="Number in Stock"
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
                                 label="Tag"
                                 helperText="Click enter to add a tag, 3 chars at least"
                                 onKeyDown={addTag}
                                 name="tag"></CustomTextField>

                {!!tags?.length && <Grid container gap={1}>
                    {tags.map(((tag, index) => (
                        <StyledTagGrid item key={index} gap={1}>
                            #{tag}
                            <RemoveCircleOutlineIcon fontSize="small"
                                                     sx={{ cursor: 'pointer', color: styleVariables.warnColor }}
                                                     onClick={() => removeTag(tag)}/>
                        </StyledTagGrid>
                    )))}
                </Grid>}

                <CustomTextField fullWidth
                                 disabled={!isAdmin}
                                 id="imageLink"
                                 label="Image Link"
                                 name="imageLink"/>
                {!!imageLink &&
                  <Button fullWidth variant="outlined" onClick={parseImage}>Parse image</Button>}

                <CustomTextField fullWidth
                                 disabled={!isAdmin}
                                 id="imageId"
                                 label="Image ID"
                                 name="imageId"/>

                <Box sx={bookBoxStyles} mb={1}>
                    <CustomImage imageId={formContext.getValues('imageId')}></CustomImage>
                </Box>
            </FormContainer>

            {(creatingError || updatingError) &&
              <ErrorNotification error={creatingError || updatingError}></ErrorNotification>
            }
        </CustomModal>
    );
}
