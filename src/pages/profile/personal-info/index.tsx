import { FormContainer, useForm } from 'react-hook-form-mui';
import { Box, Button, Grid, RadioGroup } from '@mui/material';
import React, { useEffect } from 'react';
import Head from 'next/head';
import { MuiTelInput } from 'mui-tel-input';

import { useAuth } from '@/components/auth-context';
import CustomTextField from '@/components/form-fields/custom-text-field';
import { styleVariables } from '@/constants/styles-variables';
import Loading from '@/components/loading';
import { useChangePassword, useCurrentUser } from '@/lib/graphql/queries/auth/hook';
import ErrorNotification from '@/components/error-notification';
import ProfileMenu from '@/pages/profile/profile-menu';
import { useDeliveries } from '@/lib/graphql/queries/delivery/hook';
import { UserEntity } from '@/lib/data/types';
import DeliveryRadioOption from '@/components/form-fields/delivery-radio-option';
import CustomPasswordElement from '@/components/form-fields/custom-password-element';
import { passwordValidation, validatePhoneNumber } from '@/utils/utils';

export default function PersonalInfo() {
    const { user, setUser } = useAuth();
    const passwordFormContext = useForm<{ oldPassword: string, newPassword: string, confirmPassword: string }>();
    const formContext = useForm({
        defaultValues: {
            id: user?.id,
            email: user?.email,
            firstName: user?.firstName,
            lastName: user?.lastName,
            phoneNumber: user?.phoneNumber,
            region: user?.region,
            district: user?.district,
            city: user?.city,
            novaPostOffice: user?.novaPostOffice,
            postcode: user?.postcode,
            preferredDeliveryId: user?.preferredDeliveryId,
            instagramUsername: user?.instagramUsername
        }
    });
    const { updating, update, updatingError } = useCurrentUser();
    const { changingPassword, changePassword, changingPasswordError } = useChangePassword();
    const { items: deliveries, loading: loadingDeliveries } = useDeliveries();
    const { phoneNumber } = formContext.watch();
    const { oldPassword, newPassword, confirmPassword } = passwordFormContext.watch();

    function onSubmit() {
        update(formContext.getValues())
            .then(user => setUser(new UserEntity(user)))
            .catch(() => {
            });
    }

    function onChangePassword() {
        changePassword(oldPassword, newPassword)
            .then(() => passwordFormContext.reset())
            .catch(() => {
            });
    }

    useEffect(() => {
        passwordValidation(passwordFormContext, newPassword, 'newPassword', confirmPassword, 'confirmPassword');
    }, [newPassword, confirmPassword, passwordFormContext]);

    useEffect(() => {
        passwordValidation(passwordFormContext, oldPassword, 'oldPassword');
    }, [oldPassword, passwordFormContext]);

    function isPasswordFormInvalid() {
        return !oldPassword || !newPassword || !confirmPassword ||
            !!passwordFormContext.formState.errors.newPassword ||
            !!passwordFormContext.formState.errors.oldPassword ||
            !!passwordFormContext.formState.errors.confirmPassword;
    }

    function handlePhoneNumberChange(value: string) {
        validatePhoneNumber(formContext, value);
    }

    function isFormInvalid() {
        return Object.keys(formContext.formState.errors).some(key => !!formContext.formState.errors[key]);
    }

    return (
        <ProfileMenu activeUrl="personal-info">
            <Head>
                <title>Профіль - Персональні дані</title>
            </Head>

            <Loading show={updating || loadingDeliveries || changingPassword}></Loading>

            <FormContainer formContext={formContext} handleSubmit={formContext.handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Box sx={styleVariables.sectionTitle}>Основна інформація</Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <CustomTextField name="lastName" label="Прізвище" fullWidth/>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <CustomTextField name="firstName" label="Ім'я" fullWidth/>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <MuiTelInput value={phoneNumber}
                                     required={true}
                                     onChange={handlePhoneNumberChange}
                                     label="Номер телефону"
                                     error={!!formContext.formState.errors.phoneNumber}
                                     fullWidth/>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <CustomTextField name="email" required label="Ел. адреса" disabled fullWidth/>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <CustomTextField name="instagramUsername" label="Нікнейм в інстаграм для зв'язку"
                                         fullWidth/>
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={styleVariables.sectionTitle}>Адреса</Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <CustomTextField name="region" label="Область" fullWidth/>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <CustomTextField name="district" label="Район" fullWidth/>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <CustomTextField name="city" label="Місто" fullWidth/>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <CustomTextField name="novaPostOffice"
                                         label="№ відділення/поштомату"
                                         type="number"
                                         fullWidth/>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <CustomTextField name="postcode" type="number" label="Індекс" fullWidth/>
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={styleVariables.sectionTitle}>Спосіб доставки</Box>

                        <RadioGroup defaultValue={user?.preferredDeliveryId}
                                    onChange={(_, value) => formContext.setValue('preferredDeliveryId', value)}>
                            <Grid container spacing={2}>
                                {deliveries.map((delivery, index) => (
                                    <Grid key={index} item xs={12} sm={6} pl={2}>
                                        <Box p={1}>
                                            <DeliveryRadioOption option={delivery}/>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </RadioGroup>
                    </Grid>
                </Grid>

                {updatingError && <ErrorNotification error={updatingError}></ErrorNotification>}

                <Box sx={styleVariables.buttonsContainer}>
                    <Button variant="contained" type="submit" disabled={isFormInvalid()}>
                        Зберегти
                    </Button>
                </Box>
            </FormContainer>

            <FormContainer formContext={passwordFormContext} handleSubmit={formContext.handleSubmit(onChangePassword)}>
                <Grid container spacing={2} mb={3} mt={1}>
                    <Grid item xs={12}>
                        <Box sx={styleVariables.sectionTitle}>Зміна пароля</Box>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <CustomPasswordElement name="oldPassword" required label="Поточний пароль" fullWidth/>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <CustomPasswordElement name="newPassword" required disabled={!oldPassword} label="Новий пароль"
                                               fullWidth/>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <CustomPasswordElement name="confirmPassword" required disabled={!oldPassword}
                                               label="Підтвердити пароль" fullWidth/>
                    </Grid>

                    {changingPasswordError && <ErrorNotification error={changingPasswordError}></ErrorNotification>}

                    <Grid item xs={12} display="flex" justifyContent="center">
                        <Button variant="contained" type="submit" disabled={isPasswordFormInvalid()}>
                            Змінити
                        </Button>
                    </Grid>
                </Grid>
            </FormContainer>
        </ProfileMenu>
    );
}
