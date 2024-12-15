import { Box, Button } from '@mui/material';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ErrorNotification from '@/components/error-notification';
import Loading from '@/components/loading';
import React from 'react';
import { useAuth } from '@/components/auth-context';
import { MAIN_NAME } from '@/constants/main-name';
import { useActivateUser } from '@/lib/graphql/queries/auth/hook';
import CustomImage from '@/components/custom-image';

const imageBoxStyles = {
    width: '150px',
    height: '150px',
    opacity: 0.5
};

export default function ActivationPage() {
    const router = useRouter();
    const { loading, error } = useActivateUser(router.query.token as string);
    const { setOpenLoginModal, user } = useAuth();

    function onLoginClick() {
        setOpenLoginModal(true);
        router.push('/');
    }

    return (
        <Box position="relative" display="flex" justifyContent="center">
            <Head>
                <title>Підтвердження ел. адреси {MAIN_NAME}</title>
            </Head>

            <Loading show={loading}></Loading>

            {!loading &&
              <Box display="flex" gap={2} justifyContent="center" flexDirection="column" alignItems="center">
                <Box sx={imageBoxStyles}>
                  <CustomImage imageLink="/success.png"></CustomImage>
                </Box>

                <Box>Ваша ел. адреса успішно підтверджена!</Box>

                  {!user ?
                      <Button variant="outlined" onClick={() => onLoginClick()}>
                          Увійти в аккаунт</Button> :
                      <Button variant="outlined" onClick={() => router.push('/')}>До вибору книг</Button>
                  }
              </Box>}

            {error && <ErrorNotification error={error}></ErrorNotification>}
        </Box>
    );
}
