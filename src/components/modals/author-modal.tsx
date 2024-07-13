import { AuthorEntity } from '@/lib/data/types';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { useCreateAuthor, useUpdateAuthor } from '@/lib/graphql/hooks';
import CustomModal from '@/components/modals/custom-modal';
import CustomTextField from '@/components/modals/custom-text-field';
import ErrorNotification from '@/components/error-notification';

interface IAuthorModalProps {
    open: boolean,
    item?: AuthorEntity,
    isSubmitDisabled?: boolean,
    onClose: (updated?: boolean) => void
}

export default function AuthorModal({ open, item, onClose }: IAuthorModalProps) {
    const formContext = useForm<AuthorEntity>({
        defaultValues: {
            name: item?.name,
            description: item?.description
        }
    });
    const { update, updating, updatingError } = useUpdateAuthor();
    const { create, creating, creatingError } = useCreateAuthor();

    async function onSubmit() {
        try {
            if (item) {
                await update({ id: item.id, ...formContext.getValues() } as AuthorEntity);
            } else {
                await create({ ...formContext.getValues() } as AuthorEntity);
            }

            onClose(true);
        } catch (err) {}
    }

    return (
        <CustomModal title={!item ? 'Add author' : 'Edit author'}
                     open={open}
                     disableBackdropClick={true}
                     onClose={() => onClose()}
                     loading={updating || creating}
                     isSubmitDisabled={!formContext.formState.isValid}
                     onSubmit={onSubmit}>
            <FormContainer onSuccess={() => onSubmit()} formContext={formContext}>
                <CustomTextField fullWidth
                                 required
                                 id="author-name"
                                 label="Name"
                                 name="name"/>

                <CustomTextField fullWidth
                                 id="description"
                                 label="Description"
                                 name="description"/>
            </FormContainer>

            {(creatingError || updatingError) &&
              <ErrorNotification error={creatingError || updatingError}></ErrorNotification>
            }
        </CustomModal>
    );
}