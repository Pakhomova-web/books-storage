import { LanguageEntity } from '@/lib/data/types';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { useCreateLanguage, useUpdateLanguage } from '@/lib/graphql/hooks';
import CustomModal from '@/components/modals/custom-modal';
import CustomTextField from '@/components/modals/custom-text-field';
import ErrorNotification from '@/components/error-notification';

interface ILanguageModalProps {
    open: boolean,
    item?: LanguageEntity,
    isSubmitDisabled?: boolean,
    onClose: (updated?: boolean) => void
}

export default function LanguageModal({ open, item, onClose }: ILanguageModalProps) {
    const formContext = useForm<{ name: string }>({ defaultValues: { name: item?.name } });
    const { update, updating, updatingError } = useUpdateLanguage();
    const { create, creating, creatingError } = useCreateLanguage();

    async function onSubmit() {
        try {
            if (item) {
                await update({ ...item, ...formContext.getValues() } as LanguageEntity);
            } else {
                await create({ ...formContext.getValues() } as LanguageEntity);
            }

            onClose(true);
        } catch (err) {}
    }

    return (
        <CustomModal title={!item ? 'Add language' : 'Edit language'}
                     open={open}
                     disableBackdropClick={true}
                     onClose={() => onClose()}
                     loading={updating || creating}
                     isSubmitDisabled={!formContext.formState.isValid}
                     onSubmit={onSubmit}>
            <FormContainer onSuccess={() => onSubmit()} formContext={formContext}>
                <CustomTextField fullWidth
                                 required
                                 id="language-name"
                                 label="Name"
                                 name="name"/>
            </FormContainer>

            {(creatingError || updatingError) &&
              <ErrorNotification apolloError={creatingError || updatingError}></ErrorNotification>
            }
        </CustomModal>
    );
}