import { Box, Button } from "@mui/material";
import { pageStyles, styleVariables } from '@/constants/styles-variables';
import { FormContainer, useForm } from 'react-hook-form-mui';
import CustomTextField from '@/components/form-fields/custom-text-field';
import { useRouter } from 'next/router';
import { authStyles } from '@/styles/auth';
import ErrorNotification from '@/components/error-notification';
import React, { useEffect } from 'react';
import CustomPasswordElement from '@/components/form-fields/custom-password-element';
import { emailValidatorExp, passwordValidatorExp } from '@/constants/validators-exp';
import Loading from '@/components/loading';
import { useLogin } from '@/lib/graphql/queries/auth/hook';
import { useAuth } from '@/components/auth-context';

const forgotPasswordLink = {
    display: 'flex',
    ...styleVariables.hintFontSize,
    margin: `${styleVariables.margin} 0`
};

export default function Login() {
    const router = useRouter();
    const formContext = useForm<{ email: string, password: string }>();
    const { loading, error, loginUser } = useLogin();
    const { login } = useAuth();
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

            try {
                const { user, token, refreshToken } = await loginUser(values.email, values.password);

                login(user, token, refreshToken);
                router.push('/');
            } catch (_) {
            }
        }
    }

    function onForgotPasswordClick() {

    }

    function goToSignInPage() {
        router.push('sign-in');
    }

    function isFormInvalid(): boolean {
        return !password || !email || !!Object.keys(formContext.formState.errors).length;
    }

    return (
        <Box sx={pageStyles}>
            <Box sx={authStyles.container}>
                <Loading show={loading}></Loading>

                <Box sx={authStyles.title}>Вхід</Box>
                <FormContainer formContext={formContext} handleSubmit={formContext.handleSubmit(onSubmit)}>
                    <CustomTextField fullWidth name="email" required label="Ел. пошта" type="email"/>

                    <CustomPasswordElement fullWidth
                                           variant="standard"
                                           id="password"
                                           label="Пароль"
                                           name="password"
                                           required/>

                    <Box sx={forgotPasswordLink}>
                        <Box sx={styleVariables.cursorPointer} onClick={onForgotPasswordClick}>Забули пароль?</Box>
                    </Box>
                    <Button variant="contained"
                            fullWidth
                            type="submit"
                            sx={authStyles.buttonMargin}
                            disabled={isFormInvalid()}>
                        Вхід
                    </Button>
                </FormContainer>

                <Box sx={{ ...styleVariables.textCenter, ...authStyles.boxStyles }}>або</Box>
                <Button variant="outlined" onClick={() => goToSignInPage()}>Створити новий аккаунт</Button>

                {error && <ErrorNotification error={error}></ErrorNotification>}
            </Box>
        </Box>
    );
}
