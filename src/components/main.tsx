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

const authUrls = ['/sign-in'];
const commonUrls = ['/books', '/books/details'];

export default function Main({ children }) {
    const [loading, setLoading] = useState<boolean>(false);
    const { fetchUser } = useUser();
    const { logout, setUser } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        setLoading(true);
        fetchUser()
            .then((user: UserEntity) => {
                setUser(user);
                setLoading(false);
                if (authUrls.some(url => url === pathname)) {
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

    return (
        <Box sx={fullHeight} position="relative">
            <Loading show={loading}></Loading>

            <CustomToolbar/>
            {!loading &&
              <>
                <Toolbar/>
                <Box sx={styleVariables.overflowHidden}>
                    <Box sx={pageStyles} position="relative" padding={{ lg: '0 15%', md: '0 10%', xs: 0 }}>
                        {children}
                    </Box>
                </Box>
              </>}
        </Box>
    );
}
