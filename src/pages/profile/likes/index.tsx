import { Box, Button, Grid } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { styleVariables } from '@/constants/styles-variables';
import Loading from '@/components/loading';
import BooksList from '@/components/books-list';
import { useAuth } from '@/components/auth-context';
import ErrorNotification from '@/components/error-notification';
import { useBooksByIds } from '@/lib/graphql/queries/book/hook';
import ProfileMenu from '@/pages/profile/profile-menu';
import CustomImage from '@/components/custom-image';

const emptyListImageBoxStyles = {
    width: '100px',
    height: '100px',
    opacity: 0.2
};

export default function Likes() {
    const { user } = useAuth();
    const router = useRouter();
    const { loading, error, items, refetch } = useBooksByIds(user?.likedBookIds);

    useEffect(() => {
        refetch();
    }, [user]);

    return (
        <ProfileMenu activeUrl="likes">
            <Loading show={loading}></Loading>

            <Grid container spacing={2} p={1}>
                <BooksList items={items} pageUrl="/profile/likes"></BooksList>
            </Grid>

            {!loading && !items?.length &&
              <Grid item display="flex" width="100%" alignItems="center" flexDirection="column">
                <Box sx={emptyListImageBoxStyles} mb={2}>
                  <CustomImage imageLink="/liked_books.png"></CustomImage>
                </Box>
                <Box sx={styleVariables.titleFontSize} mb={2}>Список вподобаних книг поки пустий</Box>
                <Button variant="outlined" onClick={() => router.push('/')}>
                  До вибору книг
                </Button>
              </Grid>}

            {error && <ErrorNotification error={error}></ErrorNotification>}
        </ProfileMenu>
    );
}
