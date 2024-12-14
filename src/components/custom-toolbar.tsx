import { AppBar, Box, Grid, IconButton, Menu, MenuItem, Toolbar, useTheme } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ProfileIcon from '@mui/icons-material/AccountCircle';
import React, { useEffect, useState } from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import { useRouter } from 'next/router';
import useMediaQuery from '@mui/material/useMediaQuery';
import { usePathname } from 'next/navigation';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';

import { useAuth } from '@/components/auth-context';
import { isAdmin } from '@/utils/utils';
import LoginModal from '@/components/modals/login-modal';
import QuickSearchModal from '@/components/modals/quick-search-modal';
import CustomImage from '@/components/custom-image';

enum MainMenuItem {
    home,
    settings,
    profile,
    basket
}

const StyledToolbar = styled(Toolbar)(() => ({
    backgroundColor: 'white',
    padding: 0
}));

const StyledLogoBox = styled(Box)(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
        height: '20px'
    },
    [theme.breakpoints.up('md')]: {
        height: '30px'
    },
    width: '200px',
    maxWidth: '85%',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
}));

export default function CustomToolbar() {
    const { user, logout, openLoginModal, setOpenLoginModal } = useAuth();
    const router = useRouter();
    const theme = useTheme();
    const mobileMatches = useMediaQuery(theme.breakpoints.down('sm'));
    const [anchorMenuEl, setAnchorMenuEl] = useState<HTMLElement>();
    const [selectedMenuItem, setSelectedMenuItem] = useState<MainMenuItem>();
    const [openSearchModal, setOpenSearchModal] = useState<boolean>(false);
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

    useEffect(() => {
        if (!mobileMatches) {
            setAnchorMenuEl(null);
        }
    }, [mobileMatches]);

    function onLogoutClick() {
        logout();
        if (['settings', 'profile'].some(url => pathname.includes(url))) {
            goToPage('/');
            setSelectedMenuItem(null);
        }
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
                    <Grid container padding={{ lg: '0 15%', md: '0 5%', xs: 1 }} margin="0 auto" width="100%"
                          display="flex" alignItems="center">
                        <Grid item xs={5}>
                            <StyledLogoBox onClick={() => goToPage('/')}>
                                <CustomImage imageLink="/logo.png"/>
                            </StyledLogoBox>
                        </Grid>

                        <Grid item xs={7} display="flex" alignItems="center" flexWrap="nowrap" gap={1}
                              justifyContent="flex-end">
                            <IconButton color="primary" onClick={() => setOpenSearchModal(true)}>
                                <SearchIcon/>
                            </IconButton>

                            {isAdmin(user) &&
                              <IconButton color="primary"
                                          className={selectedMenuItem === MainMenuItem.settings ? 'selectedToolbarMenuItem' : ''}
                                          aria-label="settings"
                                          onClick={() => goToPage('/settings/orders')}>
                                <SettingsIcon/>
                              </IconButton>}

                            {openSearchModal &&
                              <QuickSearchModal open={true} onClose={() => setOpenSearchModal(false)}/>}

                            <Box>
                                <Badge badgeContent={user?.likedBookIds?.length ? user.likedBookIds.length : null}>
                                    <IconButton onClick={goToLikedBooks} color="primary">
                                        <FavoriteIcon/>
                                    </IconButton>
                                </Badge>
                            </Box>

                            <Box>
                                <Badge
                                    badgeContent={user ? (user.basketItems.length + (user.basketGroupDiscounts?.length || 0)) : null}>
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
                                <>
                                    <IconButton color="primary"
                                                onClick={() => !!user ? goToProfilePage() : onLoginClick()}
                                                className={selectedMenuItem === MainMenuItem.profile ? 'selectedToolbarMenuItem' : ''}>
                                        <ProfileIcon/>
                                    </IconButton>

                                    {!!user &&
                                      <IconButton color="primary" onClick={() => onLogoutClick()}>
                                        <LogoutIcon/>
                                      </IconButton>}
                                </>
                            }
                        </Grid>
                    </Grid>
                </StyledToolbar>
            </AppBar>

            <LoginModal open={openLoginModal}></LoginModal>
        </>
    );
}