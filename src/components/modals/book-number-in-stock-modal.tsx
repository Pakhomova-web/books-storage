import { useForm } from 'react-hook-form-mui';
import React, { useState } from 'react';
import { Box, Grid, IconButton } from '@mui/material';

import CustomTextField from '@/components/form-fields/custom-text-field';
import CustomModal from '@/components/modals/custom-modal';
import { useUpdateBookNumberInStock } from '@/lib/graphql/queries/book/hook';
import ErrorNotification from '@/components/error-notification';
import BookSearchAutocompleteField from '@/components/form-fields/book-search-autocomplete-field';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { styleVariables } from '@/constants/styles-variables';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ClearIcon from '@mui/icons-material/Clear';

interface IForm {
    nameSearch: string,
    purchasePrice: number
}

interface IProps {
    open: boolean,
    onClose: Function
}

export function BookNumberInStockModal({ open, onClose }: IProps) {
    const formContext = useForm<IForm>();
    const { updating, update, updatingError } = useUpdateBookNumberInStock();
    const [books, setBooks] = useState<Map<string, { name: string, receivedNumber: number }>>(new Map());
    const { purchasePrice } = formContext.watch();

    function onSubmit() {
        const { purchasePrice } = formContext.getValues();

        update({
            books: books.entries().toArray()
                .map(([id, { receivedNumber }]) => ({ id, receivedNumber })),
            purchasePrice
        })
            .then(() => onClose(true))
            .catch(() => {
            });
    }

    function onCountChange(bookId: string, number: number) {
        const book = books.get(bookId);

        setBooks(map => new Map(map.set(bookId, { ...book, receivedNumber: book.receivedNumber + number })));
    }

    function onRemoveBook(bookId: string) {
        setBooks(map => {
            map.delete(bookId);

            return new Map(map);
        });
    }

    return (
        <CustomModal title="Поповнити наявність книг"
                     open={open}
                     big={true}
                     disableBackdropClick={true}
                     onClose={() => onClose()}
                     loading={updating}
                     formContext={formContext}
                     isSubmitDisabled={!purchasePrice || books.size === 0}
                     onSubmit={onSubmit}>
            <Box gap={2} display="flex" flexDirection="column">
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <BookSearchAutocompleteField onSelect={book => {
                            if (!!book && !books.get(book.id)) {
                                setBooks(map => new Map(map.set(book.id, { name: book.label, receivedNumber: 1 })));
                            }
                        }}/>
                    </Grid>
                </Grid>

                {[...(books.entries()?.toArray() || [])].map(([id, book], index) => (
                    <Grid container spacing={1} key={index} display="flex" alignItems="center">
                        <Grid item xs={6} lg={3} display="flex" gap={1} alignItems="center"
                              justifyContent={{ xs: 'center', sm: 'flex-start' }}>
                            <IconButton disabled={!book.receivedNumber}
                                        onClick={() => onRemoveBook(id)}>
                                <ClearIcon color="warning"/>
                            </IconButton>

                            {book.name}
                        </Grid>

                        <Grid item xs={6} lg={4} gap={1} display="flex" flexDirection="row"
                              alignItems="center" justifyContent={{ xs: 'center', sm: 'flex-start' }}>
                            <Grid item>
                                <IconButton disabled={!book.receivedNumber}
                                            onClick={() => onCountChange(id, -1)}>
                                    <RemoveCircleOutlineIcon/>
                                </IconButton>
                            </Grid>

                            <Grid item sx={styleVariables.titleFontSize}>{book.receivedNumber}</Grid>

                            <Grid item>
                                <IconButton onClick={() => onCountChange(id, 1)}>
                                    <AddCircleOutlineIcon/>
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Grid>
                ))}

                <Grid container spacing={1} display="flex" justifyContent="center">
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <CustomTextField fullWidth
                                         required
                                         type="number"
                                         id="purchase-price"
                                         label="Кінцева сума закупки"
                                         name="purchasePrice"/>
                    </Grid>
                </Grid>
            </Box>

            {updatingError && <ErrorNotification error={updatingError}></ErrorNotification>}
        </CustomModal>
    );
}