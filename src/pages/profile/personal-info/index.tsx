import { useAuth } from '@/components/auth-context';
import { FormContainer, useForm } from 'react-hook-form-mui';
import CustomTextField from '@/components/form-fields/custom-text-field';
import { Box, Button, Grid } from '@mui/material';
import { positionRelative, primaryLightColor, styleVariables } from '@/constants/styles-variables';
import Loading from '@/components/loading';
import React from 'react';
import { useCurrentUser } from '@/lib/graphql/queries/auth/hook';
import ErrorNotification from '@/components/error-notification';
import ProfileMenu from '@/pages/profile/profile-menu';

export default function PersonalInfo() {
    const { user } = useAuth();
    const formContext = useForm({
        defaultValues: {
            id: user?.id,
            email: user?.email,
            firstName: user?.firstName,
            lastName: user?.lastName,
            role: user?.role
        }
    });
    const { updating, update, updatingError } = useCurrentUser();

    async function onSubmit() {
        try {
            await update(formContext.getValues());
        } catch (err) {
        }
    }

    return (
        <ProfileMenu activeUrl="personal-info">
            {user &&
              <Box sx={positionRelative}>
                <Loading show={updating}></Loading>

                <FormContainer formContext={formContext} handleSubmit={formContext.handleSubmit(onSubmit)}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <CustomTextField name="email" required label="Ел. адреса" fullWidth/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <CustomTextField name="firstName" label="Ім'я" fullWidth/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <CustomTextField name="lastName" label="Прізвище" fullWidth/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <CustomTextField name="role" required label="Роль" disabled fullWidth/>
                    </Grid>
                  </Grid>

                    {updatingError && <ErrorNotification error={updatingError}></ErrorNotification>}

                  <Box sx={styleVariables.buttonsContainer}>
                    <Button variant="contained" type="submit" disabled={!formContext.formState.isValid}>
                      Save
                    </Button>
                  </Box>
                </FormContainer>
              </Box>
            }
        </ProfileMenu>
    );
}
