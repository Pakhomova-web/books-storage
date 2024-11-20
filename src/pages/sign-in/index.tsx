import { Box, Button } from '@mui/material';
import { FormContainer, useForm } from 'react-hook-form-mui';

import { authStyles } from '@/styles/auth';
import CustomTextField from '@/components/form-fields/custom-text-field';
import { borderRadius, primaryLightColor } from '@/constants/styles-variables';
import ErrorNotification from '@/components/error-notification';
import Loading from '@/components/loading';
import { useSignIn } from '@/lib/graphql/queries/auth/hook';
import { useEffect } from 'react';
import CustomPasswordElement from '@/components/form-fields/custom-password-element';
import { emailValidatorExp, passwordValidatorExp } from '@/constants/validators-exp';
import { useAuth } from '@/components/auth-context';
import { useRouter } from 'next/router';

const containerStyles = {
    width: '400px',
    maxWidth: '85vw'
};

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
    const { setOpenLoginModal } = useAuth();

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

    function onSubmit() {
        if (!isFormInvalid()) {
            const { email, password, firstName, lastName } = formContext.getValues();

            signIn({ email, password, firstName, lastName })
                .then(() => {
                    formContext.reset();
                    openLoginModal();
                    router.push('/');
                })
                .catch(() => {
                })
        }
    }

    function openLoginModal() {
        setOpenLoginModal(true);
    }

    function isFormInvalid(): boolean {
        return !password || !email || !!Object.keys(formContext.formState.errors).length;
    }

    return (
        <Box position="relative" display="flex" justifyContent="center">
            <Loading show={loading}></Loading>

            <Box p={2} m={2} border={1} borderColor={primaryLightColor} borderRadius={borderRadius}
                 sx={containerStyles}>
                <Box sx={authStyles.title} mb={2}>Реєстрація</Box>

                <FormContainer formContext={formContext} handleSubmit={formContext.handleSubmit(onSubmit)}>
                    <Box gap={1} display="flex" flexDirection="column">
                        <CustomTextField fullWidth name="email" required type="email" label="Ел. адреса"
                                         id="email"/>

                        <CustomPasswordElement fullWidth
                                               variant="outlined"
                                               id="password"
                                               label="Пароль"
                                               name="password"
                                               required/>

                        <CustomPasswordElement fullWidth
                                               variant="outlined"
                                               id="confirmPassword"
                                               label="Підтвердіть пароль"
                                               name="confirmPassword"
                                               required/>

                        <CustomTextField fullWidth name="firstName" label="Ім'я"/>

                        <CustomTextField fullWidth name="lastName" label="Прізвище"/>

                        <Button variant="contained"
                                fullWidth
                                disabled={isFormInvalid()}
                                onClick={onSubmit}>
                            Створити аккаунт
                        </Button>
                    </Box>
                </FormContainer>

                <Box display="flex" alignItems="center" gap={1} mt={1} flexDirection="column">
                    або
                    <Button variant="outlined" fullWidth onClick={openLoginModal}>Увійти в аккаунт</Button>
                </Box>

                {error && <ErrorNotification error={error}></ErrorNotification>}
            </Box>
        </Box>
    );
}
