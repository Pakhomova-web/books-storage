import { useAuth } from '@/components/auth-context';
import { FormContainer, useForm } from 'react-hook-form-mui';
import CustomTextField from '@/components/form-fields/custom-text-field';
import { Box, Button, Grid } from '@mui/material';
import { positionRelative, styleVariables } from '@/constants/styles-variables';
import Loading from '@/components/loading';
import React from 'react';
import { useCurrentUser } from '@/lib/graphql/hooks';
import ErrorNotification from '@/components/error-notification';

export default function Profile() {
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

    return (user &&
      <Box sx={positionRelative}>
        <Loading show={updating}></Loading>

        <FormContainer formContext={formContext} handleSubmit={formContext.handleSubmit(onSubmit)}>
          <Grid container sx={{ p: styleVariables.doublePadding }} spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <CustomTextField name="email" required label="Email" fullWidth/>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <CustomTextField name="firstName" label="First Name" fullWidth/>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <CustomTextField name="lastName" label="Last Name" fullWidth/>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <CustomTextField name="role" required label="Role" disabled fullWidth/>
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
    );
}
