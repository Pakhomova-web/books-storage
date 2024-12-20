import { useForm } from 'react-hook-form-mui';
import React from 'react';
import { Box } from '@mui/material';

import CustomTextField from '@/components/form-fields/custom-text-field';
import CustomModal from '@/components/modals/custom-modal';
import { useUpdateBookNumberInStock } from '@/lib/graphql/queries/book/hook';
import ErrorNotification from '@/components/error-notification';
import { IOption } from '@/lib/data/types';
import BookSearchAutocompleteField from '@/components/form-fields/book-search-autocomplete-field';

interface IForm {
    book: IOption<string>,
    nameSearch: string,
    name: string,
    receivedNumber: number,
    purchasePrice: number
}

interface IProps {
    open: boolean,
    onClose: Function
}

export function BookNumberInStockModal({ open, onClose }: IProps) {
    const formContext = useForm<IForm>();
    const { updating, update, updatingError } = useUpdateBookNumberInStock();

    function onSubmit() {
        const { receivedNumber, purchasePrice, book } = formContext.getValues();

        update({ id: book.id, receivedNumber: receivedNumber, purchasePrice })
            .then(() => onClose(true))
            .catch(() => {
            });
    }

    return (
        <CustomModal title="Поповнити наявність книги"
                     open={open}
                     disableBackdropClick={true}
                     onClose={() => onClose()}
                     loading={updating}
                     formContext={formContext}
                     isSubmitDisabled={!formContext.formState.isValid}
                     onSubmit={onSubmit}>
            <Box gap={2} display="flex" flexDirection="column">
                <BookSearchAutocompleteField onSelect={val => {
                    formContext.setValue('book', val);
                    formContext.setValue('name', val.label);
                }}/>

                <CustomTextField fullWidth
                                 disabled
                                 id="book-name"
                                 label="Назва книги"
                                 name="name"/>

                <CustomTextField fullWidth
                                 required
                                 type="number"
                                 id="number-in-stock"
                                 label="Отримана кількість книг"
                                 name="receivedNumber"/>

                <CustomTextField fullWidth
                                 required
                                 type="number"
                                 id="purchase-price"
                                 label="Ціна закупки"
                                 name="purchasePrice"/>
            </Box>

            {updatingError && <ErrorNotification error={updatingError}></ErrorNotification>}
        </CustomModal>
    );
}