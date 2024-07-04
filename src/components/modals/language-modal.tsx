import { LanguageEntity } from '@/lib/data/types';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { useCreateLanguage, useUpdateLanguage } from '@/lib/graphql/hooks';
import CustomModal from '@/components/modals/custom-modal';
import CustomTextField from '@/components/modals/custom-text-field';

interface ILanguageModalProps {
    open: boolean,
    item?: LanguageEntity,
    isSubmitDisabled?: boolean,
    onClose: (updated?: boolean) => void
}

export default function LanguageModal({ open, item, onClose }: ILanguageModalProps) {
    const formContext = useForm<{ name: string }>({ defaultValues: { name: item?.name } });
    const { update, loading: loadingUpdating } = useUpdateLanguage();
    const { create, loading: loadingCreating } = useCreateLanguage();

    async function onSubmit() {
        if (item) {
            await update({ ...item, ...formContext.getValues() } as LanguageEntity);
        } else {
            await create({ ...formContext.getValues() } as LanguageEntity);
        }

        onClose(true);
    }

    return (
        <CustomModal title={!item ? 'Додати мову видавництва' : 'Редагувати мову видавництва'}
                     open={open}
                     disableBackdropClick={true}
                     onClose={() => onClose()}
                     loading={loadingUpdating || loadingCreating}
                     isSubmitDisabled={!formContext.formState.isValid}
                     onSubmit={onSubmit}>
            <FormContainer onSuccess={() => onSubmit()} formContext={formContext}>
                <CustomTextField fullWidth
                                 required
                                 id="language-name"
                                 label="Назва"
                                 name="name"/>
            </FormContainer>
        </CustomModal>
    );
}