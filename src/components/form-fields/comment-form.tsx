import { Box, Button, Grid } from '@mui/material';
import { FormContainer, useForm } from 'react-hook-form-mui';
import React, { useEffect, useState } from 'react';

import { useAuth } from '@/components/auth-context';
import CustomTextField from '@/components/form-fields/custom-text-field';
import { borderRadius, primaryLightColor, styleVariables } from '@/constants/styles-variables';
import { CommentEntity } from '@/lib/data/types';
import { emailValidatorExp } from '@/constants/validators-exp';
import { useAddBookComment } from '@/lib/graphql/queries/book/hook';
import Loading from '@/components/loading';
import ErrorNotification from '@/components/error-notification';
import CustomModal from '@/components/modals/custom-modal';
import { trimValues } from '@/utils/utils';

const commentFormStyles = {
    borderRadius,
    border: `1px solid ${primaryLightColor}`,
    position: 'relative'
};

interface ICommentFormProps {
    bookId: string
}

interface IForm {
    email: string,
    username: string,
    value: string
}

export default function CommentForm({ bookId }: ICommentFormProps) {
    const { user } = useAuth();
    const formContext = useForm<IForm>({
        defaultValues: {
            email: user?.email,
            username: user?.firstName
        }
    });
    const { addingComment, addingCommentError, addComment } = useAddBookComment();
    const { email, value, username } = formContext.watch();
    const [openModal, setOpenModal] = useState<boolean>(false);

    useEffect(() => {
        if (formContext.formState.touchedFields.email) {
            if (!email) {
                formContext.setError('email', { message: 'Ел. пошта обов\'язкова' });
            } else if (!emailValidatorExp.test(email)) {
                formContext.setError('email', { message: 'Ел. пошта невірна' });
            } else {
                formContext.clearErrors('email');
            }
        } else {
            formContext.clearErrors('email');
        }
    }, [email, formContext]);

    function onSubmit() {
        addComment(bookId, new CommentEntity({
            ...trimValues(formContext.getValues()),
            date: new Date().toISOString()
        }))
            .then(() => {
                formContext.reset();
                setOpenModal(true);
            })
            .catch(() => {
            });
    }

    function isFormInvalid(): boolean {
        return !value || !email || !username || !!Object.keys(formContext.formState.errors).length;
    }

    return (
        <FormContainer formContext={formContext}>
            <Grid container spacing={2} sx={commentFormStyles} pr={2} pb={2}>
                <Loading show={addingComment} isSmall={true}></Loading>

                <Grid item xs={12} textAlign="center" sx={styleVariables.titleFontSize}>
                    <b>Залишити відгук</b></Grid>

                <Grid item xs={12}>
                    <CustomTextField fullWidth required name="email" label="Ел. адреса"></CustomTextField>
                </Grid>

                <Grid item xs={12}>
                    <CustomTextField fullWidth required name="username" label="Ім'я"></CustomTextField>
                </Grid>

                <Grid item xs={12}>
                    <CustomTextField fullWidth required name="value" label="Відгук" multiline></CustomTextField>
                </Grid>

                {addingCommentError && <ErrorNotification error={addingCommentError}></ErrorNotification>}

                <Grid item xs={12} display="flex">
                    <Button variant="outlined" disabled={isFormInvalid()} fullWidth onClick={onSubmit}>
                        Додати
                    </Button>
                </Grid>
            </Grid>

            {openModal &&
              <CustomModal open={true} onClose={() => setOpenModal(false)}>
                <Box textAlign="center" sx={styleVariables.titleFontSize} mb={1}>Дякуємо за ваш відгук!</Box>
                <Box textAlign="center">Він з{'\''}явиться для перегляду після перевірки адміністратором.</Box>
              </CustomModal>}
        </FormContainer>
    );
}