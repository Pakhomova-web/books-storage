import { AppBar, Box, IconButton, Menu, MenuItem, Toolbar, useTheme } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ProfileIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth-context';
import { useRouter } from 'next/router';
import { ROLES } from '@/constants/roles';
import { styleVariables } from '@/constants/styles-variables';
import useMediaQuery from '@mui/material/useMediaQuery';
import SettingsMenu, { settingsList } from '@/components/settings-menu';
import { usePathname } from 'next/navigation';
import { SettingListItem } from '@/components/types';

const toolbarTitle = {
    textWrap: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
};

enum MainMenuItem {
    home,
    settings,
    profile
}

interface IProps {
    showSettingsMenu: boolean,
    attachedSettingsMenu: boolean,
    changeDisplayingSettings: ({ show, attached }) => void
}

export default function CustomToolbar({ showSettingsMenu, attachedSettingsMenu, changeDisplayingSettings }: IProps) {
    const { user, logout } = useAuth();
    const router = useRouter();
    const theme = useTheme();
    const mobileMatches = useMediaQuery(theme.breakpoints.down('sm'));
    const [anchorMenuEl, setAnchorMenuEl] = useState<HTMLElement>();
    const [selectedMenuItem, setSelectedMenuItem] = useState<MainMenuItem>();
    const pathname = usePathname();
    const [activeSettingsTab, setActiveSettingsTab] = useState<SettingListItem>();
    const [mobileMenuItems] = useState([
        { title: 'Profile', onClick: () => goToProfilePage() },
        { title: 'Logout', onClick: () => onLogoutClick() }
    ]);

    useEffect(() => {
        if (pathname.includes('settings')) {
            setActiveSettingsTab(settingsList.find(i => i.link === pathname.split('/settings/')[1]));
            setSelectedMenuItem(MainMenuItem.settings);
            changeDisplayingSettings({ show: !mobileMatches, attached: !mobileMatches });
        } else {
            if (pathname.includes('profile')) {
                setSelectedMenuItem(MainMenuItem.profile);
            } else if (pathname.includes('login') || pathname.includes('sign-in')) {
                setSelectedMenuItem(null);
            } else {
                setSelectedMenuItem(MainMenuItem.home);
            }
            setActiveSettingsTab(null);
        }
    }, [pathname]);

    function onMobileMenuClick(event: React.MouseEvent<HTMLElement>) {
        event.stopPropagation();
        setAnchorMenuEl(event.currentTarget);
    }

    useEffect(() => {
        if (!mobileMatches) {
            setAnchorMenuEl(null);
        }
        if (activeSettingsTab) {
            changeDisplayingSettings({ show: !mobileMatches, attached: !mobileMatches });
        }
    }, [mobileMatches]);

    function onLogoutClick() {
        logout();
        setSelectedMenuItem(null);
        goToPage('/');
    }

    function onLoginClick() {
        setSelectedMenuItem(null);
        goToPage('../login');
    }

    function goToPage(url: string) {
        toggleSettingsMenu(true);
        closeMenu();
        router.push(url);
    }

    function toggleSettingsMenu(close = false) {
        if (close || showSettingsMenu) {
            changeDisplayingSettings({ show: false, attached: false });
        } else {
            changeDisplayingSettings({ show: true, attached: pathname.includes('settings') && !mobileMatches });
        }
    }

    function goToProfilePage() {
        goToPage('../profile');
    }

    function closeMenu() {
        setAnchorMenuEl(null);
    }

    function handleClickOnSettings() {
        closeMenu();
        toggleSettingsMenu();
    }

    function onSettingItemClick(item: SettingListItem) {
        if (!attachedSettingsMenu) {
            changeDisplayingSettings({ show: !mobileMatches, attached: !mobileMatches });
        }
        setActiveSettingsTab(item);
    }

    return (
        <>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar className="toolbar">
                    <Box>
                        {user?.role === ROLES.admin &&
                          <IconButton color="inherit"
                                      sx={selectedMenuItem === MainMenuItem.settings ? styleVariables.border : {}}
                                      aria-label="settings"
                                      onClick={handleClickOnSettings}>
                            <SettingsIcon/>
                          </IconButton>}
                    </Box>

                    <Box
                        sx={toolbarTitle}>{activeSettingsTab?.title || (selectedMenuItem === MainMenuItem.profile && 'Profile') || ''}</Box>

                    <Box sx={styleVariables.flexNoWrap}>
                        <IconButton onClick={() => goToPage('/')}
                                    color="inherit"
                                    sx={{ mr: 1, ...(selectedMenuItem === MainMenuItem.home ? styleVariables.border : {}) }}>
                            <HomeIcon/>
                        </IconButton>
                        {mobileMatches && !!user ?
                            <>
                                <IconButton color="inherit" aria-label="mobile-menu" aria-haspopup="true"
                                            onClick={onMobileMenuClick}><MoreVertIcon/></IconButton>
                                <Menu anchorEl={anchorMenuEl}
                                      open={!!anchorMenuEl}
                                      onClose={closeMenu}
                                      MenuListProps={{ 'aria-labelledby': 'basic-button' }}>
                                    {mobileMenuItems.map((item, i) =>
                                        <MenuItem key={i} onClick={item.onClick}>{item.title}</MenuItem>)}
                                </Menu>
                            </> :
                            !!user ?
                                <>
                                    <IconButton color="inherit"
                                                onClick={() => goToProfilePage()}
                                                sx={{ mr: 1, ...(selectedMenuItem === MainMenuItem.profile ? styleVariables.border : {}) }}>
                                        <ProfileIcon/>
                                    </IconButton>
                                    <IconButton color="inherit" onClick={() => onLogoutClick()}>
                                        <LogoutIcon/>
                                    </IconButton>
                                </> :
                                <IconButton color="inherit" onClick={() => onLoginClick()}>
                                    <LoginIcon/>
                                </IconButton>
                        }
                    </Box>
                </Toolbar>
            </AppBar>

            {(showSettingsMenu || attachedSettingsMenu) &&
              <SettingsMenu activeSettingsTab={activeSettingsTab}
                            onMenuItemClick={(item: SettingListItem) => onSettingItemClick(item)}/>}
        </>
    );
}