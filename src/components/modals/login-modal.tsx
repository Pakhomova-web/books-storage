import { Box, Button, Grid } from "@mui/material";
import { FormContainer, useForm } from 'react-hook-form-mui';
import CustomTextField from '@/components/form-fields/custom-text-field';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { authStyles } from '@/styles/auth';
import ErrorNotification from '@/components/error-notification';
import CustomPasswordElement from '@/components/form-fields/custom-password-element';
import { emailValidatorExp, passwordValidatorExp } from '@/constants/validators-exp';
import { useLogin } from '@/lib/graphql/queries/auth/hook';
import { useAuth } from '@/components/auth-context';
import CustomModal from '@/components/modals/custom-modal';
import CustomLink from '@/components/custom-link';

export default function LoginModal({ open }) {
    const router = useRouter();
    const formContext = useForm<{ email: string, password: string }>();
    const { loading, error, loginUser } = useLogin();
    const { login, setOpenLoginModal } = useAuth();
    const { email, password } = formContext.watch();

    useEffect(() => {
        if (password && !passwordValidatorExp.test(password)) {
            formContext.setError('password', { message: 'Мін 8 символів: A-Z, a-z, 0-9' });
        } else if (!password && formContext.formState.touchedFields.password) {
            formContext.setError('password', { message: 'Пароль обов\'язковий' });
        } else {
            formContext.clearErrors('password');
        }
    }, [password]);

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
    }, [email]);

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

    function onForgotPasswordClick() {

    }

    function goToSignInPage() {
        setOpenLoginModal(false);
        router.push('sign-in');
    }

    function isFormInvalid(): boolean {
        return !password || !email || !!Object.keys(formContext.formState.errors).length;
    }

    return (
        <CustomModal open={open} loading={loading}>
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

                    <CustomLink onClick={onForgotPasswordClick}>Забули пароль?</CustomLink>
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

            {error && <ErrorNotification error={error}></ErrorNotification>}
        </CustomModal>
    );
}