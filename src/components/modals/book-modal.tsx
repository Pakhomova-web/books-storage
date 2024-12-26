import { AuthorEntity, BookEntity, BookSeriesEntity, BookSeriesFilter, IOption } from '@/lib/data/types';
import { MultiSelectElement, useForm } from 'react-hook-form-mui';
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
import { parseImageFromLink, trimValues } from '@/utils/utils';
import {
    borderRadius,
    customFieldClearBtnStyles,
    primaryLightColor,
    styleVariables
} from '@/constants/styles-variables';
import Loading from '@/components/loading';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Ages from '@/components/ages';
import CustomMultipleAutocompleteField from '@/components/form-fields/custom-multiple-autocomplete-field';
import CustomAutocompleteField from '@/components/form-fields/custom-autocomplete-field';
import AuthorModal from '@/components/modals/author-modal';
import BookSeriesModal from '@/components/modals/book-series-modal';
import { ApolloError } from '@apollo/client';
import CustomLink from '@/components/custom-link';
import BookSearchAutocompleteField from '@/components/form-fields/book-search-autocomplete-field';

interface IBookModalProps {
    open: boolean,
    item?: BookEntity,
    isSubmitDisabled?: boolean,
    isAdmin?: boolean,
    onClose: (updated?: boolean, bookSeriesId?: string) => void
}

const imageBoxStyles = { height: '150px', maxHeight: '50vw', cursor: 'pointer' };

interface IForm {
    name: string,
    description: string,
    isbn: string,
    format: string,
    numberOfPages: number,
    purchasePrice: number,
    numberInStock: number,
    price: number,
    authorIds: string[],
    illustratorIds: string[],
    coverTypeId: string,
    languageIds: string[],
    pageTypeId: string,
    bookTypeIds: string[],
    bookSeriesId: string,
    publishingHouseId?: string,
    imageIds: string[],
    imageLinks: string,
    tags: string[],
    tag: string,
    ages: number[],
    discount: number,
    finalPrice: number,
    languageBookIds: string[]
}

