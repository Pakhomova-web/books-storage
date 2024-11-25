import { Box, Toolbar, Tooltip } from '@mui/material';
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
import CustomImage from '@/components/custom-image';
import { styled } from '@mui/material/styles';

const authUrls = ['/sign-in'];
const commonUrls = ['/books', '/books/details'];

const StyledDiscountBox = styled(Box)(({ theme }) => ({
    position: 'fixed',
    bottom: '15px',
    borderRadius: '50%',
    color: 'white',
    cursor: 'pointer',
    textAlign: 'center',
    [theme.breakpoints.up('lg')]: {
        height: '90px'
    },
    [theme.breakpoints.down('lg')]: {
        height: '75px'
    },
    [theme.breakpoints.down('md')]: {
        height: '60px'
    }
}));

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

                      {!isSettings() && <Tooltip title="Знижки від 30%">
                        <StyledDiscountBox left={{ lg: '10%', xs: '10px' }}
                                           height={{ lg: '90px', md: '75px', xs: '60px' }}
                                           onClick={() => router.push('/books?withDiscount=true')}>
                          <CustomImage imageLink="discount_icon.png"/>
                        </StyledDiscountBox>
                      </Tooltip>}
                  </Box>
                </Box>
              </>}
        </Box>
    );
}
