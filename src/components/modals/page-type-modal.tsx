import { LanguageEntity, PageTypeEntity } from '@/lib/data/types';
import { FormContainer, useForm } from 'react-hook-form-mui';
import CustomTextField from '@/components/modals/custom-text-field';
import CustomModal from '@/components/modals/custom-modal';
import { useCreatePageType, useUpdatePageType } from '@/lib/graphql/hooks';

interface IPageTypeModalProps {
    open: boolean,
    item?: LanguageEntity,
    isSubmitDisabled?: boolean,
    onClose: (updated?: boolean) => void
}

export default function PageTypeModal({ open, item, onClose }: IPageTypeModalProps) {
    const formContext = useForm<{ name: string }>({ defaultValues: { name: item?.name } });
    const { update, loading: loadingUpdating } = useUpdatePageType();
    const { create, loading: loadingCreating } = useCreatePageType();

    async function onSubmit() {
        if (item) {
            await update({ ...item, ...formContext.getValues() } as PageTypeEntity);
        } else {
            await create({ ...formContext.getValues() } as PageTypeEntity);
        }

        onClose(true);
    }

    return (
        <CustomModal title={!item ? 'Додати тип сторінки' : 'Редагувати тип сторінки'}
                     open={open}
                     disableBackdropClick={true}
                     onClose={() => onClose()}
                     loading={loadingUpdating || loadingCreating}
                     isSubmitDisabled={!formContext.formState.isValid}
                     onSubmit={onSubmit}>
            <FormContainer onSuccess={() => onSubmit()} formContext={formContext}>
                <CustomTextField fullWidth
                                 required
                                 id="page-type-name"
                                 label="Назва"
                                 name="name"/>
            </FormContainer>
        </CustomModal>
    );
}