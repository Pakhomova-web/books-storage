import { CoverTypeEntity } from '@/lib/data/types';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { useCreateCoverType, useUpdateCoverType } from '@/lib/graphql/hooks';
import CustomModal from '@/components/modals/custom-modal';
import CustomTextField from '@/components/form-fields/custom-text-field';
import ErrorNotification from '@/components/error-notification';
import { useAuth } from '@/components/auth-context';

interface ICoverTypeModalProps {
    open: boolean,
    item?: CoverTypeEntity,
    isSubmitDisabled?: boolean,
    isAdmin?: boolean,
    onClose: (updated?: boolean) => void
}

export default function CoverTypeModal({ open, item, onClose, isAdmin }: ICoverTypeModalProps) {
    const formContext = useForm<{ name: string }>({ defaultValues: { name: item?.name } });
    const { update, updating, updatingError } = useUpdateCoverType();
    const { create, creating, creatingError } = useCreateCoverType();
    const { checkAuth } = useAuth();

    async function onSubmit() {
        try {
            if (item) {
                await update({ ...item, ...formContext.getValues() } as CoverTypeEntity);
            } else {
                await create({ ...formContext.getValues() } as CoverTypeEntity);
            }

            onClose(true);
        } catch (err) {
            checkAuth(err);
        }
    }

    return (
        <CustomModal title={(!item ? 'Add' : (!isAdmin ? 'View' : 'Edit')) + ' Cover Type'}
                     open={open}
                     disableBackdropClick={true}
                     onClose={() => onClose()}
                     loading={updating || creating}
                     isSubmitDisabled={!formContext.formState.isValid}
                     onSubmit={isAdmin ? onSubmit : null}>
            <FormContainer formContext={formContext}>
                <CustomTextField fullWidth
                                 required
                                 autoFocus
                                 id="cover-type-name"
                                 label="Name"
                                 name="name"/>
            </FormContainer>

            {(creatingError || updatingError) &&
              <ErrorNotification error={creatingError || updatingError}></ErrorNotification>
            }
        </CustomModal>
    );
}