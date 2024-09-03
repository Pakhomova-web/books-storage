import { PageTypeEntity } from '@/lib/data/types';
import { FormContainer, useForm } from 'react-hook-form-mui';
import CustomTextField from '@/components/form-fields/custom-text-field';
import CustomModal from '@/components/modals/custom-modal';
import { useCreatePageType, useUpdatePageType } from '@/lib/graphql/queries/page-type/hook';
import ErrorNotification from '@/components/error-notification';
import { useAuth } from '@/components/auth-context';

interface IPageTypeModalProps {
    open: boolean,
    item?: PageTypeEntity,
    isSubmitDisabled?: boolean,
    isAdmin?: boolean,
    onClose: (updated?: boolean) => void
}

export default function PageTypeModal({ open, item, onClose, isAdmin }: IPageTypeModalProps) {
    const formContext = useForm<{ name: string }>({ defaultValues: { name: item?.name } });
    const { update, updating, updatingError } = useUpdatePageType();
    const { create, creating, creatingError } = useCreatePageType();
    const { checkAuth } = useAuth();

    async function onSubmit() {
        try {
            if (item) {
                await update({ ...item, ...formContext.getValues() } as PageTypeEntity);
            } else {
                await create({ ...formContext.getValues() } as PageTypeEntity);
            }

            onClose(true);
        } catch (err) {
            checkAuth(err);
        }
    }

    return (
        <CustomModal title={(!item ? 'Add' : (!isAdmin ? 'View' : 'Edit')) + ' Page Type'}
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
                                 id="page-type-name"
                                 label="Name"
                                 name="name"/>
            </FormContainer>

            {(creatingError || updatingError) &&
              <ErrorNotification error={creatingError || updatingError}></ErrorNotification>
            }
        </CustomModal>
    );
}