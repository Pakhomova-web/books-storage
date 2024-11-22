import { useAuth } from '@/components/auth-context';
import { FormContainer, useForm } from 'react-hook-form-mui';
import CustomTextField from '@/components/form-fields/custom-text-field';
import { Box, Button, Grid, RadioGroup } from '@mui/material';
import { primaryLightColor, styleVariables } from '@/constants/styles-variables';
import Loading from '@/components/loading';
import React from 'react';
import { useCurrentUser } from '@/lib/graphql/queries/auth/hook';
import ErrorNotification from '@/components/error-notification';
import ProfileMenu from '@/pages/profile/profile-menu';
import { useDeliveries } from '@/lib/graphql/queries/delivery/hook';
import { UserEntity } from '@/lib/data/types';
import DeliveryRadioOption from '@/components/form-fields/delivery-radio-option';

export default function PersonalInfo() {
    const { user, setUser } = useAuth();
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
    const { items: deliveries, loading: loadingDeliveries } = useDeliveries();

    async function onSubmit() {
        update(formContext.getValues())
            .then(user => setUser(new UserEntity(user)))
            .catch(() => {
            });
    }

    return (
        <ProfileMenu activeUrl="personal-info">
            <Loading show={updating || loadingDeliveries}></Loading>

            <FormContainer formContext={formContext} handleSubmit={formContext.handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Box borderBottom={1} borderColor={primaryLightColor} sx={styleVariables.titleFontSize}
                             p={1}>
                            Основна інформація
                        </Box>
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
                        <CustomTextField name="phoneNumber" label="Номер телефону" fullWidth/>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <CustomTextField name="email" required label="Ел. адреса" disabled fullWidth/>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <CustomTextField name="instagramUsername" label="Нікнейм в інстаграм для зв'язку" fullWidth/>
                    </Grid>

                    <Grid item xs={12}>
                        <Box borderBottom={1} borderColor={primaryLightColor} sx={styleVariables.titleFontSize}
                             p={1}>
                            Адреса
                        </Box>
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
                        <Box borderBottom={1} borderColor={primaryLightColor} sx={styleVariables.titleFontSize}
                             p={1}>
                            Спосіб доставки
                        </Box>

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
                    <Button variant="contained" type="submit" disabled={!formContext.formState.isValid}>
                        Зберегти
                    </Button>
                </Box>
            </FormContainer>
        </ProfileMenu>
    );
}
