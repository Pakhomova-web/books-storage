import { Box, Toolbar, useTheme } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { drawerWidth, positionRelative, styleVariables } from '@/constants/styles-variables';
import CustomToolbar from '@/components/custom-toolbar';
import { useUser } from '@/lib/graphql/hooks';
import Loading from '@/components/loading';
import { useAuth } from '@/components/auth-context';
import { UserEntity } from '@/lib/data/types';
import SettingsMenu, { settingsList } from '@/components/settings-menu';
import { SettingListItem } from '@/components/types';

const settingMenuBackdrop = {
    width: '100vw',
    height: '100vh',
    background: styleVariables.gray,
    opacity: 0.5,
    position: 'absolute',
    top: 0,
    zIndex: 3
};

export default function Main({ children }) {
    const [loading, setLoading] = useState<boolean>(false);
    const { fetchUser } = useUser();
    const { logout, setUser } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [activeSettingsTab, setActiveSettingsTab] = useState<SettingListItem>();
    const [showSettingsMenu, setShowSettingsMenu] = useState<boolean>(false);
    const [attachedSettingsMenu, setAttachedSettingsMenu] = useState<boolean>(false);
    const theme = useTheme();
    const mobileMatches = useMediaQuery(theme.breakpoints.up('md'));

    useEffect(() => {
        setLoading(true);
        fetchUser()
            .then((user: UserEntity) => {
                setUser(user);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
                setShowSettingsMenu(false);
                setAttachedSettingsMenu(false);
                setActiveSettingsTab(null);
                logout();
                if (!(pathname.includes('login') || pathname.includes('sign-in'))) {
                    router.push('/');
                }
            });
    }, []);

    useEffect(() => {
        if (pathname.includes('settings')) {
            onSettingItemClick(settingsList.find(i => i.link === pathname.split('/settings/')[1]));
        } else {
            setActiveSettingsTab(null);
        }
    }, [pathname]);

    useEffect(() => {
        if (activeSettingsTab) {
            setAttachedSettingsMenu(mobileMatches);
            if (!attachedSettingsMenu) {
                setShowSettingsMenu(false);
            }
        }
    }, [mobileMatches]);

    function handleSettingsMenu() {
        if (showSettingsMenu) {
            setAttachedSettingsMenu(false);
            setShowSettingsMenu(false);
        } else {
            if (activeSettingsTab) {
                setAttachedSettingsMenu(mobileMatches);
            }
            setShowSettingsMenu(true);
        }
    }

    function handleClickOutsideSettingsMenu(event) {
        event.stopPropagation();
        event.preventDefault();
        setShowSettingsMenu(false);
    }

    function onSettingItemClick(item: SettingListItem) {
        if (!attachedSettingsMenu) {
            if (!mobileMatches) {
                setAttachedSettingsMenu(true);
                setShowSettingsMenu(true);
            } else {
                setShowSettingsMenu(false);
            }
        }
        setActiveSettingsTab(item);
    }

    return (
        <Box sx={positionRelative}>
            <Loading show={loading} fullHeight={true}></Loading>

            <CustomToolbar activeSettingsTab={activeSettingsTab}
                           onSettingsClick={handleSettingsMenu}/>
            {!loading &&
              <>
                  {(showSettingsMenu || attachedSettingsMenu) &&
                    <SettingsMenu activeSettingsTab={activeSettingsTab}
                                  onMenuItemClick={(item: SettingListItem) => onSettingItemClick(item)}/>}

                <Toolbar/>
                <Box sx={!!activeSettingsTab && attachedSettingsMenu ? { paddingLeft: `${drawerWidth}px` } : {}}>
                  <Box sx={styleVariables.overflowHidden}>{children}</Box>
                    {showSettingsMenu && !attachedSettingsMenu &&
                      <Box sx={settingMenuBackdrop} onClick={handleClickOutsideSettingsMenu}></Box>}
                </Box>
              </>}
        </Box>
    );
}
