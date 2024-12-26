import { Box, Button } from "@mui/material";
import { FormContainer, useForm } from 'react-hook-form-mui';
import CustomTextField from '@/components/form-fields/custom-text-field';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { ApolloError } from '@apollo/client';
import CustomPasswordElement from '@/components/form-fields/custom-password-element';
import { loginUser, useSendResetPasswordLink } from '@/lib/graphql/queries/auth/hook';
import { useAuth } from '@/components/auth-context';
import CustomModal from '@/components/modals/custom-modal';
import CustomLink from '@/components/custom-link';
import CustomImage from '@/components/custom-image';
import { emailValidation, passwordValidation } from '@/utils/utils';
import ErrorNotification from '@/components/error-notification';

export default function LoginModal({ open }) {
    const router = useRouter();
    const formContext = useForm<{ email: string, password: string }>();
    const [loading, setLoading] = useState<boolean>(false);
    const [showNotActivatedMsg, setShowNotActivatedMsg] = useState<boolean>(false);
    const [error, setError] = useState<ApolloError>();
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
        setError(null);
        passwordValidation(formContext, password, 'password');
    }, [password, formContext]);

    useEffect(() => {
        emailValidation(formContext, email, 'email');
    }, [email, formContext]);

    function onSubmit() {
        setError(null);
        if (!isFormInvalid()) {
            const values = formContext.getValues();

            setLoading(true);
            loginUser(values.email, values.password)
                .then(({ data: { login: { user, token, refreshToken } } }) => {
                    login(user, token, refreshToken);
                    formContext.reset();
                    setLoading(false);
                    if (!user.active) {
                        setShowNotActivatedMsg(true);
                    } else {
                        setOpenLoginModal(false);
                    }
                })
                .catch(err => {
                    setError(err);
                    setLoading(false);
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

    function closeModal() {
        setShowNotActivatedMsg(false);
        setOpenLoginModal(false);
    }

    return (
        <CustomModal open={open} loading={loading || sendingResetPasswordLink} title="Вхід"
                     onClose={() => setOpenLoginModal(false)}>
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
                                     title="Відновлення паролю"
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
                                   title="Відновлення паролю"
                                   onSubmit={onSendResetPasswordLink}
                                   submitText="Так"
                                   onClose={() => setShowForgotPasswordModal(false)}>
                        <Box textAlign="center" display="flex" flexDirection="column" alignItems="center" gap={1}>
                          <Box sx={{ width: '50px', height: '50px' }}>
                            <CustomImage imageLink="/sent_email.png"/>
                          </Box>
                          Для відновлення паролю Вам буде надіслано повідомлення на ел. пошту {email}. Продовжити?
                        </Box>
                      </CustomModal>}
                </Box>

                {!!error && <ErrorNotification error={error}/>}
                {!!errorSendingResetPasswordLink && <ErrorNotification error={errorSendingResetPasswordLink}/>}

                <Box width="100%" mb={1}>
                    <Button variant="contained"
                            fullWidth
                            type="submit"
                            disabled={isFormInvalid()}>
                        Вхід
                    </Button>
                </Box>
            </FormContainer>

            <Box display="flex" flexDirection="column" gap={1} alignItems="center" mb={1}>
                або
                <CustomLink onClick={() => goToSignInPage()}>
                    Створити новий аккаунт
                </CustomLink>
            </Box>

            <CustomModal open={showNotActivatedMsg} onClose={() => closeModal()} title="Підтвердження ел. адреси">
                <Box textAlign="center" display="flex" flexDirection="column" alignItems="center" gap={1}>
                    <Box sx={{ width: '50px', height: '50px' }}>
                        <CustomImage imageLink="/sent_email.png"/>
                    </Box>
                    На вказану Вами ел. пошту був надісланий лист для підтвердження.
                    Будь ласка, активуйте свій профіль для закінчення реєстрації.
                    Надіслати повторний лист можна зі сторінки персональної інформації.
                </Box>
            </CustomModal>
        </CustomModal>
    );
}
