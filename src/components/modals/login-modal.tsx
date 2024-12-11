import { Box, Button, Grid } from "@mui/material";
import { FormContainer, useForm } from 'react-hook-form-mui';
import CustomTextField from '@/components/form-fields/custom-text-field';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { authStyles } from '@/styles/auth';
import CustomPasswordElement from '@/components/form-fields/custom-password-element';
import { useLogin, useSendResetPasswordLink } from '@/lib/graphql/queries/auth/hook';
import { useAuth } from '@/components/auth-context';
import CustomModal from '@/components/modals/custom-modal';
import CustomLink from '@/components/custom-link';
import CustomImage from '@/components/custom-image';
import { emailValidation, passwordValidation } from '@/utils/utils';

export default function LoginModal({ open }) {
    const router = useRouter();
    const formContext = useForm<{ email: string, password: string }>();
    const { loading, error, loginUser } = useLogin();
    const { login, setOpenLoginModal } = useAuth();
    const {
        sendingResetPasswordLink,
        sendResetPasswordLink,
        errorSendingResetPasswordLink
    } = useSendResetPasswordLink();
    const { email, password } = formContext.watch();
    const [successMsgAfterSendingResetPasswordLink, setSuccessMsgAfterSendingResetPasswordLink] = useState<boolean>(false);
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState<boolean>(false);

    useEffect(() => {
        passwordValidation(formContext, password, 'password');
    }, [password, formContext]);

    useEffect(() => {
        emailValidation(formContext, email, 'email');
    }, [email, formContext]);

    async function onSubmit() {
        if (!isFormInvalid()) {
            const values = formContext.getValues();

            loginUser(values.email, values.password)
                .then(({ user, token, refreshToken }) => {
                    login(user, token, refreshToken);
                    setOpenLoginModal(false);
                })
                .catch(() => {
                });
        }
    }

    function onSendResetPasswordLink() {
        setShowForgotPasswordModal(false);
        sendResetPasswordLink(formContext.getValues().email)
            .then(() => setSuccessMsgAfterSendingResetPasswordLink(true))
            .catch(() => {
            });
    }

    function onForgotPasswordClick() {
        setShowForgotPasswordModal(true);
    }

    function goToSignInPage() {
        setOpenLoginModal(false);
        router.push('sign-in');
    }

    function isFormInvalid(): boolean {
        return !password || !email || !!Object.keys(formContext.formState.errors).length;
    }

    return (
        <CustomModal open={open} loading={loading || sendingResetPasswordLink}
                     error={error || errorSendingResetPasswordLink}>
            <Box sx={authStyles.title} mb={2}>Вхід</Box>

            <FormContainer formContext={formContext} handleSubmit={formContext.handleSubmit(onSubmit)}>
                <Box display="flex" flexDirection="column" gap={1} mb={2}>
                    <CustomTextField fullWidth name="email" required label="Ел. пошта" type="email"/>

                    <CustomPasswordElement fullWidth
                                           variant="outlined"
                                           id="password"
                                           label="Пароль"
                                           name="password"
                                           required/>

                    {!successMsgAfterSendingResetPasswordLink ?
                        <CustomLink onClick={onForgotPasswordClick}
                                    tooltip="Введіть ел. адресу"
                                    disabled={!email || !!formContext.formState.errors.email}>
                            Забули пароль?
                        </CustomLink> :
                        <CustomModal open={true}
                                     onClose={() => setSuccessMsgAfterSendingResetPasswordLink(false)}>
                            <Box display="flex" justifyContent="center" width="100%">
                                <Box width="80px" height="80px">
                                    <CustomImage imageLink="/sent_email.png"/>
                                </Box>
                            </Box>
                            <Box textAlign="center">
                                Посилання на відновлення паролю було успішно відправлено!
                            </Box>
                        </CustomModal>}
                    {showForgotPasswordModal &&
                      <CustomModal open={true}
                                   onSubmit={onSendResetPasswordLink}
                                   submitText="Так"
                                   onClose={() => setShowForgotPasswordModal(false)}>
                        <Box textAlign="center">
                          Для відновлення паролю Вам буде надіслано повідомлення на ел. пошту {email}. Продовжити?
                        </Box>
                      </CustomModal>}
                </Box>

                <Grid container spacing={2} mb={1}>
                    <Grid item xs={6}>
                        <Button variant="outlined" fullWidth onClick={() => setOpenLoginModal(false)}>
                            Відмінити
                        </Button>
                    </Grid>

                    <Grid item xs={6}>
                        <Button variant="contained"
                                fullWidth
                                type="submit"
                                disabled={isFormInvalid()}>
                            Вхід
                        </Button>
                    </Grid>
                </Grid>
            </FormContainer>

            <Box display="flex" flexDirection="column" gap={1} alignItems="center" mb={1}>
                або
                <CustomLink onClick={() => goToSignInPage()}>
                    Створити новий аккаунт
                </CustomLink>
            </Box>
        </CustomModal>
    );
}
