import { LanguageEntity, PublishingHouseEntity } from '@/lib/data/types';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { useCreatePublishingHouse, useUpdatePublishingHouse } from '@/lib/graphql/hooks';
import CustomModal from '@/components/modals/custom-modal';
import CustomTextField from '@/components/modals/custom-text-field';

interface IPublishingHouseModalProps {
    open: boolean,
    item?: LanguageEntity,
    isSubmitDisabled?: boolean,
    onClose: (updated?: boolean) => void
}

export default function PublishingHouseModal({ open, item, onClose }: IPublishingHouseModalProps) {
    const formContext = useForm<{ name: string }>({ defaultValues: { name: item?.name } });
    const { update, loading: loadingUpdating } = useUpdatePublishingHouse();
    const { create, loading: loadingCreating } = useCreatePublishingHouse();

    async function onSubmit() {
        if (item) {
            await update({ ...item, ...formContext.getValues() } as PublishingHouseEntity);
        } else {
            await create({ ...formContext.getValues() } as PublishingHouseEntity);
        }

        onClose(true);
    }

    return (
        <CustomModal title={!item ? 'Додати видавництво' : 'Редагувати видавництво'}
                     open={open}
                     disableBackdropClick={true}
                     onClose={() => onClose()}
                     loading={loadingUpdating || loadingCreating}
                     isSubmitDisabled={!formContext.formState.isValid}
                     onSubmit={onSubmit}>
            <FormContainer onSuccess={() => onSubmit()} formContext={formContext}>
                <CustomTextField fullWidth
                                 required
                                 id="publishing-house-name"
                                 label="Назва"
                                 name="name"/>
            </FormContainer>
        </CustomModal>
    );
}