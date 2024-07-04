import { BookTypeEntity } from '@/lib/data/types';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { useCreateBookType, useCreateCoverType, useUpdateBookType, useUpdateCoverType } from '@/lib/graphql/hooks';
import CustomModal from '@/components/modals/custom-modal';
import CustomTextField from '@/components/modals/custom-text-field';

interface IBookTypeModalProps {
    open: boolean,
    item?: BookTypeEntity,
    isSubmitDisabled?: boolean,
    onClose: (updated?: boolean) => void
}

export default function BookTypeModal({ open, item, onClose }: IBookTypeModalProps) {
    const formContext = useForm<{ name: string }>({ defaultValues: { name: item?.name } });
    const { update, loading: loadingUpdating } = useUpdateBookType();
    const { create, loading: loadingCreating } = useCreateBookType();

    async function onSubmit() {
        if (item) {
            await update({ ...item, ...formContext.getValues() } as BookTypeEntity);
        } else {
            await create({ ...formContext.getValues() } as BookTypeEntity);
        }

        onClose(true);
    }

    return (
        <CustomModal title={!item ? 'Додати тип книги' : 'Редагувати тип книги'}
                     open={open}
                     disableBackdropClick={true}
                     onClose={() => onClose()}
                     loading={loadingUpdating || loadingCreating}
                     isSubmitDisabled={!formContext.formState.isValid}
                     onSubmit={onSubmit}>
            <FormContainer onSuccess={() => onSubmit()} formContext={formContext}>
                <CustomTextField fullWidth
                                 required
                                 id="book-type-name"
                                 label="Назва"
                                 name="name"/>
            </FormContainer>
        </CustomModal>
    );
}