import { BookEntity, BookSeriesEntity } from '@/lib/data/types';
import { FormContainer, useForm } from 'react-hook-form-mui';
import {
    getBookSeriesOptions,
    useAuthorOptions, useBookTypeOptions,
    useCoverTypeOptions,
    useCreateBook,
    useLanguageOptions,
    usePageTypeOptions,
    usePublishingHouseOptions,
    useUpdateBook
} from '@/lib/graphql/hooks';
import CustomModal from '@/components/modals/custom-modal';
import CustomTextField from '@/components/modals/custom-text-field';
import CustomSelectField from '@/components/modals/custom-select-field';
import { useEffect, useState } from 'react';
import ErrorNotification from '@/components/error-notification';

interface IBookModalProps {
    open: boolean,
    item?: BookEntity,
    isSubmitDisabled?: boolean,
    onClose: (updated?: boolean) => void
}

interface IForm extends BookEntity {
    name: string,
    publishingHouseId?: string
}

export default function BookModal({ open, item, onClose }: IBookModalProps) {
    const formContext = useForm<IForm>({
        defaultValues: {
            name: item?.name,
            bookTypeId: item?.bookTypeId,
            publishingHouseId: item?.bookSeries?.publishingHouse.id,
            bookSeriesId: item?.bookSeriesId,
            languageId: item?.languageId,
            pageTypeId: item?.pageTypeId,
            authorId: item?.authorId,
            coverTypeId: item?.coverTypeId,
            price: item?.price,
            format: item?.format,
            description: item?.description,
            isbn: item?.coverTypeId,
            numberInStock: item?.numberInStock,
            numberOfPages: item?.numberOfPages
        }
    });
    const { publishingHouseId } = formContext.watch();
    const { update, updating, updatingError } = useUpdateBook();
    const { create, creating, creatingError } = useCreateBook();
    const { items: pageTypeOptions } = usePageTypeOptions();
    const { items: authorOptions } = useAuthorOptions();
    const { items: languageOptions } = useLanguageOptions();
    const [bookSeriesOptions, setBookSeriesOptions] = useState<BookSeriesEntity[]>([]);
    const { items: bookTypeOptions } = useBookTypeOptions();
    const { items: publishingHouseOptions } = usePublishingHouseOptions();
    const { items: coverTypeOptions } = useCoverTypeOptions();

    useEffect(() => {
        if (publishingHouseId) {
            setBookSeriesOptions([]);
            getBookSeriesOptions({ publishingHouseId } as BookSeriesEntity)
                .then(options => {
                    setBookSeriesOptions(options);
                    formContext.setValue('bookSeriesId', options.find(opt => opt.id === formContext.getValues().bookSeriesId)?.id);
                });
        }
    }, [publishingHouseId]);

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
            if (item) {
                await update(data);
            } else {
                await create(data);
            }
            onClose(true);
        } catch {
        }
    }

    return (
        <CustomModal title={!item ? 'Add Book' : 'Edit Book'}
                     open={open}
                     disableBackdropClick={true}
                     onClose={() => onClose()}
                     loading={updating || creating}
                     isSubmitDisabled={!formContext.formState.isValid}
                     onSubmit={onSubmit}>
            <FormContainer onSuccess={() => onSubmit()} formContext={formContext}>
                <CustomSelectField fullWidth
                                   required
                                   options={bookTypeOptions}
                                   id="book-type-id"
                                   label="Book Type"
                                   name="bookTypeId"/>

                <CustomTextField fullWidth
                                 required
                                 id="book-name"
                                 label="Name"
                                 name="name"/>

                <CustomSelectField fullWidth
                                   required
                                   options={publishingHouseOptions}
                                   id="publishing-house-id"
                                   label="Publishing House"
                                   name="publishingHouseId"/>

                <CustomSelectField fullWidth
                                   required
                                   disabled={!publishingHouseId}
                                   options={bookSeriesOptions}
                                   id="book-series-id"
                                   label="Book Series"
                                   name="bookSeriesId"/>

                <CustomSelectField fullWidth
                                   required
                                   options={languageOptions}
                                   id="language-id"
                                   label="Language"
                                   name="languageId"/>

                <CustomSelectField fullWidth
                                   required
                                   options={pageTypeOptions}
                                   id="page-type-id"
                                   label="Page Type"
                                   name="pageTypeId"/>

                <CustomSelectField fullWidth
                                   required
                                   options={coverTypeOptions}
                                   id="cover-type-id"
                                   label="Cover Type"
                                   name="coverTypeId"/>

                <CustomTextField fullWidth
                                 id="description"
                                 label="Description"
                                 name="description"/>

                <CustomTextField fullWidth
                                 id="isbn"
                                 label="ISBN"
                                 name="isbn"/>

                <CustomTextField fullWidth
                                 id="format"
                                 label="Format"
                                 name="format"/>

                <CustomTextField fullWidth
                                 required
                                 id="numberOfPages"
                                 type="number"
                                 label="Number of Pages"
                                 name="numberOfPages"/>

                <CustomSelectField fullWidth
                                   options={authorOptions}
                                   id="author"
                                   label="Author"
                                   name="authorId"/>

                <CustomTextField fullWidth
                                 id="numberInStock"
                                 type="number"
                                 label="Number in Stock"
                                 name="numberInStock"/>

                <CustomTextField fullWidth
                                 required
                                 type="number"
                                 id="price"
                                 label="Price"
                                 name="price"/>
            </FormContainer>

            {(creatingError || updatingError) &&
              <ErrorNotification apolloError={creatingError || updatingError}></ErrorNotification>
            }
        </CustomModal>
    );
}