export default function BookModal({ open, item, onClose, isAdmin }: IBookModalProps) {
    const formContext = useForm<IForm>({
        defaultValues: {
            name: item?.name,
            numberOfPages: item?.numberOfPages,
            numberInStock: item?.numberInStock,
            price: item?.price,
            authorIds: item?.authors?.map(({ id }) => id),
            illustratorIds: item?.illustrators?.map(({ id }) => id),
            languageIds: item?.languages?.map(({ id }) => id),
            coverTypeId: item?.coverType?.id,
            pageTypeId: item?.pageType?.id,
            bookTypeIds: item?.bookTypes?.map(({ id }) => id),
            bookSeriesId: item?.bookSeries?.id,
            isbn: item?.id ? item?.isbn : null,
            format: item?.format,
            description: item?.description,
            publishingHouseId: item?.bookSeries?.publishingHouse?.id,
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
        imageLinks,
        imageIds,
        tags,
        tag,
        description,
        ages,
        authorIds,
        languageIds,
        bookTypeIds,
        illustratorIds,
        discount,
        price
    } = formContext.watch();
    const [bookSeries, setBookSeries] = useState<IOption<string>>(item?.bookSeries ? {
        id: item.bookSeries.id,
        label: item.bookSeries.name,
        fullDescription: item.bookSeries.description
    } : null);
    const { update, updating, updatingError } = useUpdateBook();
    const { create, creating, creatingError } = useCreateBook();
    const { items: pageTypeOptions, loading: loadingPageTypes } = usePageTypeOptions();
    const { items: authorOptions, loading: loadingAuthors, refetch } = useAuthorOptions();
    const { items: languageOptions, loading: loadingLanguages } = useLanguageOptions();
    const [bookSeriesOptions, setBookSeriesOptions] = useState<IOption<string>[]>([]);
    const { items: bookTypeOptions, loading: loadingBookTypes } = useBookTypeOptions();
    const { items: publishingHouseOptions, loading: loadingPublishingHouses } = usePublishingHouseOptions();
    const { items: coverTypeOptions, loading: loadingCoverTypes } = useCoverTypeOptions();
    const [loadingBookSeries, setLoadingBookSeries] = useState<boolean>();
    const [showModalForSeries, setShowModalForSeries] = useState<boolean>();
    const { checkAuth } = useAuth();
    const [activeImage, setActiveImage] = useState<string>();
    const [authorModalValue, setAuthorModalValue] = useState<AuthorEntity>();
    const [bookSeriesModalValue, setBookSeriesModalValue] = useState<BookSeriesEntity>();
    const [loadingAuthorOptions, setLoadingAuthorOptions] = useState<boolean>();
    const [showModalWithNoNumberInStock, setShowModalWithNoNumberInStock] = useState<boolean>(false);
    const [languageBooks, setLanguageBooks] = useState<IOption<string>[]>(item.languageBooks?.map(b => ({
        id: b.id,
        label: b.name,
        description: `${b.bookSeries.publishingHouse.name}, ${b.bookSeries.name}`
    })) || []);

    useEffect(() => {
        if (publishingHouseId) {
            fetchBookSeriesOptions(bookSeriesId);
        }
    }, [publishingHouseId]);

    function fetchBookSeriesOptions(id: string) {
        setLoadingBookSeries(true);
        setBookSeriesOptions([]);
        getBookSeriesOptions({ publishingHouse: publishingHouseId } as BookSeriesFilter)
            .then(options => {
                setLoadingBookSeries(false);
                setBookSeriesOptions(options);
                if (bookSeriesId) {
                    setBookSeries(options.find(opt => opt.id === bookSeriesId));
                }
                formContext.setValue('bookSeriesId', id ? options.find(opt => opt.id === id)?.id : null);
            })
            .catch(() => {
                setLoadingBookSeries(false);
            });
    }

    useEffect(() => {
        setBookSeries(bookSeriesId ? bookSeriesOptions.find(bS => bS.id === bookSeriesId) : null);
    }, [bookSeriesId]);

    useEffect(() => {
        formContext.setValue('finalPrice', +(price * (100 - (discount || 0)) / 100).toFixed(2));
    }, [formContext, discount, price]);

    async function onSubmit(submit = true, updateAllBooksInSeries = false) {
        if (!isFormValid()) {
            return;
        }
        if (!submit && !!item?.id && !item?.bookSeries.default) {
            setShowModalForSeries(true);
            return;
        }
        if (!submit && !item?.id && !formContext.getValues().numberInStock) {
            setShowModalWithNoNumberInStock(true);
            return;
        } else if (submit) {
            setShowModalWithNoNumberInStock(false);
        }

        setShowModalForSeries(false);
        parseImage();
        const { imageLinks, ...values } = trimValues(formContext.getValues());

        delete values.publishingHouseId;
        delete values.tag;
        const data = {
            id: item?.id,
            ...values,
            price: Number(values.price),
            discount: Number(values.discount),
            numberOfPages: Number(values.numberOfPages),
            numberInStock: values.numberInStock ? Number(values.numberInStock) : 0,
            purchasePrice: values.purchasePrice ? Number(values.purchasePrice) : 0,
            languageBookIds: languageBooks.map(b => b.id)
        };
        if (data.id) {
            delete data.purchasePrice;
        }

        if (item?.id) {
            update(data, updateAllBooksInSeries)
                .then(() => onClose(true))
                .catch((err: ApolloError) => checkAuth(err));
        } else {
            delete data.id;
            create(data)
                .then(() => onClose(true, data.bookSeriesId))
                .catch((err: ApolloError) => checkAuth(err));
        }
    }

    function parseImage(e?) {
        if (!e || e.key === 'Enter') {
            e?.preventDefault()
            e?.stopPropagation();

            if (imageLinks) {
                imageLinks.replaceAll(' ', '').split(',').forEach(imageLink => {
                    const id = parseImageFromLink(imageLink);

                    if (id) {
                        const imageIds = formContext.getValues().imageIds || [];

                        if (!imageIds.some(imageId => id === imageId)) {
                            formContext.setValue('imageIds', [...imageIds, id]);
                        }
                        formContext.setValue('imageLinks', null);
                    }
                });
            }
        }
    }

    function addTag(e?) {
        if (!e || e.key === 'Enter') {
            e?.preventDefault()
            e?.stopPropagation();
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

    function isFormValid() {
        const {
            name,
            pageTypeId,
            coverTypeId,
            bookTypeIds,
            price,
            numberOfPages,
            languageIds
        } = trimValues(formContext.getValues());

        return !!name && !!numberOfPages && !!bookTypeIds?.length && !!bookSeriesId && !!price && !!pageTypeId && !!coverTypeId && languageIds;
    }

    function onAddBookSeries(value: string) {
        setBookSeriesModalValue({ name: value, publishingHouse: { id: publishingHouseId } } as BookSeriesEntity);
    }

    function onAddAuthor(value: string) {
        setAuthorModalValue({ name: value } as AuthorEntity);
    }

    function refreshAuthorOptions(updated: boolean) {
        setAuthorModalValue(null);
        if (updated) {
            setLoadingAuthorOptions(true);
            refetch().then(() => {
                setLoadingAuthorOptions(false);
            });
        }
    }

    function refreshBookSeriesOptions(item: BookSeriesEntity) {
        setBookSeriesModalValue(null);
        if (item) {
            fetchBookSeriesOptions(item.id);
        }
    }

    function onLanguageBookClick(opt: IOption<string>, removeIfAdded = true) {
        if (languageBooks?.some(({ id }) => id === opt.id)) {
            if (removeIfAdded) {
                setLanguageBooks(languageBooks.filter(({ id }) => id !== opt.id));
            }
        } else {
            setLanguageBooks([...(languageBooks || []), opt]);
        }
    }

    return (
        <CustomModal title={(!item || !item.id ? 'Додати' : (!isAdmin ? 'Подивитися' : 'Відредагувати')) + ' книгу'}
                     open={open}
                     disableBackdropClick={true}
                     big={true}
                     formContext={formContext}
                     onClose={() => onClose()}
                     loading={updating || creating}
                     isSubmitDisabled={!isFormValid()}
                     onSubmit={isAdmin ? () => onSubmit(false) : null}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} lg={4}>
                    <CustomTextField fullWidth
                                     required
                                     disabled={!isAdmin}
                                     autoFocus={true}
                                     id="book-name"
                                     label="Назва"
                                     name="name"/>
                </Grid>

                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <Box position="relative" mb={1}>
                        <Loading isSmall={true} show={loadingBookTypes}></Loading>
                        <MultiSelectElement fullWidth
                                            options={bookTypeOptions}
                                            id="bookTypes"
                                            label="Типи"
                                            name="bookTypeIds" showCheckbox variant="outlined"/>
                        {isAdmin && !!bookTypeIds?.length &&
                          <Box sx={customFieldClearBtnStyles}
                               onClick={() => formContext.setValue('bookTypeIds', null)}>
                            Очистити
                          </Box>}
                    </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <CustomAutocompleteField options={publishingHouseOptions}
                                             label="Видавництво"
                                             required
                                             disabled={!isAdmin}
                                             loading={loadingPublishingHouses}
                                             selected={!loadingPublishingHouses ? publishingHouseId : null}
                                             onChange={(value: IOption<string>) => formContext.setValue('publishingHouseId', value?.id)}/>
                </Grid>

                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <CustomAutocompleteField options={bookSeriesOptions}
                                             label="Серія"
                                             required
                                             onAdd={(value: string) => onAddBookSeries(value)}
                                             disabled={!isAdmin || !publishingHouseId}
                                             loading={loadingBookSeries}
                                             selected={bookSeriesId}
                                             onChange={(value: IOption<string>) => formContext.setValue('bookSeriesId', value?.id)}/>
                </Grid>

                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <CustomMultipleAutocompleteField required
                                                     disabled={!isAdmin}
                                                     loading={loadingLanguages}
                                                     options={languageOptions}
                                                     selected={languageIds}
                                                     label="Мови"
                                                     onChange={(values: IOption<string>[]) => formContext.setValue('languageIds', values?.map(v => v.id))}/>
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
                                       label="Обкладинка"
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

                {isAdmin &&
                  <Grid item xs={12} sm={6} md={3} lg={2}>
                    <CustomTextField fullWidth
                                     id="numberInStock"
                                     type="number"
                                     label="Кількість в наявності"
                                     name="numberInStock"/>
                  </Grid>}

                {isAdmin && !item?.id &&
                  <Grid item xs={12} sm={6} md={3} lg={2}>
                    <CustomTextField fullWidth
                                     type="number"
                                     id="purchase-price"
                                     label="Ціна закупки"
                                     name="purchasePrice"/>
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

                <Grid item xs={12} md={6} lg={4}>
                    <CustomMultipleAutocompleteField options={authorOptions}
                                                     label="Автори"
                                                     onAdd={(value: string) => onAddAuthor(value)}
                                                     disabled={!isAdmin}
                                                     showClear={!!authorIds?.length}
                                                     onClear={() => formContext.setValue('authorIds', [])}
                                                     loading={loadingAuthors || loadingAuthorOptions}
                                                     selected={authorIds}
                                                     onChange={(values: IOption<string>[]) => formContext.setValue('authorIds', values.map(v => v.id))}/>
                </Grid>

                <Grid item xs={12} md={6} lg={4}>
                    <CustomMultipleAutocompleteField options={authorOptions}
                                                     label="Іллюстратори"
                                                     onAdd={(value: string) => onAddAuthor(value)}
                                                     disabled={!isAdmin}
                                                     showClear={!!illustratorIds?.length}
                                                     onClear={() => formContext.setValue('illustratorIds', [])}
                                                     loading={loadingAuthors || loadingAuthorOptions}
                                                     selected={illustratorIds}
                                                     onChange={(values: IOption<string>[]) => formContext.setValue('illustratorIds', values.map(v => v.id))}/>
                </Grid>

                <Grid item xs={12}>
                    <Ages selected={ages} onOptionClick={isAdmin ? onAgeClick : null}></Ages>
                </Grid>

                {!!bookSeries?.fullDescription &&
                  <Grid item xs={12}>
                    <Box mb={1}><b>Опис серії:</b></Box>
                    <Box dangerouslySetInnerHTML={{ __html: bookSeries.fullDescription }}></Box>
                  </Grid>}

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

                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <CustomTextField fullWidth
                                     disabled={!isAdmin}
                                     id="tag"
                                     label="Тег"
                                     helperText="Мін. 3 літери"
                                     onKeyDown={addTag}
                                     name="tag"></CustomTextField>
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Button fullWidth disabled={!tag} variant="outlined" onClick={() => addTag()}>
                        Додати тег
                    </Button>
                </Grid>

                <Grid item xs={12}>
                    {!!tags?.length && <Grid container gap={1} mb={1}>
                        {tags.map(((tag, index) =>
                            <Tag key={index}
                                 tag={tag}
                                 onRemove={isAdmin ? (tag: string) => removeTag(tag) : null}/>))}
                    </Grid>}
                </Grid>

                <Grid item xs={12} sm={8} md={6} lg={4}>
                    <CustomTextField fullWidth
                                     disabled={!isAdmin || imageIds?.length === 5}
                                     id="imageLinks"
                                     label="Посилання на фото"
                                     onKeyDown={parseImage}
                                     helperText="Макс. 5 фото, розділені через кому"
                                     name="imageLinks"/>
                </Grid>

                <Grid item xs={12} sm={4} md={3} lg={2}>
                    <Button fullWidth variant="outlined" disabled={!imageLinks} onClick={() => parseImage()}>
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

                <Grid item xs={12} md={4}>
                    <BookSearchAutocompleteField onSelect={(val: IOption<string>) => onLanguageBookClick(val)}/>
                </Grid>

                <Grid item xs={12}>
                    {!!languageBooks?.length &&
                      <Box display="flex" flexDirection="column" gap={2} position="relative" mb={1}>
                        <Box sx={styleVariables.sectionTitle}>Книжки іншою мовою, натисніть, щоб видалити</Box>
                          {languageBooks.map((book, index) => (
                              <CustomLink key={index} onClick={() => onLanguageBookClick(book)}>
                                  {book.label}{!!book.description ? ` (${book.description})` : ''}
                              </CustomLink>
                          ))}
                      </Box>}
                </Grid>
            </Grid>

            {(creatingError || updatingError) &&
              <ErrorNotification error={creatingError || updatingError}></ErrorNotification>
            }

            {showModalWithNoNumberInStock &&
              <CustomModal open={true} title="В формі не вказана кількість в наявності. Продовжити?"
                           onSubmit={() => onSubmit(true)}
                           onClose={() => setShowModalWithNoNumberInStock(false)}>
              </CustomModal>}

            {showModalForSeries &&
              <CustomModal open={true} title="Відредагувати одну книгу чи всю серію?"
                           onClose={() => setShowModalForSeries(false)}>
                <Box textAlign="center" mb={1}>В усій серії буде відредаговано:</Box>
                <Box textAlign="center" mb={2}>формат, вік.</Box>

                <Box display="flex" gap={1} alignItems="center" justifyContent="center" flexWrap="wrap">
                  <Button variant="contained" onClick={() => onSubmit(true, true)}>
                    Усю серію
                  </Button>

                  <Button variant="contained" onClick={() => onSubmit()}>
                    Одну книгу
                  </Button>
                </Box>
              </CustomModal>}

            {!!authorModalValue &&
              <AuthorModal open={true} onClose={(updated = false) => refreshAuthorOptions(updated)}
                           item={authorModalValue} isAdmin={true}/>}

            {!!bookSeriesModalValue &&
              <BookSeriesModal open={true} onClose={(item?: BookSeriesEntity) => refreshBookSeriesOptions(item)}
                               item={bookSeriesModalValue} isAdmin={true}/>}
        </CustomModal>
    );
}
