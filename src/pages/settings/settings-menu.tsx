import { Box, Grid, IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { styled } from '@mui/material/styles';
import { pageStyles, primaryLightColor, styleVariables } from '@/constants/styles-variables';
import CustomImage from '@/components/custom-image';
import AddIcon from '@mui/icons-material/Add';

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
    [theme.breakpoints.up('md')]: {
        position: 'sticky',
        top: 0
    }
}));

const SettingsMenuItemStyledGrid = styled(Grid)(({ theme }) => ({
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

export default function SettingsMenu({ children, activeUrl, onAddClick = () => {} }) {
    const router = useRouter();

    function navigateTo(url: string) {
        router.push(`/settings/${url}`);
    }

    return (
        <Box sx={pageStyles}>
            <Grid container>
                <Grid item xs={12} borderBottom={1}
                      borderColor={primaryLightColor}
                      sx={styleVariables.bigTitleFontSize}
                      display="flex" justifyContent="space-between"
                      p={2}>
                    <Box>Налаштування</Box>
                    {!!onAddClick &&
                      <Box>
                        <IconButton onClick={onAddClick}><AddIcon/></IconButton>
                      </Box>
                    }
                </Grid>

                <StyledMenuContainer item xs={12} md={3} lg={2}>
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
                </StyledMenuContainer>

                <Grid item xs={12} md={9} lg={10}>
                    {children}
                </Grid>
            </Grid>
        </Box>
    );
}