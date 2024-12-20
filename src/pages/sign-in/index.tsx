import { Box, Button } from '@mui/material';
import { FormContainer, useForm } from 'react-hook-form-mui';

import { authStyles } from '@/styles/auth';
import CustomTextField from '@/components/form-fields/custom-text-field';
import { borderRadius, primaryLightColor } from '@/constants/styles-variables';
import ErrorNotification from '@/components/error-notification';
import Loading from '@/components/loading';
import { useSignIn } from '@/lib/graphql/queries/auth/hook';
import React, { useEffect, useState } from 'react';
import CustomPasswordElement from '@/components/form-fields/custom-password-element';
import { useAuth } from '@/components/auth-context';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { MAIN_NAME } from '@/constants/main-name';
import { emailValidation, passwordValidation, trimValues, validatePhoneNumber } from '@/utils/utils';
import CustomModal from '@/components/modals/custom-modal';
import CustomImage from '@/components/custom-image';
import { MuiTelInput } from 'mui-tel-input';

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
        lastName: string,
        phoneNumber: string
    }>();
    const { loading, error, signIn } = useSignIn();
    const { password, confirmPassword, email, phoneNumber } = formContext.watch();
    const { setOpenLoginModal } = useAuth();
    const [openEmailConfirmationModal, setOpenEmailConfirmationModal] = useState<boolean>(false);

    useEffect(() => {
        passwordValidation(formContext, password, 'password', confirmPassword, 'confirmPassword');
    }, [password, confirmPassword, formContext]);

    useEffect(() => {
        emailValidation(formContext, email, 'email');
    }, [email, formContext]);

    function handlePhoneNumberChange(value: string) {
        validatePhoneNumber(formContext, value);
    }

    function onSubmit() {
        if (!isFormInvalid()) {
            const { firstName, lastName } = trimValues(formContext.getValues());

            signIn({ email, password, firstName: firstName.trim(), lastName: lastName.trim(), phoneNumber })
                .then(() => {
                    formContext.reset();
                    setOpenEmailConfirmationModal(true);
                })
                .catch(() => {
                })
        }
    }

    function openLoginModal() {
        setOpenLoginModal(true);
        router.push('/');
    }

    function isFormInvalid(): boolean {
        return !password || !email || !!Object.keys(formContext.formState.errors).length;
    }

    function onCloseEmailModal() {
        setOpenEmailConfirmationModal(false);
        router.push('/');
    }

    return (
        <Box position="relative" display="flex" justifyContent="center">
            <Head>
                <title>Реєстрація {MAIN_NAME}</title>
            </Head>

            <Loading show={loading}></Loading>

            <Box p={2} m={2} border={1} borderColor={primaryLightColor} borderRadius={borderRadius}
                 sx={containerStyles}>
                <Box sx={authStyles.title} mb={2}>Реєстрація</Box>

                <FormContainer formContext={formContext} handleSubmit={formContext.handleSubmit(onSubmit)}>
                    <Box gap={2} display="flex" flexDirection="column">
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

                        <MuiTelInput value={phoneNumber}
                                     onChange={handlePhoneNumberChange}
                                     defaultCountry="UA"
                                     label="Номер телефону"
                                     error={!!formContext.formState.errors.phoneNumber}
                                     fullWidth/>

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

            <CustomModal open={openEmailConfirmationModal} onClose={() => onCloseEmailModal()}>
                <Box textAlign="center" display="flex" flexDirection="column" alignItems="center" gap={1}>
                    <Box sx={{ width: '50px', height: '50px' }}>
                        <CustomImage imageLink="/sent_email.png"/>
                    </Box>
                    <Box>Дякуємо за реєстрацію!</Box>
                    На вказану Вами ел. пошту був надісланий лист для підтвердження.
                    Будь ласка, активуйте свій профіль для закінчення реєстрації.
                </Box>
            </CustomModal>
        </Box>
    );
}
