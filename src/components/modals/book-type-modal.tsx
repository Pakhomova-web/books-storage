import { BookTypeEntity } from '@/lib/data/types';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { useCreateBookType, useUpdateBookType } from '@/lib/graphql/hooks';
import CustomModal from '@/components/modals/custom-modal';
import CustomTextField from '@/components/modals/custom-text-field';
import ErrorNotification from '@/components/error-notification';

interface IBookTypeModalProps {
    open: boolean,
    item?: BookTypeEntity,
    isSubmitDisabled?: boolean,
    onClose: (updated?: boolean) => void
}

export default function BookTypeModal({ open, item, onClose }: IBookTypeModalProps) {
    const formContext = useForm<{ name: string }>({ defaultValues: { name: item?.name } });
    const { update, updating, updatingError } = useUpdateBookType();
    const { create, creating, creatingError } = useCreateBookType();

    async function onSubmit() {
        try {
            if (item) {
                await update({ ...item, ...formContext.getValues() } as BookTypeEntity);
            } else {
                await create({ ...formContext.getValues() } as BookTypeEntity);
            }

            onClose(true);
        } catch (err) {}
    }

    return (
        <CustomModal title={!item ? 'Add Book Type' : 'Edit Book Type'}
                     open={open}
                     disableBackdropClick={true}
                     onClose={() => onClose()}
                     loading={updating || creating}
                     isSubmitDisabled={!formContext.formState.isValid}
                     onSubmit={onSubmit}>
            <FormContainer onSuccess={() => onSubmit()} formContext={formContext}>
                <CustomTextField fullWidth
                                 required
                                 id="book-type-name"
                                 label="Name"
                                 name="name"/>
            </FormContainer>

            {(creatingError || updatingError) &&
              <ErrorNotification apolloError={creatingError || updatingError}></ErrorNotification>
            }
        </CustomModal>
    );
}