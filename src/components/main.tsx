import { Box, Toolbar } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react';
import { fullHeight, pageStyles, styleVariables } from '@/constants/styles-variables';
import CustomToolbar from '@/components/custom-toolbar';
import { useUser } from '@/lib/graphql/queries/auth/hook';
import Loading from '@/components/loading';
import { useAuth } from '@/components/auth-context';
import { UserEntity } from '@/lib/data/types';
import { isAdmin } from '@/utils/utils';

const authUrls = ['/sign-in'];
const commonUrls = ['/books', '/books/details'];

export default function Main({ children }) {
    const [loading, setLoading] = useState<boolean>(false);
    const { fetchUser } = useUser();
    const { user, logout, setUser } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        setLoading(true);
        fetchUser()
            .then((user: UserEntity) => {
                setUser(user);
                setLoading(false);
                if (!isAdmin(user) && isSettings() || authUrls.some(url => url === pathname)) {
                    router.push('/');
                }
            })
            .catch(() => {
                setLoading(false);
                logout();
                if (![...authUrls, ...commonUrls].some(url => pathname === url)) {
                    router.push('/');
                }
            });
    }, []);

    function isSettings() {
        return pathname.includes('/settings');
    }

    return (
        <Box sx={fullHeight} position="relative">
            <Loading show={loading}></Loading>

            <CustomToolbar/>
            {!loading && (!isSettings() || !!user && isAdmin(user)) &&
              <>
                <Toolbar/>
                <Box sx={styleVariables.overflowHidden}>
                  <Box sx={pageStyles} position="relative" px={{ lg: '15%', md: '5%', xs: 1 }} pt={1}>
                      {children}
                  </Box>
                </Box>
              </>}
        </Box>
    );
}
