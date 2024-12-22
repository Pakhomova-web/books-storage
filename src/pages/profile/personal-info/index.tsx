import { FormContainer, useForm } from 'react-hook-form-mui';
import { Box, Button, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { MuiTelInput } from 'mui-tel-input';
import { ApolloError } from '@apollo/client';

import { useAuth } from '@/components/auth-context';
import CustomTextField from '@/components/form-fields/custom-text-field';
import { primaryLightColor, styleVariables } from '@/constants/styles-variables';
import Loading from '@/components/loading';
import { sendActivationLinkToUser, useChangePassword, useCurrentUser } from '@/lib/graphql/queries/auth/hook';
import ErrorNotification from '@/components/error-notification';
import ProfileMenu from '@/pages/profile/profile-menu';
import {
    NovaPoshtaSettlementEntity,
    NovaPoshtaStreetEntity,
    NovaPoshtaWarehouseEntity,
    UkrPoshtaWarehouse,
    UserEntity
} from '@/lib/data/types';
import CustomPasswordElement from '@/components/form-fields/custom-password-element';
import { passwordValidation, trimValues, validatePhoneNumber } from '@/utils/utils';
import CustomLink from '@/components/custom-link';
import CustomImage from '@/components/custom-image';
import CustomModal from '@/components/modals/custom-modal';
import WarehouseAutocompleteField from '@/components/form-fields/warehouses-autocomplete-field';
import StreetAutocompleteField from '@/components/form-fields/street-autocomplete-field';
import SettlementAutocompleteField from '@/components/form-fields/settlement-autocomplete-field';
import UkrPoshtaWarehouseAutocompleteField from '@/components/form-fields/ukrposhta-warehouse-autocomplete-field';

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
            instagramUsername: user?.instagramUsername,
            novaPoshtaWarehouseCityRef: '',
            novaPoshtaWarehouseCity: user?.novaPoshtaWarehouseAddress?.city,
            novaPoshtaWarehouseRegion: user?.novaPoshtaWarehouseAddress?.region,
            novaPoshtaWarehouseDistrict: user?.novaPoshtaWarehouseAddress?.district,
            novaPoshtaWarehouse: user?.novaPoshtaWarehouseAddress?.warehouse,
            novaPoshtaCourierCity: user?.novaPoshtaCourierAddress?.city,
            novaPoshtaCourierRegion: user?.novaPoshtaCourierAddress?.region,
            novaPoshtaCourierDistrict: user?.novaPoshtaCourierAddress?.district,
            novaPoshtaCourierStreet: user?.novaPoshtaCourierAddress?.street,
            novaPoshtaCourierHouse: user?.novaPoshtaCourierAddress?.house,
            novaPoshtaCourierFlat: user?.novaPoshtaCourierAddress?.flat,
            novaPoshtaCourierCityRef: '',
            city: user?.ukrPoshtaWarehouseAddress?.city,
            region: user?.ukrPoshtaWarehouseAddress?.region,
            district: user?.ukrPoshtaWarehouseAddress?.district,
            warehouse: user?.ukrPoshtaWarehouseAddress?.warehouse
        }
    });
    const { updating, update, updatingError } = useCurrentUser();
    const { changingPassword, changePassword, changingPasswordError } = useChangePassword();
    const {
        phoneNumber,
        novaPoshtaWarehouseCityRef,
        novaPoshtaWarehouseRegion,
        novaPoshtaWarehouseDistrict,
        novaPoshtaWarehouseCity,
        novaPoshtaWarehouse,
        novaPoshtaCourierCity,
        novaPoshtaCourierRegion,
        novaPoshtaCourierDistrict,
        novaPoshtaCourierCityRef,
        novaPoshtaCourierStreet
    } = formContext.watch();
    const { oldPassword, newPassword, confirmPassword } = passwordFormContext.watch();
    const [loading, setLoading] = useState<boolean>(false);
    const [sentActivationLinkModal, setSentActivationLinkModal] = useState<boolean>(false);
    const [error, setError] = useState<ApolloError>();

    function onSubmit() {
        const {
            id,
            phoneNumber,
            firstName,
            lastName,
            instagramUsername,
            novaPoshtaWarehouseCity,
            novaPoshtaWarehouseRegion,
            novaPoshtaWarehouseDistrict,
            novaPoshtaCourierHouse,
            novaPoshtaCourierFlat,
            city,
            district,
            region,
            warehouse
        } = trimValues(formContext.getValues());

        update({
            id,
            phoneNumber,
            firstName,
            lastName,
            instagramUsername,
            novaPoshtaWarehouseAddress: {
                city: novaPoshtaWarehouseCity,
                region: novaPoshtaWarehouseRegion,
                district: novaPoshtaWarehouseDistrict,
                warehouse: novaPoshtaWarehouse
            },
            novaPoshtaCourierAddress: {
                city: novaPoshtaCourierCity,
                region: novaPoshtaCourierRegion,
                district: novaPoshtaCourierDistrict,
                street: novaPoshtaCourierStreet,
                house: novaPoshtaCourierHouse,
                flat: novaPoshtaCourierFlat
            },
            ukrPoshtaWarehouseAddress: {
                city,
                district,
                region,
                warehouse
            }
        })
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

    useEffect(() => {
        setError(null);
    }, [formContext, passwordFormContext]);

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

    function onSendActivationLink() {
        setLoading(true);
        setError(null);
        sendActivationLinkToUser().then(() => {
            setLoading(false);
            setSentActivationLinkModal(true);
        }).catch(err => {
            setLoading(false);
            setError(err);
        });
    }

    function onNovaPoshtaSettlementSelect(val: NovaPoshtaSettlementEntity, refreshData = false) {
        if (refreshData) {
            formContext.setValue('novaPoshtaWarehouseCity', val?.city || '');
            formContext.setValue('novaPoshtaWarehouseRegion', val?.region || '');
            formContext.setValue('novaPoshtaWarehouseDistrict', val?.district || '');
            if (!val) {
                formContext.setValue('novaPoshtaWarehouse', null);
            }
        }
        formContext.setValue('novaPoshtaWarehouseCityRef', val?.ref || '');
    }

    function onNovaPoshtaCourierCitySelect(val: NovaPoshtaSettlementEntity, refreshData = false) {
        if (refreshData) {
            formContext.setValue('novaPoshtaCourierCity', val?.city || '');
            formContext.setValue('novaPoshtaCourierRegion', val?.region || '');
            formContext.setValue('novaPoshtaCourierDistrict', val?.district || '');
            if (!val) {
                formContext.setValue('novaPoshtaCourierStreet', null);
            }
        }
        formContext.setValue('novaPoshtaCourierCityRef', val?.ref || '');
    }

    function onNovaPoshtaCourierStreetSelect(val: NovaPoshtaStreetEntity, refreshData = false) {
        if (refreshData) {
            formContext.setValue('novaPoshtaCourierStreet', val?.description);
        }
    }

    function onNovaPoshtaWarehouseSelect(val: NovaPoshtaWarehouseEntity, refreshData = false) {
        if (refreshData) {
            formContext.setValue('novaPoshtaWarehouse', val?.number);
        }
    }

    function onUkrPoshtaWarehouseSelect(val: UkrPoshtaWarehouse) {
        if (val) {
            formContext.setValue('city', val?.city || '');
            formContext.setValue('region', val?.region || '');
            formContext.setValue('district', val?.district || '');
            formContext.setValue('warehouse', val?.warehouse);
        }
    }

    return (
        <ProfileMenu activeUrl="personal-info">
            <Head>
                <title>Профіль - Персональні дані</title>
            </Head>

            <Loading show={loading || updating || changingPassword}></Loading>

            {!user?.active &&
              <Box textAlign="center" my={2}>
                Для оформлення замовлення необхідно підтвердити ел. пошту.&nbsp;
                <CustomLink onClick={onSendActivationLink}>Надіслати лист для активації</CustomLink>
              </Box>}

            {error && <ErrorNotification error={error}/>}

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
                                     onChange={handlePhoneNumberChange}
                                     label="Номер телефону"
                                     defaultCountry="UA"
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
                        <Box sx={styleVariables.sectionTitle}>Адреси</Box>
                        <Box textAlign="center" mt={1}>
                            Ці адреси використовуються під час створення замовлення.
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Box borderBottom={1} borderColor={primaryLightColor} pb={1} mt={1}>
                            Нова пошта (відділення/поштомат)
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <SettlementAutocompleteField onSelect={onNovaPoshtaSettlementSelect}
                                                     city={novaPoshtaWarehouseCity}
                                                     region={novaPoshtaWarehouseRegion}
                                                     district={novaPoshtaWarehouseDistrict}/>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <WarehouseAutocompleteField settlementRef={novaPoshtaWarehouseCityRef}
                                                    warehouse={novaPoshtaWarehouse}
                                                    onSelect={onNovaPoshtaWarehouseSelect}/>
                    </Grid>

                    <Grid item xs={12}>
                        <Box borderBottom={1} borderColor={primaryLightColor} pb={1} mt={1}>
                            Нова пошта (адресна доставка до дверей)
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <SettlementAutocompleteField onSelect={onNovaPoshtaCourierCitySelect}
                                                     city={novaPoshtaCourierCity}
                                                     region={novaPoshtaCourierRegion}
                                                     district={novaPoshtaCourierDistrict}/>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <StreetAutocompleteField onSelect={onNovaPoshtaCourierStreetSelect}
                                                 settlementRef={novaPoshtaCourierCityRef}
                                                 street={novaPoshtaCourierStreet}/>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <CustomTextField name="novaPoshtaCourierHouse" label="Будинок" fullWidth/>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <CustomTextField name="novaPoshtaCourierFlat" label="Квартира" fullWidth/>
                    </Grid>

                    <Grid item xs={12}>
                        <Box borderBottom={1} borderColor={primaryLightColor} pb={1} mt={1}>
                            Укрпошта (відділення)
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <UkrPoshtaWarehouseAutocompleteField onSelect={onUkrPoshtaWarehouseSelect}/>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <CustomTextField name="region" label="Область" required={true} fullWidth/>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <CustomTextField name="district" label="Район" fullWidth/>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <CustomTextField name="city" label="Місто" required={true} fullWidth/>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <CustomTextField name="warehouse" label="Відділення (індекс)" required={true}
                                         fullWidth/>
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

            <CustomModal open={sentActivationLinkModal} onClose={() => setSentActivationLinkModal(false)}>
                <Box textAlign="center" display="flex" flexDirection="column" alignItems="center" gap={1}>
                    <Box sx={{ width: '50px', height: '50px' }}>
                        <CustomImage imageLink="/sent_email.png"/>
                    </Box>
                    На вказану Вами ел. пошту був надісланий лист для підтвердження.
                    Будь ласка, активуйте свій профіль для закінчення реєстрації.
                </Box>
            </CustomModal>
        </ProfileMenu>
    );
}
