import { AppBar, Box, IconButton, Toolbar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { CloseIcon } from 'next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import React from 'react';
import { useAuth } from '@/components/auth-context';
import { useRouter } from 'next/router';
import { ROLES } from '@/constants/roles';
import { styleVariables } from '@/constants/styles-variables';

const toolbatTitle = {
    textWrap: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
};

export default function CustomToolbar({
                                          isSettings,
                                          showSettingsMenu,
                                          attachedSettingsMenu,
                                          activeSettingsTab,
                                          handleSettingsMenu,
                                          hideSettingsMenu
                                      }) {
    const { user, logout } = useAuth();
    const router = useRouter();

    function goToMainPage() {
        hideSettingsMenu();
        router.push('/');
    }

    function onLogoutClick() {
        hideSettingsMenu();
        logout();
        router.push('/');
    }

    function onLoginClick() {
        hideSettingsMenu();
        router.push('../login');
    }

    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar className="toolbar">
                <Box>{
                    isSettings && (
                        !showSettingsMenu && !attachedSettingsMenu ?
                            <IconButton color="inherit"
                                        onClick={() => handleSettingsMenu(false)}><MenuIcon/></IconButton> :
                            <IconButton color="inherit"
                                        onClick={() => handleSettingsMenu()}><CloseIcon/></IconButton>)
                }</Box>

                {activeSettingsTab && <Box sx={toolbatTitle}>{activeSettingsTab.title}</Box>}

                <Box sx={styleVariables.flexNoWrap}>
                    <IconButton onClick={() => goToMainPage()}
                                color="inherit"
                                sx={{ mr: 2 }}><HomeIcon/></IconButton>

                    {user?.role === ROLES.admin &&
                      <IconButton color="inherit"
                                  sx={{ mr: 2 }}
                                  aria-label="settings"
                                  onClick={() => router.push('/settings/books')}>
                        <SettingsIcon/>
                      </IconButton>}

                    {!!user ?
                        <IconButton color="inherit" onClick={() => onLogoutClick()}>
                            <LogoutIcon/>
                        </IconButton> :
                        <IconButton color="inherit" onClick={() => onLoginClick()}>
                            <LoginIcon/>
                        </IconButton>}
                </Box>
            </Toolbar>
        </AppBar>
    );
}