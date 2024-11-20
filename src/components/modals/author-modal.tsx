import { AuthorEntity } from '@/lib/data/types';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { useCreateAuthor, useUpdateAuthor } from '@/lib/graphql/queries/author/hook';
import CustomModal from '@/components/modals/custom-modal';
import CustomTextField from '@/components/form-fields/custom-text-field';
import ErrorNotification from '@/components/error-notification';
import { useAuth } from '@/components/auth-context';
import { Box } from '@mui/material';

interface IAuthorModalProps {
    open: boolean,
    item?: AuthorEntity,
    isSubmitDisabled?: boolean,
    isAdmin?: boolean,
    onClose: (updated?: boolean) => void
}

export default function AuthorModal({ open, item, onClose, isAdmin }: IAuthorModalProps) {
    const formContext = useForm<AuthorEntity>({
        defaultValues: {
            name: item?.name,
            description: item?.description
        }
    });
    const { update, updating, updatingError } = useUpdateAuthor();
    const { create, creating, creatingError } = useCreateAuthor();
    const { checkAuth } = useAuth();

    async function onSubmit() {
        try {
            if (item) {
                await update({ id: item.id, ...formContext.getValues() } as AuthorEntity);
            } else {
                await create({ ...formContext.getValues() } as AuthorEntity);
            }

            onClose(true);
        } catch (err) {
            checkAuth(err);
        }
    }

    return (
        <CustomModal title={(!item ? 'Додати' : (!isAdmin ? 'Подивитися' : 'Відредагувати')) + ' автора'}
                     open={open}
                     disableBackdropClick={true}
                     onClose={() => onClose()}
                     loading={updating || creating}
                     isSubmitDisabled={!formContext.formState.isValid}
                     onSubmit={isAdmin ? onSubmit : null}>
            <FormContainer formContext={formContext}>
                <Box display="flex" gap={1} flexDirection="column">
                    <CustomTextField fullWidth
                                     required
                                     autoFocus
                                     id="author-name"
                                     label="ПІБ"
                                     name="name"/>

                    <CustomTextField fullWidth
                                     id="description"
                                     label="Опис"
                                     name="description"/>
                </Box>
            </FormContainer>

            {(creatingError || updatingError) &&
              <ErrorNotification error={creatingError || updatingError}></ErrorNotification>
            }
        </CustomModal>
    );
}