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
    const [isSettings, setIsSettings] = useState<boolean>(false);
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
                setIsSettings(false);
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
            setIsSettings(true);
            setActiveSettingsTab(settingsList.find(i => i.link === pathname.split('/settings/')[1]));
        } else {
            setIsSettings(false);
            setActiveSettingsTab(null);
        }
    }, [pathname]);

    useEffect(() => {
        if (isSettings) {
            setAttachedSettingsMenu(mobileMatches);
            if (!attachedSettingsMenu) {
                setShowSettingsMenu(false);
            }
        }
    }, [mobileMatches]);

    function handleSettingsMenu(close = true) {
        if (close) {
            setShowSettingsMenu(false);
            setAttachedSettingsMenu(false);
        } else {
            setAttachedSettingsMenu(mobileMatches);
            setShowSettingsMenu(true);
        }
    }

    function handleClickOutsideSettingsMenu(event) {
        event.stopPropagation();
        event.preventDefault();
        setShowSettingsMenu(false);
    }

    function hideSettingsMenu() {
        setIsSettings(false);
        if (!attachedSettingsMenu) {
            setShowSettingsMenu(false);
        }
        setActiveSettingsTab(null);
    }

    function onSettingItemClick(item: SettingListItem) {
        if (!attachedSettingsMenu) {
            setShowSettingsMenu(false)
        }
        setActiveSettingsTab(activeSettingsTab);
    }

    return (
        <Box sx={positionRelative}>
            <Loading show={loading} fullHeight={true}></Loading>

            <CustomToolbar isSettings={isSettings}
                           showSettingsMenu={showSettingsMenu}
                           activeSettingsTab={activeSettingsTab}
                           attachedSettingsMenu={attachedSettingsMenu}
                           handleSettingsMenu={handleSettingsMenu}
                           hideSettingsMenu={hideSettingsMenu}/>
            {!loading &&
              <>
                  {isSettings && (attachedSettingsMenu || showSettingsMenu) ?
                      <SettingsMenu activeSettingsTab={activeSettingsTab}
                                    onMenuItemClick={(item: SettingListItem) => onSettingItemClick(item)}/> : null}

                <Toolbar/>
                <Box sx={isSettings && attachedSettingsMenu ? { paddingLeft: `${drawerWidth}px` } : {}}>
                  <Box sx={styleVariables.overflowHidden}>{children}</Box>
                    {isSettings && showSettingsMenu && !attachedSettingsMenu &&
                      <Box sx={settingMenuBackdrop} onClick={handleClickOutsideSettingsMenu}></Box>}
                </Box>
              </>}
        </Box>
    );
}
