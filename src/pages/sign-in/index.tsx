import { Box, Button } from '@mui/material';
import { useRouter } from 'next/router';
import { FormContainer, useForm } from 'react-hook-form-mui';

import { authStyles } from '@/styles/auth';
import CustomTextField from '@/components/form-fields/custom-text-field';
import { pageStyles, styleVariables } from '@/constants/styles-variables';
import ErrorNotification from '@/components/error-notification';
import Loading from '@/components/loading';
import { useSignIn } from '@/lib/graphql/queries/auth/hook';
import React, { useEffect } from 'react';
import CustomPasswordElement from '@/components/form-fields/custom-password-element';
import { emailValidatorExp, passwordValidatorExp } from '@/constants/validators-exp';

export default function SignIn() {
    const router = useRouter();
    const formContext = useForm<{
        email: string,
        password: string,
        confirmPassword: string,
        firstName: string,
        lastName: string
    }>();
    const { loading, error, signIn } = useSignIn();
    const { password, confirmPassword, email } = formContext.watch();

    useEffect(() => {
        if (formContext.formState.touchedFields.password || formContext.formState.touchedFields.confirmPassword) {
            if (password && !passwordValidatorExp.test(password)) {
                formContext.setError('password', { message: 'Мін 8 симовлів: A-Z, a-z, 0-9' });
            } else if (!password && formContext.formState.touchedFields.password) {
                formContext.setError('password', { message: 'Пароль обов\'язковий' });
            } else if (!confirmPassword && formContext.formState.touchedFields.confirmPassword) {
                formContext.setError('confirmPassword', { message: 'Пароль обов\'язковий' });
            } else if (password !== confirmPassword && formContext.formState.touchedFields.confirmPassword && formContext.formState.touchedFields.password) {
                formContext.setError('password', { message: 'Паролі повинні співпадати' });
                formContext.setError('confirmPassword', { message: 'Паролі повинні співпадати' });
            } else {
                formContext.clearErrors('password');
                formContext.clearErrors('confirmPassword');
            }
        }
    }, [password, confirmPassword]);

    useEffect(() => {
        if (formContext.formState.touchedFields.email) {
            if (!email) {
                formContext.setError('email', { message: 'Ел. адреса обов\'язкова' });
            } else if (!emailValidatorExp.test(email)) {
                formContext.setError('email', { message: 'Ел. адреса невірна' });
            } else {
                formContext.clearErrors('email');
            }
        } else {
            formContext.clearErrors('email');
        }
    }, [email]);

    async function onSubmit() {
        if (isFormInvalid()) {
            const values = formContext.getValues();

            try {
                await signIn({
                    email: values.email,
                    password: values.password,
                    firstName: values.firstName,
                    lastName: values.lastName
                });
                goToLoginPage();
            } catch (_) {
            }
        }
    }

    function goToLoginPage() {
        router.push('login');
    }

    function isFormInvalid(): boolean {
        return !password || !email || !!Object.keys(formContext.formState.errors).length;
    }

    return (
        <Box sx={pageStyles}>
            <Box sx={authStyles.container}>
                <Loading show={loading}></Loading>

                <Box sx={authStyles.title}>Реєстрація</Box>
                <FormContainer formContext={formContext} handleSubmit={formContext.handleSubmit(onSubmit)}>
                    <CustomTextField fullWidth name="email" required type="email" label="Ел. адреса" id="email"/>

                    <CustomPasswordElement fullWidth
                                           variant="standard"
                                           id="password"
                                           label="Пароль"
                                           name="password"
                                           required/>

                    <CustomPasswordElement fullWidth
                                           variant="standard"
                                           id="confirmPassword"
                                           label="Підтвердіть пароль"
                                           name="confirmPassword"
                                           required/>

                    <CustomTextField fullWidth name="firstName" label="Ім'я"/>

                    <CustomTextField fullWidth name="lastName" label="Прізвище"/>
                </FormContainer>
                <Button variant="contained"
                        sx={authStyles.buttonMargin}
                        disabled={isFormInvalid()}
                        onClick={onSubmit}>
                    Створити аккаунт
                </Button>
                <Box sx={{ ...styleVariables.textCenter, ...authStyles.boxStyles }}>або</Box>
                <Button variant="outlined" onClick={() => goToLoginPage()}>Увійти в аккаунт</Button>

                {error && <ErrorNotification error={error}></ErrorNotification>}
            </Box>
        </Box>
    );
}
