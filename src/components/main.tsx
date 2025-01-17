import { Box, Toolbar, Tooltip, useTheme } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { fullHeight, pageStyles, styleVariables } from '@/constants/styles-variables';
import CustomToolbar from '@/components/custom-toolbar';
import { useUser } from '@/lib/graphql/queries/auth/hook';
import { useAuth } from '@/components/auth-context';
import Loading from '@/components/loading';
import { UkrPoshtaWarehouse, UserEntity } from '@/lib/data/types';
import { isAdmin } from '@/utils/utils';
import TopSoldBooks from '@/components/books/top-sold-books';
import { getDeliveryOptions, getUkrPoshtaWarehouses } from '@/lib/graphql/queries/delivery/hook';
import Head from 'next/head';

const authUrls = ['/sign-in', '/reset-password', '/activation'];
const commonUrls = ['/books', '/publishing-houses', '/sitemap.xml', '/about-us'];

const StyledDiscountBox = styled(Box)(({ theme }) => ({
    position: 'fixed',
    bottom: '15px',
    right: '15px',
    cursor: 'pointer',
    [theme.breakpoints.up('lg')]: {
        height: '90px'
    },
    [theme.breakpoints.down('lg')]: {
        height: '75px'
    },
    [theme.breakpoints.down('md')]: {
        height: '55px'
    }
}));

export default function Main({ children }) {
    const [loading, setLoading] = useState<boolean>(false);
    const { fetchUser } = useUser();
    const { user, logout, setUser, setDeliveries, deliveries, setUkrPoshtaWarehouses, ukrPoshtaWarehouses } = useAuth();
    const theme = useTheme();
    const mobileMatches = useMediaQuery(theme.breakpoints.down('lg'));
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!deliveries?.length) {
            getDeliveryOptions().then(items => setDeliveries(items));
        }
        if (!ukrPoshtaWarehouses?.length) {
            getUkrPoshtaWarehouses()
                .then(res => setUkrPoshtaWarehouses(res.map(d => new UkrPoshtaWarehouse(d))))
                .catch(() => {
                });
        }

        setLoading(true);
        fetchUser()
            .then((user: UserEntity) => {
                setUser(user);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
                logout();
                if (pathname) {
                    if (![...authUrls, ...commonUrls].some(url => pathname.includes(url))) {
                        router.push('/');
                    }
                }
            });
    }, []);

    useEffect(() => {
        if (pathname) {
            if (!user) {
                if (![...authUrls, ...commonUrls].some(url => pathname.includes(url))) {
                    router.push('/');
                }
            } else if (!isAdmin(user) && isSettings() || authUrls.some(url => url === pathname)) {
                router.push('/');
            }
        }
    }, [pathname, user]);

    function isSettings() {
        return pathname?.includes('/settings');
    }

    return (
        <Box sx={fullHeight} position="relative">
            <Head>
                <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="16x16"/>
                <link rel="apple-touch-icon" href="/favicon.ico" type="image/x-icon" sizes="32x32"/>
                <meta http-equiv="content-language" content="uk"/>
            </Head>
            <Loading show={loading}></Loading>

            {!mobileMatches && <TopSoldBooks/>}

            <CustomToolbar/>
            {!loading && (!isSettings() || !!user && isAdmin(user)) &&
              <>
                <Toolbar/>
                <Box sx={styleVariables.overflowHidden}>
                  <Box sx={pageStyles} px={{ lg: '15%', md: '5%', xs: 1 }} pt={1}>
                      {mobileMatches && <TopSoldBooks mobile={true}/>}

                    <Box position="relative">{children}</Box>
                  </Box>
                </Box>
              </>}

            {!isSettings() &&
              <StyledDiscountBox onClick={() => router.push('/books?withDiscount=true')}>
                <Tooltip title="Знижки від 30%">
                  <img alt="Image" height="100%" src="/discount_icon.png"/>
                </Tooltip>
              </StyledDiscountBox>}
        </Box>
    );
}
