import { Button, Grid, Table, TableFooter, TablePagination, TableRow } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Loading from '@/components/loading';
import BooksList from '@/components/books/books-list';
import { useAuth } from '@/components/auth-context';
import ErrorNotification from '@/components/error-notification';
import { useBooksByIds } from '@/lib/graphql/queries/book/hook';
import ProfileMenu from '@/pages/profile/profile-menu';
import Head from 'next/head';
import IconWithText from '@/components/icon-with-text';
import { styleVariables } from '@/constants/styles-variables';
import { IPageable } from '@/lib/data/types';

export default function Likes() {
    const { user } = useAuth();
    const router = useRouter();
    const [pageSettings, setPageSettings] = useState<IPageable>({ page: 0, rowsPerPage: 12 });
    const { loading, error, items, totalCount, refetch } = useBooksByIds(user?.likedBookIds, pageSettings);

    useEffect(() => {
        refetch();
    }, [user]);

    function onPageChange(val: number) {
        setPageSettings({
            ...pageSettings,
            page: val
        });
    }

    function onRowsPerPageChange(val: number) {
        setPageSettings({
            ...pageSettings,
            page: 0,
            rowsPerPage: val
        });
    }

    return (
        <ProfileMenu activeUrl="likes">
            <Head>
                <title>Профіль - Обрані книжки</title>
            </Head>

            <Loading show={loading}></Loading>

            <Grid container spacing={2} p={1}>
                <BooksList items={items || []} pageUrl="/profile/likes"></BooksList>
            </Grid>

            {(loading || !!items.length) && <Table>
              <TableFooter>
                <TableRow>
                  <TablePagination rowsPerPageOptions={[6, 12]}
                                   count={totalCount}
                                   page={pageSettings.page}
                                   sx={styleVariables.paginatorStyles}
                                   labelRowsPerPage="Кільк. на сторінці"
                                   rowsPerPage={pageSettings.rowsPerPage}
                                   onPageChange={(_e, val: number) => onPageChange(val)}
                                   onRowsPerPageChange={({ target }) => onRowsPerPageChange(Number(target.value))}/>
                </TableRow>
              </TableFooter>
            </Table>}

            {!loading && !items?.length &&
              <Grid item display="flex" width="100%" alignItems="center" flexDirection="column">
                <IconWithText imageLink="/liked_books.png" text="Список вподобаних книг поки пустий"/>
                <Button variant="outlined" onClick={() => router.push('/')}>
                  До вибору книг
                </Button>
              </Grid>}

            {error && <ErrorNotification error={error}></ErrorNotification>}
        </ProfileMenu>
    );
}
