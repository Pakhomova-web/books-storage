import { FormContainer, useForm } from 'react-hook-form-mui';

import { PublishingHouseEntity } from '@/lib/data/types';
import { useCreatePublishingHouse, useUpdatePublishingHouse } from '@/lib/graphql/hooks';
import CustomModal from '@/components/modals/custom-modal';
import CustomTextField from '@/components/form-fields/custom-text-field';
import ErrorNotification from '@/components/error-notification';
import { useAuth } from '@/components/auth-context';

interface IPublishingHouseModalProps {
    open: boolean,
    item?: PublishingHouseEntity,
    isSubmitDisabled?: boolean,
    isAdmin?: boolean,
    onClose: (updated?: boolean) => void
}

export default function PublishingHouseModal({ open, item, onClose, isAdmin }: IPublishingHouseModalProps) {
    const formContext = useForm<PublishingHouseEntity>({
        defaultValues: {
            id: item?.id,
            name: item?.name,
            tags: item?.tags
        }
    });
    const { update, updating, updatingError } = useUpdatePublishingHouse();
    const { create, creating, creatingError } = useCreatePublishingHouse();
    const { checkAuth } = useAuth();

    async function onSubmit() {
        try {
            if (item) {
                await update(formContext.getValues() as PublishingHouseEntity);
            } else {
                await create(formContext.getValues() as PublishingHouseEntity);
            }

            onClose(true);
        } catch (err) {
            checkAuth(err);
        }
    }

    return (
        <CustomModal title={(!item ? 'Add' : (!isAdmin ? 'View' : 'Edit')) + ' Publishing House'}
                     open={open}
                     disableBackdropClick={true}
                     onClose={() => onClose()}
                     loading={updating || creating}
                     isSubmitDisabled={!formContext.formState.isValid}
                     onSubmit={isAdmin ? onSubmit : null}>
            <FormContainer onSuccess={() => onSubmit()} formContext={formContext}>
                <CustomTextField fullWidth
                                 required
                                 autoFocus
                                 id="publishing-house-name"
                                 label="Name"
                                 name="name"/>

                <CustomTextField fullWidth
                                 id="publishing-house-tags"
                                 label="Tags"
                                 name="tags"/>
            </FormContainer>

            {(creatingError || updatingError) &&
              <ErrorNotification error={creatingError || updatingError}></ErrorNotification>
            }
        </CustomModal>
    );
}