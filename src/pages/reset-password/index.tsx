import { Box, Button } from '@mui/material';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { authStyles } from '@/styles/auth';
import { borderRadius, primaryLightColor } from '@/constants/styles-variables';
import ErrorNotification from '@/components/error-notification';
import Loading from '@/components/loading';
import React, { useEffect } from 'react';
import CustomPasswordElement from '@/components/form-fields/custom-password-element';
import { useAuth } from '@/components/auth-context';
import { MAIN_NAME } from '@/constants/main-name';
import { useChangePasswordByToken, useCheckResetPasswordToken } from '@/lib/graphql/queries/auth/hook';
import { passwordValidation } from '@/utils/utils';

const containerStyles = {
    width: '400px',
    maxWidth: '85vw'
};

export default function ResetPassword() {
    const router = useRouter();
    const formContext = useForm<{
        password: string,
        confirmPassword: string
    }>();
    const { loading, error, changePassword } = useChangePasswordByToken();
    const {
        loading: checkingToken,
        error: failedToken
    } = useCheckResetPasswordToken(router.query.id as string, router.query.token as string);
    const { password, confirmPassword } = formContext.watch();
    const { setOpenLoginModal } = useAuth();

    useEffect(() => {
        passwordValidation(formContext, password, 'password', confirmPassword, 'confirmPassword');
    }, [password, confirmPassword, formContext]);

    function onSubmit() {
        if (!isFormInvalid()) {
            const { password } = formContext.getValues();

            changePassword(router.query.id as string, password)
                .then(() => {
                    formContext.reset();
                    setOpenLoginModal(true);
                    router.push('/');
                })
                .catch(() => {
                })
        }
    }

    function isFormInvalid(): boolean {
        return loading || checkingToken || !!failedToken || !password || !confirmPassword || !!Object.keys(formContext.formState.errors).length;
    }

    return (
        <Box position="relative" display="flex" justifyContent="center">
            <Head>
                <title>Відновлення паролю {MAIN_NAME}</title>
            </Head>

            <Loading show={loading || checkingToken}></Loading>

            <Box p={2} m={2} border={1} borderColor={primaryLightColor} borderRadius={borderRadius}
                 sx={containerStyles}>
                <Box sx={authStyles.title} mb={2}>Відновлення паролю</Box>

                <FormContainer formContext={formContext} handleSubmit={formContext.handleSubmit(onSubmit)}>
                    <Box gap={1} display="flex" flexDirection="column">
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

                        <Button variant="contained"
                                fullWidth
                                disabled={isFormInvalid()}
                                onClick={onSubmit}>
                            Змінити пароль
                        </Button>
                    </Box>
                </FormContainer>

                {error && <ErrorNotification error={error}></ErrorNotification>}
                {failedToken && <ErrorNotification error={failedToken}></ErrorNotification>}
            </Box>
        </Box>
    );
}
