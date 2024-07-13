import { LanguageEntity, PageTypeEntity } from '@/lib/data/types';
import { FormContainer, useForm } from 'react-hook-form-mui';
import CustomTextField from '@/components/modals/custom-text-field';
import CustomModal from '@/components/modals/custom-modal';
import { useCreatePageType, useUpdatePageType } from '@/lib/graphql/hooks';
import ErrorNotification from '@/components/error-notification';

interface IPageTypeModalProps {
    open: boolean,
    item?: PageTypeEntity,
    isSubmitDisabled?: boolean,
    onClose: (updated?: boolean) => void
}

export default function PageTypeModal({ open, item, onClose }: IPageTypeModalProps) {
    const formContext = useForm<{ name: string }>({ defaultValues: { name: item?.name } });
    const { update, updating, updatingError } = useUpdatePageType();
    const { create, creating, creatingError } = useCreatePageType();

    async function onSubmit() {
        try {
            if (item) {
                await update({ ...item, ...formContext.getValues() } as PageTypeEntity);
            } else {
                await create({ ...formContext.getValues() } as PageTypeEntity);
            }

            onClose(true);
        } catch (err) {}
    }

    return (
        <CustomModal title={!item ? 'Add Page Type' : 'Edit Page Type'}
                     open={open}
                     disableBackdropClick={true}
                     onClose={() => onClose()}
                     loading={updating || creating}
                     isSubmitDisabled={!formContext.formState.isValid}
                     onSubmit={onSubmit}>
            <FormContainer onSuccess={() => onSubmit()} formContext={formContext}>
                <CustomTextField fullWidth
                                 required
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