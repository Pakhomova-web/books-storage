import CustomTextField from '@/components/form-fields/custom-text-field';
import CustomModal from '@/components/modals/custom-modal';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { useUpdateBookNumberInStock } from '@/lib/graphql/hooks';
import { BookEntity } from '@/lib/data/types';
import ErrorNotification from '@/components/error-notification';
import { useAuth } from '@/components/auth-context';

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
        <CustomModal title="Change book number in stock"
                     open={open}
                     disableBackdropClick={true}
                     onClose={() => onClose()}
                     loading={updating}
                     isSubmitDisabled={!formContext.formState.isValid}
                     onSubmit={onSubmit}>
            <FormContainer onSuccess={() => onSubmit()} formContext={formContext}>
                <CustomTextField fullWidth
                                 disabled
                                 id="book-name"
                                 label="Name"
                                 name="name"/>

                <CustomTextField fullWidth
                                 required
                                 autoFocus
                                 type="number"
                                 id="number-in-stock"
                                 label="Received books number"
                                 name="receivedNumber"/>
            </FormContainer>

            {updatingError && <ErrorNotification error={updatingError}></ErrorNotification>}
        </CustomModal>
    );
}