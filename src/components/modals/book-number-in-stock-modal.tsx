import { useForm } from 'react-hook-form-mui';
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';

import CustomTextField from '@/components/form-fields/custom-text-field';
import CustomModal from '@/components/modals/custom-modal';
import { getBookNamesByQuickSearch, useUpdateBookNumberInStock } from '@/lib/graphql/queries/book/hook';
import ErrorNotification from '@/components/error-notification';
import { IOption } from '@/lib/data/types';
import Loading from '@/components/loading';
import { StyledHintBox } from '@/constants/styles-variables';

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
    const { nameSearch } = formContext.watch();
    const [bookOpts, setBookOpts] = useState<IOption<string>[]>([]);
    const [loadingHints, setLoadingHints] = useState<boolean>(false);

    useEffect(() => {
        if (!!nameSearch) {
            if (nameSearch.length > 3) {
                setLoadingHints(true);
                getBookNamesByQuickSearch(nameSearch)
                    .then(hints => {
                        setLoadingHints(false);
                        setBookOpts(hints);
                    });
            }
        } else {
            setBookOpts([]);
        }
    }, [nameSearch]);

    async function onSubmit() {
        const { receivedNumber, purchasePrice, book } = formContext.getValues();

        update({ id: book.id, receivedNumber: receivedNumber, purchasePrice })
            .then(() => {
                onClose(true);
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
                <CustomTextField label="Пошук книги"
                                 fullWidth
                                 autoFocus={true}
                                 helperText="Введіть мін. 3 літери"
                                 name="nameSearch"/>

                <Box position="relative" p={1}>
                    <Loading show={loadingHints} isSmall={true}/>

                    {bookOpts?.map((opt, i) => (
                        <StyledHintBox key={i} mb={1}
                                       onClick={() => {
                                           formContext.setValue('book', opt);
                                           formContext.setValue('name', opt.label);
                                           setBookOpts([]);
                                           formContext.setValue('nameSearch', '');
                                       }}>
                            {opt.label}
                        </StyledHintBox>
                    ))}
                </Box>

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