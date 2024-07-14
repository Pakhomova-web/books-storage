import { FormContainer, useForm } from 'react-hook-form-mui';

import { PublishingHouseEntity } from '@/lib/data/types';
import { useCreatePublishingHouse, useUpdatePublishingHouse } from '@/lib/graphql/hooks';
import CustomModal from '@/components/modals/custom-modal';
import CustomTextField from '@/components/modals/custom-text-field';
import ErrorNotification from '@/components/error-notification';

interface IPublishingHouseModalProps {
    open: boolean,
    item?: PublishingHouseEntity,
    isSubmitDisabled?: boolean,
    onClose: (updated?: boolean) => void
}

export default function PublishingHouseModal({ open, item, onClose }: IPublishingHouseModalProps) {
    const formContext = useForm<PublishingHouseEntity>({
        defaultValues: {
            id: item?.id,
            name: item?.name,
            tags: item?.tags
        }
    });
    const { update, updating, updatingError } = useUpdatePublishingHouse();
    const { create, creating, creatingError } = useCreatePublishingHouse();

    async function onSubmit() {
        try {
            if (item) {
                await update(formContext.getValues() as PublishingHouseEntity);
            } else {
                await create(formContext.getValues() as PublishingHouseEntity);
            }

            onClose(true);
        } catch (err) {
        }
    }

    return (
        <CustomModal title={!item ? 'Add Publishing House' : 'Edit Publishing House'}
                     open={open}
                     disableBackdropClick={true}
                     onClose={() => onClose()}
                     loading={updating || creating}
                     isSubmitDisabled={!formContext.formState.isValid}
                     onSubmit={onSubmit}>
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