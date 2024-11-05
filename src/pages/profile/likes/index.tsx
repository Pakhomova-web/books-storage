import { Box, Grid } from '@mui/material';
import { useRouter } from 'next/router';

import { positionRelative, styleVariables } from '@/constants/styles-variables';
import Loading from '@/components/loading';
import BooksList from '@/components/books-list';
import { useAuth } from '@/components/auth-context';
import ErrorNotification from '@/components/error-notification';
import { BookEntity } from '@/lib/data/types';
import { useBooksByIds } from '@/lib/graphql/queries/book/hook';
import React, { useEffect } from 'react';
import ProfileMenu from '@/pages/profile/profile-menu';
import { getParamsQueryString } from '@/utils/utils';
import CustomImage from '@/components/custom-image';

const emptyListImageBoxStyles = {
    width: '100px',
    height: '100px',
    opacity: 0.2
};

export default function Likes() {
    const router = useRouter();
    const { user } = useAuth();
    const { loading, error, items, refetch } = useBooksByIds(user?.likedBookIds);

    useEffect(() => {
        refetch();
    }, [user]);

    function onBookClick(book: BookEntity) {
        router.push(`/books/details?${getParamsQueryString({ id: book.id, pageUrl: '/profile/likes' })}`);
    }

    return (
        <ProfileMenu activeUrl="likes">
            <Box sx={positionRelative} py={loading && !items?.length ? 3 : 0}>
                <Loading show={loading}></Loading>

                <Grid container spacing={2} p={1}>
                    <BooksList items={items} onClick={onBookClick}></BooksList>
                </Grid>

                {!items?.length &&
                  <Grid item display="flex" width="100%" alignItems="center" flexDirection="column">
                    <Box sx={emptyListImageBoxStyles} mb={2}>
                      <CustomImage imageLink="/liked_books.png"></CustomImage>
                    </Box>
                    <Box sx={styleVariables.titleFontSize}>Список вподобаних книг поки пустий</Box>
                  </Grid>}

                {error && <ErrorNotification error={error}></ErrorNotification>}
            </Box>
        </ProfileMenu>
    );
}
