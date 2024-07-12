import { CoverTypeEntity } from '@/lib/data/types';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { useCreateCoverType, useUpdateCoverType } from '@/lib/graphql/hooks';
import CustomModal from '@/components/modals/custom-modal';
import CustomTextField from '@/components/modals/custom-text-field';
import ErrorNotification from '@/components/error-notification';

interface ICoverTypeModalProps {
    open: boolean,
    item?: CoverTypeEntity,
    isSubmitDisabled?: boolean,
    onClose: (updated?: boolean) => void
}

export default function CoverTypeModal({ open, item, onClose }: ICoverTypeModalProps) {
    const formContext = useForm<{ name: string }>({ defaultValues: { name: item?.name } });
    const { update, updating, updatingError } = useUpdateCoverType();
    const { create, creating, creatingError } = useCreateCoverType();

    async function onSubmit() {
        try {
            if (item) {
                await update({ ...item, ...formContext.getValues() } as CoverTypeEntity);
            } else {
                await create({ ...formContext.getValues() } as CoverTypeEntity);
            }

            onClose(true);
        } catch (err) {}
    }

    return (
        <CustomModal title={!item ? 'Add Cover Type' : 'Edit Cover Type'}
                     open={open}
                     disableBackdropClick={true}
                     onClose={() => onClose()}
                     loading={updating || creating}
                     isSubmitDisabled={!formContext.formState.isValid}
                     onSubmit={onSubmit}>
            <FormContainer onSuccess={() => onSubmit()} formContext={formContext}>
                <CustomTextField fullWidth
                                 required
                                 id="cover-type-name"
                                 label="Name"
                                 name="name"/>
            </FormContainer>

            {(creatingError || updatingError) &&
              <ErrorNotification apolloError={creatingError || updatingError}></ErrorNotification>
            }
        </CustomModal>
    );
}