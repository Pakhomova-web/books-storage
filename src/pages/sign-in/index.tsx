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
                formContext.setError('password', { message: 'Min 8 chars: A-Z, a-z, 0-9' });
            } else if (!password && formContext.formState.touchedFields.password) {
                formContext.setError('password', { message: 'Password is required' });
            } else if (!confirmPassword && formContext.formState.touchedFields.confirmPassword) {
                formContext.setError('confirmPassword', { message: 'Confirm Password is required' });
            } else if (password !== confirmPassword && formContext.formState.touchedFields.confirmPassword && formContext.formState.touchedFields.password) {
                formContext.setError('password', { message: 'Passwords should match' });
                formContext.setError('confirmPassword', { message: 'Passwords should match' });
            } else {
                formContext.clearErrors('password');
                formContext.clearErrors('confirmPassword');
            }
        }
    }, [password, confirmPassword]);

    useEffect(() => {
        if (formContext.formState.touchedFields.email) {
            if (!email) {
                formContext.setError('email', { message: 'Email is required' });
            } else if (!emailValidatorExp.test(email)) {
                formContext.setError('email', { message: 'Email is invalid' });
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

                <Box sx={authStyles.title}>Sign In</Box>
                <FormContainer formContext={formContext} handleSubmit={formContext.handleSubmit(onSubmit)}>
                    <CustomTextField fullWidth name="email" required type="email" label="Email" id="email"/>

                    <CustomPasswordElement fullWidth
                                           variant="standard"
                                           id="password"
                                           label="Password"
                                           name="password"
                                           required/>

                    <CustomPasswordElement fullWidth
                                           variant="standard"
                                           id="confirmPassword"
                                           label="Confirm Password"
                                           name="confirmPassword"
                                           required/>

                    <CustomTextField fullWidth name="firstName" label="First Name"/>

                    <CustomTextField fullWidth name="lastName" label="Last Name"/>
                </FormContainer>
                <Button variant="contained"
                        sx={authStyles.buttonMargin}
                        disabled={isFormInvalid()}
                        onClick={onSubmit}>
                    Create account
                </Button>
                <Box sx={{ ...styleVariables.textCenter, ...authStyles.boxStyles }}>or</Box>
                <Button variant="outlined" onClick={() => goToLoginPage()}>Login</Button>

                {error && <ErrorNotification error={error}></ErrorNotification>}
            </Box>
        </Box>
    );
}
