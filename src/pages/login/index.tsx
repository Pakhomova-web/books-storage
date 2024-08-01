import { Box, Button } from "@mui/material";
import { pageStyles, positionRelative, styleVariables } from '@/constants/styles-variables';
import { FormContainer, useForm } from 'react-hook-form-mui';
import CustomTextField from '@/components/form-fields/custom-text-field';
import { useRouter } from 'next/router';
import { authStyles } from '@/styles/auth';
import ErrorNotification from '@/components/error-notification';
import React, { useEffect } from 'react';
import CustomPasswordElement from '@/components/form-fields/custom-password-element';
import { emailValidatorExp, passwordValidatorExp } from '@/constants/validators-exp';
import Loading from '@/components/loading';
import { useLogin } from '@/lib/graphql/hooks';
import { useAuth } from '@/components/auth-context';

const forgotPasswordLink = {
    display: 'flex',
    fontSize: styleVariables.hintFontSize,
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
            formContext.setError('password', { message: 'Min 8 chars: A-Z, a-z, 0-9' });
        } else if (!password && formContext.formState.touchedFields.password) {
            formContext.setError('password', { message: 'Password is required' });
        } else {
            formContext.clearErrors('password');
        }
    }, [password]);

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
        if (formContext.formState.isValid) {
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

    return (
        <Box sx={positionRelative}>
            <Loading show={loading}></Loading>

            <Box sx={pageStyles}>
                <Box sx={authStyles.container}>
                    <Box sx={authStyles.title}>Login</Box>
                    <FormContainer formContext={formContext} onSuccess={() => onSubmit()}>
                        <CustomTextField fullWidth name="email" required label="Email" type="email"/>

                        <CustomPasswordElement fullWidth
                                               variant="standard"
                                               id="password"
                                               label="Password"
                                               name="password"
                                               required/>
                    </FormContainer>
                    <Box sx={forgotPasswordLink}>
                        <Box sx={styleVariables.cursorPointer} onClick={onForgotPasswordClick}>Forgot password?</Box>
                    </Box>
                    <Button variant="contained"
                            sx={authStyles.buttonMargin}
                            disabled={!formContext.formState.isValid}
                            onClick={() => onSubmit()}>
                        Login
                    </Button>
                    <Box sx={{ ...styleVariables.textCenter, ...authStyles.boxStyles }}>or</Box>
                    <Button variant="outlined" onClick={() => goToSignInPage()}>Create new account</Button>

                    {error && <ErrorNotification error={error}></ErrorNotification>}
                </Box>
            </Box>
        </Box>
    );
}
