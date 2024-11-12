import { AppBar, Box, IconButton, Menu, MenuItem, Toolbar, useTheme } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ProfileIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import React, { useEffect, useState } from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import { useRouter } from 'next/router';
import useMediaQuery from '@mui/material/useMediaQuery';
import { usePathname } from 'next/navigation';
import Badge from '@mui/material/Badge';

import { useAuth } from '@/components/auth-context';
import { styleVariables } from '@/constants/styles-variables';
import { isAdmin } from '@/utils/utils';
import LoginModal from '@/components/login-modal';

enum MainMenuItem {
    home,
    settings,
    profile,
    basket
}

export default function CustomToolbar() {
    const { user, logout, openLoginModal, setOpenLoginModal } = useAuth();
    const router = useRouter();
    const theme = useTheme();
    const mobileMatches = useMediaQuery(theme.breakpoints.down('sm'));
    const [anchorMenuEl, setAnchorMenuEl] = useState<HTMLElement>();
    const [selectedMenuItem, setSelectedMenuItem] = useState<MainMenuItem>();
    const pathname = usePathname();
    const [mobileMenuItems] = useState([
        { title: 'Профіль', onClick: () => goToProfilePage() },
        { title: 'Вийти', onClick: () => onLogoutClick() }
    ]);

    useEffect(() => {
        if (pathname.includes('settings')) {
            setSelectedMenuItem(MainMenuItem.settings);
        } else {
            if (pathname.includes('profile')) {
                setSelectedMenuItem(MainMenuItem.profile);
            } else if (pathname.includes('sign-in')) {
                setSelectedMenuItem(null);
            } else if (pathname === '/') {
                setSelectedMenuItem(MainMenuItem.home);
            }  else if (pathname === '/basket') {
                setSelectedMenuItem(MainMenuItem.basket);
            } else {
                setSelectedMenuItem(null);
            }
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
    }, [mobileMatches]);

    function onLogoutClick() {
        logout();
        setSelectedMenuItem(null);
        goToPage('/');
    }

    function onLoginClick() {
        setSelectedMenuItem(null);
        setOpenLoginModal(true);
    }

    function goToPage(url: string) {
        closeMenu();
        router.push(url);
    }

    function goToProfilePage() {
        goToPage('../profile/personal-info');
    }

    function closeMenu() {
        setAnchorMenuEl(null);
    }

    function goToLikedBooks() {
        if (!user) {
            setOpenLoginModal(true);
        } else {
            goToPage('/profile/likes');
        }
    }

    function goToBasket() {
        if (!user) {
            setOpenLoginModal(true);
        } else {
            goToPage('/basket');
        }
    }

    return (
        <>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar className="toolbar">
                    <Box>
                        {isAdmin(user) &&
                          <IconButton color="inherit"
                                      className={selectedMenuItem === MainMenuItem.settings ? 'selectedToolbarMenuItem' : ''}
                                      aria-label="settings"
                                      onClick={() => goToPage('/settings/books')}>
                            <SettingsIcon/>
                          </IconButton>}
                    </Box>

                    <Box sx={styleVariables.flexNoWrap}>
                        <IconButton onClick={() => goToPage('/')}
                                    color="inherit"
                                    className={selectedMenuItem === MainMenuItem.home ? 'selectedToolbarMenuItem' : ''}>
                            <HomeIcon/>
                        </IconButton>

                        <Box mr={!user?.likedBookIds?.length ? 0 : 1}>
                            <Badge badgeContent={user?.likedBookIds?.length ? user.likedBookIds.length : null}>
                                <IconButton onClick={goToLikedBooks} color="inherit">
                                    <FavoriteIcon/>
                                </IconButton>
                            </Badge>
                        </Box>

                        <Box mr={!user?.basketItems?.length ? 0 : 1}>
                            <Badge badgeContent={user?.basketItems?.length ? user.basketItems.length : null}>
                                <IconButton onClick={goToBasket}
                                            color="inherit"
                                            className={selectedMenuItem === MainMenuItem.basket ? 'selectedToolbarMenuItem' : ''}>
                                    <ShoppingBasketIcon/>
                                </IconButton>
                            </Badge>
                        </Box>

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
                                                className={selectedMenuItem === MainMenuItem.profile ? 'selectedToolbarMenuItem' : ''}>
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

            <LoginModal open={openLoginModal} onClose={() => setOpenLoginModal(false)}></LoginModal>
        </>
    );
}