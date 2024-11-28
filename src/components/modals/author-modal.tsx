import { AuthorEntity } from '@/lib/data/types';
import { useForm } from 'react-hook-form-mui';
import { useCreateAuthor, useUpdateAuthor } from '@/lib/graphql/queries/author/hook';
import CustomModal from '@/components/modals/custom-modal';
import CustomTextField from '@/components/form-fields/custom-text-field';
import ErrorNotification from '@/components/error-notification';
import { useAuth } from '@/components/auth-context';
import { Box, Grid } from '@mui/material';
import React from 'react';

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
    const { description } = formContext.watch();

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
                     big={true}
                     onClose={() => onClose()}
                     loading={updating || creating}
                     isSubmitDisabled={!formContext.formState.isValid}
                     formContext={formContext}
                     onSubmit={isAdmin ? onSubmit : null}>
            <Box display="flex" gap={2} flexDirection="column">
                <CustomTextField fullWidth
                                 required
                                 autoFocus={true}
                                 id="author-name"
                                 label="ПІБ"
                                 name="name"/>

                <CustomTextField fullWidth
                                 multiline
                                 id="description"
                                 label="Опис"
                                 name="description"/>

                {description && <Grid item xs={12}>
                  <Box mb={1}><b>Попередній огляд опису:</b></Box>
                  <Box dangerouslySetInnerHTML={{ __html: description }}></Box>
                </Grid>}
            </Box>

            {(creatingError || updatingError) &&
              <ErrorNotification error={creatingError || updatingError}></ErrorNotification>
            }
        </CustomModal>
    );
}