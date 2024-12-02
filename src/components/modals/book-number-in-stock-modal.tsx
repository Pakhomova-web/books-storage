import CustomTextField from '@/components/form-fields/custom-text-field';
import CustomModal from '@/components/modals/custom-modal';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { useUpdateBookNumberInStock } from '@/lib/graphql/queries/book/hook';
import { BookEntity } from '@/lib/data/types';
import ErrorNotification from '@/components/error-notification';
import { useAuth } from '@/components/auth-context';
import { Box } from '@mui/material';

interface IForm {
    name: string,
    receivedNumber: number
}

interface IProps {
    item: BookEntity,
    open: boolean,
    onClose: Function
}

export function BookNumberInStockModal({ item, open, onClose }: IProps) {
    const formContext = useForm<IForm>({
        defaultValues: {
            name: item?.name
        }
    });
    const { updating, update, updatingError } = useUpdateBookNumberInStock();
    const { checkAuth } = useAuth();

    async function onSubmit() {
        try {
            await update({ id: item.id, numberInStock: item.numberInStock + formContext.getValues().receivedNumber });
            onClose(true);
        }  catch (err) {
            checkAuth(err);
        }
    }

    return (
        <CustomModal title="Змінити кількість в наявності"
                     open={open}
                     disableBackdropClick={true}
                     onClose={() => onClose()}
                     loading={updating}
                     formContext={formContext}
                     isSubmitDisabled={!formContext.formState.isValid}
                     onSubmit={onSubmit}>
            <Box gap={2} display="flex" flexDirection="column">
                <CustomTextField fullWidth
                                 disabled
                                 id="book-name"
                                 label="Назва книги"
                                 name="name"/>

                <CustomTextField fullWidth
                                 required
                                 autoFocus={true}
                                 type="number"
                                 id="number-in-stock"
                                 label="Отримана кількість книг"
                                 name="receivedNumber"/>
            </Box>

            {updatingError && <ErrorNotification error={updatingError}></ErrorNotification>}
        </CustomModal>
    );
}