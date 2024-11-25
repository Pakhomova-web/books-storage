import { Box, Grid, IconButton, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';

import { primaryLightColor, styleVariables } from '@/constants/styles-variables';
import CustomImage from '@/components/custom-image';
import { CloseIcon } from 'next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon';
import useMediaQuery from '@mui/material/useMediaQuery';

const menuItems = [
    {
        title: 'Замовлення',
        url: 'orders',
        activeImg: '/settings_orders_color.png',
        img: '/settings_orders.png'
    },
    {
        title: 'Книги',
        url: 'books',
        activeImg: '/settings_books_color.png',
        img: '/settings_books.png'
    },
    {
        title: 'Коментарі',
        url: 'comments',
        activeImg: '/settings_comments_color.png',
        img: '/settings_comments.png'
    },
    {
        title: 'Видавництва',
        url: 'publishing-houses',
        activeImg: '/settings_publishing_houses_color.png',
        img: '/settings_publishing_houses.png'
    },
    {
        title: 'Серії',
        url: 'book-series',
        activeImg: '/settings_book_series_color.png',
        img: '/settings_book_series.png'
    },
    {
        title: 'Види обкладинок',
        url: 'cover-types',
        activeImg: '/settings_book_covers_color.png',
        img: '/settings_book_covers.png'
    },
    {
        title: 'Види книг',
        url: 'book-types',
        activeImg: '/settings_book_types_color.png',
        img: '/settings_book_types.png'
    },
    {
        title: 'Види сторінок',
        url: 'page-types',
        activeImg: '/settings_page_types_color.png',
        img: '/settings_page_types.png'
    },
    {
        title: 'Мови',
        url: 'languages',
        activeImg: '/settings_languages_color.png',
        img: '/settings_languages.png'
    },
    {
        title: 'Автори',
        url: 'authors',
        activeImg: '/settings_authors_color.png',
        img: '/settings_authors.png'
    },
    {
        title: 'Способи доставки',
        url: 'deliveries',
        activeImg: '/settings_deliveries_color.png',
        img: '/settings_deliveries.png'
    }
];

const imageBoxStyles = {
    width: '30px', height: '30px'
};

const SettingsMenuContainerStyledGrid = styled(Grid)(({ theme }) => ({
    backgroundColor: 'white',
    [theme.breakpoints.up('md')]: {
        position: 'sticky',
        top: 0
    },
    [theme.breakpoints.down('md')]: {
        position: 'absolute',
        top: 0
    }
}));

const SettingsMenuItemStyledGrid = styled(Grid)(() => ({
    display: 'flex',
    alignItems: 'center',
    borderBottom: `1px solid ${primaryLightColor}`,
    borderRight: `1px solid ${primaryLightColor}`,
    cursor: 'pointer'
}));

const StyledMenuContainer = styled(Grid)(({ theme }) => ({
    zIndex: theme.zIndex.drawer,
    background: 'white',
    [theme.breakpoints.down('md')]: {
        position: 'sticky',
        top: 0
    }
}));

export default function SettingsMenu({ children, activeUrl, onAddClick = null }) {
    const router = useRouter();
    const theme = useTheme();
    const mobileMatches = useMediaQuery(theme.breakpoints.down('md'));
    const [activeMenuItems] = useState(menuItems.find(item => item.url === activeUrl));
    const [showMenu, setShowMenu] = useState<boolean>(!mobileMatches);

    useEffect(() => {
        setShowMenu(!mobileMatches);
    }, [mobileMatches])

    function navigateTo(url: string) {
        if (mobileMatches) {
            setShowMenu(false);
        }
        router.push(`/settings/${url}`);
    }

    return (
        <Grid container>
            <Grid item xs={12} borderBottom={1}
                  borderColor={primaryLightColor}
                  sx={styleVariables.bigTitleFontSize}
                  display="flex" justifyContent="space-between"
                  p={2}>
                <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
                    <Box display={{ xs: 'flex', md: 'none' }}>
                        <IconButton onClick={() => setShowMenu(!showMenu)}>
                            {showMenu ? <CloseIcon/> : <MenuIcon/>}
                        </IconButton>
                    </Box>
                    Налаштування
                </Box>
                {!!onAddClick &&
                  <Box>
                    <IconButton onClick={onAddClick}><AddIcon/></IconButton>
                  </Box>
                }
            </Grid>

            {showMenu && <StyledMenuContainer item xs={12} md={3} lg={2}>
              <SettingsMenuContainerStyledGrid container>
                  {menuItems.map((item, index) => (
                      <SettingsMenuItemStyledGrid item xs={6} md={12} key={index}
                                                  sx={{ backgroundColor: activeUrl === item.url ? primaryLightColor : 'white' }}
                                                  onClick={() => navigateTo(item.url)}>
                          <Box m={2} display="flex" flexWrap="nowrap" alignItems="center" gap={1}>
                              <Box sx={imageBoxStyles}>
                                  <CustomImage
                                      imageLink={activeUrl === item.url ? item.activeImg : item.img}></CustomImage>
                              </Box>
                              {item.title}
                          </Box>
                      </SettingsMenuItemStyledGrid>
                  ))}
              </SettingsMenuContainerStyledGrid>
            </StyledMenuContainer>}

            <Grid item xs={12} md={9} lg={10} position="relative"
                  sx={theme => ({ [theme.breakpoints.down('md')]: { display: !showMenu ? 'block' : 'none' } })}>
                {!showMenu && !!activeMenuItems &&
                  <Box sx={styleVariables.sectionTitle}>
                    <Box sx={imageBoxStyles}>
                      <CustomImage imageLink={activeMenuItems.activeImg}></CustomImage>
                    </Box>
                      {activeMenuItems.title}
                  </Box>
                }

                {children}
            </Grid>
        </Grid>
    );
}