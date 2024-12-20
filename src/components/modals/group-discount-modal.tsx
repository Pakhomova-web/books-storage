import { BookEntity, GroupDiscountEntity, IOption } from '@/lib/data/types';
import { useForm } from 'react-hook-form-mui';
import CustomModal from '@/components/modals/custom-modal';
import CustomTextField from '@/components/form-fields/custom-text-field';
import ErrorNotification from '@/components/error-notification';
import { useAuth } from '@/components/auth-context';
import { Box, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useCreateGroupDiscount, useUpdateGroupDiscount } from '@/lib/graphql/queries/group-discounts/hook';
import { validateNumberControl } from '@/utils/utils';
import GroupDiscountBox from '@/components/group-discount-box';
import { getBookById, getBookNamesByQuickSearch } from '@/lib/graphql/queries/book/hook';
import CustomLink from '@/components/custom-link';
import Loading from '@/components/loading';

interface IGroupDiscountModalProps {
    item?: GroupDiscountEntity,
    isSubmitDisabled?: boolean,
    isAdmin?: boolean,
    onClose: (updated?: boolean) => void
}

interface IForm {
    bookSearch: string,
    discount: number
}

export default function GroupDiscountModal({ item, onClose, isAdmin }: IGroupDiscountModalProps) {
    const formContext = useForm<IForm>({
        defaultValues: {
            discount: item?.discount || 0
        }
    });
    const [books, setBooks] = useState<BookEntity[]>(item?.books ?? []);
    const [bookOptions, setBookOptions] = useState<IOption<string>[]>([]);
    const [loadingBookOptions, setLoadingBookOptions] = useState<boolean>(false);
    const [loadingBook, setLoadingBook] = useState<boolean>(false);
    const { update, updating, updatingError } = useUpdateGroupDiscount();
    const { create, creating, creatingError } = useCreateGroupDiscount();
    const { checkAuth } = useAuth();
    const { discount, bookSearch } = formContext.watch();

    useEffect(() => {
        validateNumberControl(formContext, discount, 'discount', 1, 99, true, true);
    }, [discount, formContext]);

    useEffect(() => {
        if (bookSearch?.length > 2) {
            setLoadingBookOptions(true);
            getBookNamesByQuickSearch(bookSearch)
                .then(items => {
                    setLoadingBookOptions(false);
                    setBookOptions(items);
                })
                .catch(() => setLoadingBookOptions(false));
        } else {
            setBookOptions([]);
        }
    }, [bookSearch]);

    function onSubmit() {
        let promise;

        if (!!item?.id) {
            promise = update({
                id: item.id,
                discount,
                bookIds: books.map(({ id }) => id)
            } as GroupDiscountEntity);
        } else {
            promise = create({ discount, bookIds: books.map(({ id }) => id) } as GroupDiscountEntity);
        }

        promise.then(() => onClose(true)).catch(err => checkAuth(err));
    }

    function isInvalid() {
        return !formContext.getValues()?.discount || !!formContext.formState.errors.discount || books?.length < 2;
    }

    function onAddBookClick(opt: IOption<string>) {
        if (!books.some(({ id }) => opt.id === id)) {
            setLoadingBook(true);
            getBookById(opt.id).then(book => {
                setBooks([...books, book]);
                setLoadingBook(false);
            }).catch(() => {
                setLoadingBook(false);
            })
        }
        formContext.setValue('bookSearch', '');
        setBookOptions([]);
    }

    function onDeleteBook(bookId: string) {
        setBooks(books.filter(({ id }) => id !== bookId));
    }

    return (
        <CustomModal
            title={(!item || !item.id ? 'Додати' : (!isAdmin ? 'Подивитися' : 'Відредагувати')) + ' групову знижку'}
            open={true}
            disableBackdropClick={true}
            big={true}
            onClose={() => onClose()}
            loading={updating || creating || loadingBook}
            isSubmitDisabled={isInvalid()}
            formContext={formContext}
            onSubmit={isAdmin ? onSubmit : null}>
            <Box pb={1}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4} lg={3} xl={2} pb={1}>
                        <CustomTextField fullWidth name="bookSearch"
                                         id="bookSearch"
                                         label="Пошук книги по назві"
                                         helperText="Введіть як мін. 3 літери"/>
                    </Grid>

                    <Grid item xs={12} md={4} lg={3} xl={2}>
                        <CustomTextField fullWidth
                                         required
                                         type="number"
                                         id="discount"
                                         label="Знижка"
                                         name="discount"/>
                    </Grid>
                </Grid>

                <Box display="flex" flexDirection="column" gap={2} position="relative" mb={1}>
                    <Loading show={loadingBookOptions} isSmall={true}/>
                    {bookOptions.map((book, index) => (
                        <CustomLink key={index} onClick={() => onAddBookClick(book)}>
                            {book.label}{!!book.description ? ` (${book.description})` : ''}
                        </CustomLink>
                    ))}
                </Box>

                <GroupDiscountBox books={books} discount={discount}
                                  onDeleteBook={(bookId: string) => onDeleteBook(bookId)}/>

                {(creatingError || updatingError) &&
                  <ErrorNotification error={creatingError || updatingError}></ErrorNotification>}
            </Box>
        </CustomModal>
    );
}