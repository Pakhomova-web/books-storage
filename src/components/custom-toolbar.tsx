import { AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar, useTheme } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ProfileIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import React, { useEffect, useState } from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import { useRouter } from 'next/router';
import useMediaQuery from '@mui/material/useMediaQuery';
import { usePathname } from 'next/navigation';
import Badge from '@mui/material/Badge';

import { useAuth } from '@/components/auth-context';
import { isAdmin } from '@/utils/utils';
import LoginModal from '@/components/login-modal';
import CustomModal from '@/components/modals/custom-modal';
import { FormContainer, useForm } from 'react-hook-form-mui';
import CustomTextField from '@/components/form-fields/custom-text-field';
import { styled } from '@mui/material/styles';

enum MainMenuItem {
    home,
    settings,
    profile,
    basket
}

const StyledToolbar = styled(Toolbar)(() => ({
    backgroundColor: 'white'
}));

export default function CustomToolbar() {
    const { user, logout, openLoginModal, setOpenLoginModal } = useAuth();
    const router = useRouter();
    const theme = useTheme();
    const mobileMatches = useMediaQuery(theme.breakpoints.down('sm'));
    const [anchorMenuEl, setAnchorMenuEl] = useState<HTMLElement>();
    const [selectedMenuItem, setSelectedMenuItem] = useState<MainMenuItem>();
    const [openSearchModal, setOpenSearchModal] = useState<boolean>(false);
    const formContext = useForm<{ quickSearch: string }>();
    const { quickSearch } = formContext.watch();
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
            } else if (pathname === '/basket') {
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

    function onQuickSearchClick(value: string) {
        setOpenSearchModal(false);
        router.push(`/books?quickSearch=${value}`);
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
                <StyledToolbar>
                    <Box padding={{ lg: '0 15%', md: '0 10%', xs: 0 }} margin="0 auto" width="100%" display="flex"
                         alignItems="center"
                         justifyContent="space-between">
                        <Box>
                            {isAdmin(user) &&
                              <IconButton color="primary"
                                          className={selectedMenuItem === MainMenuItem.settings ? 'selectedToolbarMenuItem' : ''}
                                          aria-label="settings"
                                          onClick={() => goToPage('/settings/books')}>
                                <SettingsIcon/>
                              </IconButton>}
                        </Box>

                        <Box display="flex" alignItems="center" flexWrap="nowrap" gap={1}>
                            <IconButton color="primary" onClick={() => setOpenSearchModal(true)}>
                                <SearchIcon/>
                            </IconButton>

                            <CustomModal open={openSearchModal} title="Швидкий пошук">
                                <FormContainer formContext={formContext}
                                               handleSubmit={() => onQuickSearchClick(quickSearch)}>
                                    <CustomTextField name="quickSearch" placeholder="Пошук" fullWidth required={true}/>

                                    <Box display="flex" alignItems="center" flexWrap="wrap" gap={1} mt={1}
                                         justifyContent="center">
                                        <Button variant="outlined" onClick={() => setOpenSearchModal(false)}>
                                            Закрити
                                        </Button>

                                        <Button variant="contained" type="submit"
                                                disabled={!quickSearch}>Знайти</Button>
                                    </Box>
                                </FormContainer>
                            </CustomModal>

                            <IconButton onClick={() => goToPage('/')}
                                        color="primary"
                                        className={selectedMenuItem === MainMenuItem.home ? 'selectedToolbarMenuItem' : ''}>
                                <HomeIcon/>
                            </IconButton>

                            <Box>
                                <Badge badgeContent={user?.likedBookIds?.length ? user.likedBookIds.length : null}>
                                    <IconButton onClick={goToLikedBooks} color="primary">
                                        <FavoriteIcon/>
                                    </IconButton>
                                </Badge>
                            </Box>

                            <Box>
                                <Badge badgeContent={user?.basketItems?.length ? user.basketItems.length : null}>
                                    <IconButton onClick={goToBasket}
                                                color="primary"
                                                className={selectedMenuItem === MainMenuItem.basket ? 'selectedToolbarMenuItem' : ''}>
                                        <ShoppingBasketIcon/>
                                    </IconButton>
                                </Badge>
                            </Box>

                            {mobileMatches && !!user ?
                                <>
                                    <IconButton color="primary" aria-label="mobile-menu" aria-haspopup="true"
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
                                        <Toolbar title="Увійти">
                                            <IconButton color="primary"
                                                        onClick={() => goToProfilePage()}
                                                        className={selectedMenuItem === MainMenuItem.profile ? 'selectedToolbarMenuItem' : ''}>
                                                <ProfileIcon/>
                                            </IconButton>
                                        </Toolbar>

                                        <Toolbar title="Вийти">
                                            <IconButton color="primary" onClick={() => onLogoutClick()}>
                                                <LogoutIcon/>
                                            </IconButton>
                                        </Toolbar>
                                    </> :
                                    <IconButton color="primary" onClick={() => onLoginClick()}>
                                        <LoginIcon/>
                                    </IconButton>
                            }
                        </Box>
                    </Box>
                </StyledToolbar>
            </AppBar>

            <LoginModal open={openLoginModal}></LoginModal>
        </>
    );
}