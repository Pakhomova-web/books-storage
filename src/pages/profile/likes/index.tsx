import { Box, Grid } from '@mui/material';
import { useRouter } from 'next/router';

import { positionRelative } from '@/constants/styles-variables';
import Loading from '@/components/loading';
import BooksList from '@/components/books-list';
import { useAuth } from '@/components/auth-context';
import ErrorNotification from '@/components/error-notification';
import { BookEntity } from '@/lib/data/types';
import { useBooksByIds } from '@/lib/graphql/queries/book/hook';
import { useEffect } from 'react';
import ProfileMenu from '@/pages/profile/profile-menu';

export default function Likes() {
    const router = useRouter();
    const { user } = useAuth();
    const { loading, error, items, refetch } = useBooksByIds(user?.likedBookIds);

    useEffect(() => {
        refetch();
    }, [user]);

    function onBookClick(book: BookEntity) {
        router.push(`/books/details?id=${book.id}`);
    }

    return (
        <ProfileMenu activeUrl="likes">
            <Box sx={positionRelative} py={loading && !items?.length ? 3 : 0}>
                <Loading show={loading}></Loading>

                <Grid container spacing={2} p={1}>
                    <BooksList items={items} onClick={onBookClick}></BooksList>
                </Grid>

                {error && <ErrorNotification error={error}></ErrorNotification>}
            </Box>
        </ProfileMenu>
    );
}
