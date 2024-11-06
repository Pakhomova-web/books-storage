import { Box, Toolbar } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react';
import { drawerWidth, fullHeight, positionRelative, styleVariables } from '@/constants/styles-variables';
import CustomToolbar from '@/components/custom-toolbar';
import { useUser } from '@/lib/graphql/queries/auth/hook';
import Loading from '@/components/loading';
import { useAuth } from '@/components/auth-context';
import { UserEntity } from '@/lib/data/types';

const settingMenuBackdrop = {
    width: '100vw',
    height: '100svh',
    background: styleVariables.gray,
    opacity: 0.5,
    position: 'absolute',
    top: 0,
    zIndex: 3
};

const authUrls = ['/sign-in'];
const commonUrls = ['/books', '/books/details'];

export default function Main({ children }) {
    const [loading, setLoading] = useState<boolean>(false);
    const { fetchUser } = useUser();
    const { logout, setUser } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [showSettingsMenu, setShowSettingsMenu] = useState<boolean>(false);
    const [attachedSettingsMenu, setAttachedSettingsMenu] = useState<boolean>(false);

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
                setShowSettingsMenu(false);
                setAttachedSettingsMenu(false);
                logout();
                if (![...authUrls, ...commonUrls].some(url => pathname === url)) {
                    router.push('/');
                }
            });
    }, []);

    function handleClickOutsideSettingsMenu(event) {
        event.stopPropagation();
        event.preventDefault();
        setShowSettingsMenu(false);
    }

    function changeDisplayingSettingsMenu({ show, attached }) {
        setAttachedSettingsMenu(attached);
        setShowSettingsMenu(show);
    }

    return (
        <Box sx={{ ...positionRelative, ...fullHeight }}>
            <Loading show={loading}></Loading>

            <CustomToolbar showSettingsMenu={showSettingsMenu}
                           attachedSettingsMenu={attachedSettingsMenu}
                           changeDisplayingSettings={changeDisplayingSettingsMenu}/>
            {!loading &&
              <>
                <Toolbar/>
                <Box sx={showSettingsMenu && attachedSettingsMenu ? { paddingLeft: `${drawerWidth}px` } : {}}>
                  <Box sx={styleVariables.overflowHidden}>{children}</Box>
                </Box>

                  {showSettingsMenu && !attachedSettingsMenu &&
                    <Box sx={settingMenuBackdrop} onClick={handleClickOutsideSettingsMenu}></Box>}
              </>}
        </Box>
    );
}
