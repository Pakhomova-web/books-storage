import { Box, Grid } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { styled } from '@mui/material/styles';
import { pageStyles, primaryLightColor, styleVariables } from '@/constants/styles-variables';
import CustomImage from '@/components/custom-image';

const menuItems = [
    {
        title: 'Персональні дані',
        url: 'personal-info',
        activeImg: '/personal_info_edit_color.png',
        img: '/personal_info_edit.png'
    },
    {
        title: 'Вподобання',
        url: 'likes',
        activeImg: '/liked_books_active.png',
        img: '/liked_books.png'
    }
];

const imageBoxStyles = {
    width: '30px', height: '30px'
};

const ProfileMenuContainerStyledGrid = styled(Grid)(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        position: 'sticky',
        top: 0
    }
}));

const ProfileMenuItemStyledGrid = styled(Grid)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    borderBottom: `1px solid ${primaryLightColor}`,
    cursor: 'pointer'
}));

const StyledMenuContainer = styled(Grid)(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        height: 'calc(100svh - 129px)'
    },
    zIndex: theme.zIndex.drawer,
    background: 'white',
    [theme.breakpoints.down('md')]: {
        position: 'sticky',
        top: 0
    }
}))

export default function ProfileMenu({ children, activeUrl }) {
    const router = useRouter();

    function navigateTo(url: string) {
        router.push(`/profile/${url}`);
    }

    return (
        <Box sx={pageStyles}>
            <Grid container>
                <Grid item xs={12} borderBottom={1}
                      borderColor={primaryLightColor}
                      sx={styleVariables.bigTitleFontSize}
                      p={2}>
                    Особистий кабінет
                </Grid>

                <StyledMenuContainer item xs={12} md={3} lg={2} borderRight={1} borderColor={primaryLightColor}>
                    <ProfileMenuContainerStyledGrid container>
                        {menuItems.map((item, index) => (
                            <ProfileMenuItemStyledGrid item xs={6} md={12} key={index}
                                                       sx={{ backgroundColor: activeUrl === item.url ? primaryLightColor : 'white' }}
                                                       onClick={() => navigateTo(item.url)}>
                                <Box m={2} display="flex" flexWrap="nowrap" alignItems="center" gap={1}>
                                    <Box sx={imageBoxStyles}>
                                        <CustomImage
                                            imageLink={activeUrl === item.url ? item.activeImg : item.img}></CustomImage>
                                    </Box>
                                    {item.title}
                                </Box>
                            </ProfileMenuItemStyledGrid>
                        ))}
                    </ProfileMenuContainerStyledGrid>
                </StyledMenuContainer>

                <Grid item xs={12} md={9} lg={10}>
                    <Box p={1}>{children}</Box>
                </Grid>
            </Grid>
        </Box>
    );
}