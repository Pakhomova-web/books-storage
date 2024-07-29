import { AppBar, Box, IconButton, Menu, MenuItem, Toolbar, useTheme } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LoginIcon from '@mui/icons-material/Login';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth-context';
import { useRouter } from 'next/router';
import { ROLES } from '@/constants/roles';
import { styleVariables } from '@/constants/styles-variables';
import useMediaQuery from '@mui/material/useMediaQuery';

const toolbatTitle = {
    textWrap: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
};

export default function CustomToolbar({ activeSettingsTab, onSettingsClick }) {
    const { user, logout } = useAuth();
    const router = useRouter();
    const theme = useTheme();
    const mobileMatches = useMediaQuery(theme.breakpoints.down('sm'));
    const [anchorMenuEl, setAnchorMenuEl] = useState<HTMLElement>();
    const onMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorMenuEl(event.currentTarget);
    }

    useEffect(() => {
        if (!mobileMatches) {
            setAnchorMenuEl(null);
        }
    }, [mobileMatches]);

    function goToMainPage() {
        handleClickOnSettings();
        router.push('/');
    }

    function onLogoutClick() {
        handleClickOnSettings();
        closeMenu();
        logout();
        router.push('/');
    }

    function onLoginClick() {
        handleClickOnSettings();
        closeMenu();
        router.push('../login');
    }

    function closeMenu() {
        setAnchorMenuEl(null);
    }

    function handleClickOnSettings() {
        closeMenu();
        onSettingsClick();
    }

    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar className="toolbar">
                <Box>
                    {user?.role === ROLES.admin &&
                      <IconButton color="inherit" sx={{ mr: 2 }} aria-label="settings" onClick={handleClickOnSettings}>
                        <SettingsIcon/>
                      </IconButton>}
                </Box>

                {activeSettingsTab && <Box sx={toolbatTitle}>{activeSettingsTab.title}</Box>}

                <Box sx={styleVariables.flexNoWrap}>
                    <IconButton onClick={() => goToMainPage()}
                                color="inherit"
                                sx={{ mr: 2 }}><HomeIcon/></IconButton>
                    {mobileMatches && !!user ?
                        <>
                            <IconButton color="inherit" aria-label="mobile-menu" aria-haspopup="true"
                                        onClick={onMenuClick}><MoreVertIcon/></IconButton>
                            <Menu anchorEl={anchorMenuEl}
                                  open={!!anchorMenuEl}
                                  onClose={closeMenu}
                                  MenuListProps={{ 'aria-labelledby': 'basic-button' }}>
                                {!!user ?
                                    <MenuItem onClick={() => onLogoutClick()}>Logout</MenuItem> :
                                    <MenuItem onClick={() => onLoginClick()}>Login</MenuItem>
                                }
                            </Menu>
                        </> :
                        <>
                            {!!user ?
                                <IconButton color="inherit" onClick={() => onLogoutClick()}>
                                    <LogoutIcon/>
                                </IconButton> :
                                <IconButton color="inherit" onClick={() => onLoginClick()}>
                                    <LoginIcon/>
                                </IconButton>}
                        </>
                    }
                </Box>
            </Toolbar>
        </AppBar>
    );
}