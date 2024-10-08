import { BookEntity, BookSeriesEntity, IBookSeriesFilter, IOption } from '@/lib/data/types';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { useCreateBook, useUpdateBook } from '@/lib/graphql/queries/book/hook';
import CustomModal from '@/components/modals/custom-modal';
import CustomTextField from '@/components/form-fields/custom-text-field';
import CustomSelectField from '@/components/form-fields/custom-select-field';
import { useEffect, useState } from 'react';
import ErrorNotification from '@/components/error-notification';
import { useAuth } from '@/components/auth-context';
import { usePageTypeOptions } from '@/lib/graphql/queries/page-type/hook';
import { useAuthorOptions } from '@/lib/graphql/queries/author/hook';
import { useLanguageOptions } from '@/lib/graphql/queries/language/hooks';
import { useBookTypeOptions } from '@/lib/graphql/queries/book-type/hook';
import { usePublishingHouseOptions } from '@/lib/graphql/queries/publishing-house/hook';
import { useCoverTypeOptions } from '@/lib/graphql/queries/cover-type/hook';
import { getBookSeriesOptions } from '@/lib/data/book-series';

interface IBookModalProps {
    open: boolean,
    item?: BookEntity,
    isSubmitDisabled?: boolean,
    isAdmin?: boolean,
    onClose: (updated?: boolean) => void
}

interface IForm {
    name: string,
    description: string,
    isbn: string,
    format: string,
    numberOfPages: number,
    numberInStock: number,
    price: number,
    coverTypeId: string
    languageId: string
    pageTypeId: string
    bookTypeId: string
    bookSeriesId: string
    authorId?: string
    publishingHouseId?: string
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
            publishingHouseId: item?.bookSeries.publishingHouse.id
        }
    });
    const { publishingHouseId, bookSeriesId } = formContext.watch();
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
        fetchBookSeriesOptions();
    }, [publishingHouseId]);

    async function fetchBookSeriesOptions() {
        if (publishingHouseId) {
            setLoadingBookSeries(true);
            setBookSeriesOptions([]);
            getBookSeriesOptions({ publishingHouse: publishingHouseId } as IBookSeriesFilter)
                .then(options => {
                    setLoadingBookSeries(false);
                    setBookSeriesOptions(options);
                    formContext.setValue('bookSeriesId', bookSeriesId ? options.find(({ id }) => id === bookSeriesId)?.id : null);
                });
        }
    }

    async function onSubmit() {
        const values = formContext.getValues();
        delete values.publishingHouseId;
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
            </FormContainer>

            {(creatingError || updatingError) &&
              <ErrorNotification error={creatingError || updatingError}></ErrorNotification>
            }
        </CustomModal>
    );
}
