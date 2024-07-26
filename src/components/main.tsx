import { Box, Drawer, List, ListItem, ListItemButton, ListItemText, Toolbar, useTheme } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { positionRelative, styleVariables } from '@/constants/styles-variables';
import CustomToolbar from '@/components/custom-toolbar';
import { useUser } from '@/lib/graphql/hooks';
import Loading from '@/components/loading';
import { useAuth } from '@/components/auth-context';
import { UserEntity } from '@/lib/data/types';

interface SettingListItem {
    link: string,
    title: string
}

const settingsList: SettingListItem[] = [
    { title: 'Orders', link: 'orders' },
    { title: 'Books', link: 'books' },
    { title: 'Publishing Houses', link: 'publishing-houses' },
    { title: 'Book Series', link: 'book-series' },
    { title: 'Cover Types', link: 'cover-types' },
    { title: 'Book Types', link: 'book-types' },
    { title: 'Page Types', link: 'page-types' },
    { title: 'Languages', link: 'languages' },
    { title: 'Authors', link: 'authors' }
];
const drawerWidth = 240;

const leftNavigationStyles = {
    width: drawerWidth,
    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' }
};

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

    function settingsTabChange(activeSettingsTab: SettingListItem) {
        if (!attachedSettingsMenu) {
            setShowSettingsMenu(false);
        }
        setActiveSettingsTab(activeSettingsTab);
        router.push(`/settings/${activeSettingsTab.link}`);
    }

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

    return (
        <Box sx={positionRelative}>
            <Loading show={loading} fullHeight={true}></Loading>

            <CustomToolbar isSettings={isSettings}
                           showSettingsMenu={showSettingsMenu}
                           activeSettingsTab={activeSettingsTab}
                           attachedSettingsMenu={attachedSettingsMenu}
                           handleSettingsMenu={handleSettingsMenu}
                           hideSettingsMenu={hideSettingsMenu}/>
            {!loading && <>
                {isSettings && (attachedSettingsMenu || showSettingsMenu) ?
                    <Drawer variant="permanent" sx={leftNavigationStyles}>
                        <Toolbar/>
                        <List>
                            {settingsList.map(tab => (
                                <ListItem key={tab.link} disablePadding
                                          className={activeSettingsTab?.link === tab.link ? 'active-nav-link' : ''}
                                          onClick={() => settingsTabChange(tab)}>
                                    <ListItemButton>
                                        <ListItemText primary={tab.title}/>
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Drawer> : null}

              <Toolbar/>
              <Box sx={isSettings && attachedSettingsMenu ? { paddingLeft: `${drawerWidth}px` } : {}}>
                <Box sx={{ overflow: 'hidden' }}>{children}</Box>
                  {isSettings && showSettingsMenu && !attachedSettingsMenu &&
                    <Box sx={settingMenuBackdrop} onClick={handleClickOutsideSettingsMenu}></Box>}
              </Box>
            </>}
        </Box>
    );
}
