import { AuthorEntity } from '@/lib/data/types';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { useCreateAuthor, useUpdateAuthor } from '@/lib/graphql/hooks';
import CustomModal from '@/components/modals/custom-modal';
import CustomTextField from '@/components/modals/custom-text-field';

interface IAuthorModalProps {
    open: boolean,
    item?: AuthorEntity,
    isSubmitDisabled?: boolean,
    onClose: (updated?: boolean) => void
}

export default function AuthorModal({ open, item, onClose }: IAuthorModalProps) {
    const formContext = useForm<AuthorEntity>({
        defaultValues: {
            name: item?.name,
            description: item?.description
        }
    });
    const { update, loading: loadingUpdating } = useUpdateAuthor();
    const { create, loading: loadingCreating } = useCreateAuthor();

    async function onSubmit() {
        if (item) {
            await update({ id: item.id, ...formContext.getValues() } as AuthorEntity);
        } else {
            await create({ ...formContext.getValues() } as AuthorEntity);
        }

        onClose(true);
    }

    return (
        <CustomModal title={!item ? 'Додати автора' : 'Редагувати автора'}
                     open={open}
                     disableBackdropClick={true}
                     onClose={() => onClose()}
                     loading={loadingUpdating || loadingCreating}
                     isSubmitDisabled={!formContext.formState.isValid}
                     onSubmit={onSubmit}>
            <FormContainer onSuccess={() => onSubmit()} formContext={formContext}>
                <CustomTextField fullWidth
                                 required
                                 id="author-name"
                                 label="Ім'я"
                                 name="name"/>

                <CustomTextField fullWidth
                                 id="description"
                                 label="Опис"
                                 name="description"/>
            </FormContainer>
        </CustomModal>
    );
}