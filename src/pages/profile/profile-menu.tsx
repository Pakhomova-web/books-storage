import { Box, Grid } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { styled } from '@mui/material/styles';
import { primaryLightColor, styleVariables } from '@/constants/styles-variables';

const menuItems = [
    { title: 'Персональні дані', url: 'personal-info' },
    { title: 'Вподобання', url: 'likes' }
];

const ProfileMenuStyledGrid = styled(Grid)(() => ({
    display: 'flex',
    alignItems: 'center',
    borderBottom: `1px solid ${primaryLightColor}`,
    borderRight: `1px solid ${primaryLightColor}`
}));

export default function ProfileMenu({ children, activeUrl }) {
    const router = useRouter();

    function navigateTo(url: string) {
        router.push(`/profile/${url}`);
    }

    return (
        <Grid container>
            <Grid item xs={12} borderBottom={1}
                 borderColor={primaryLightColor}
                 sx={styleVariables.bigTitleFontSize}
                 p={2}>
                Особистий кабінет
            </Grid>

            <Grid item xs={12} md={3} lg={2}>
                <Grid container>
                    {menuItems.map((item, index) => (
                        <ProfileMenuStyledGrid item xs={6} md={12} key={index}
                                               onClick={() => navigateTo(item.url)}>
                            <Box m={2}>{item.title}{activeUrl === item.url && ' (active)'}</Box>
                        </ProfileMenuStyledGrid>
                    ))}
                </Grid>
            </Grid>

            <Grid item xs={12} md={9} lg={10} p={2}>
                <Box textAlign="center"
                     sx={styleVariables.sectionTitle}
                     py={1} mb={2}>
                    {menuItems.find(i => i.url === activeUrl)?.title}
                </Box>

                <Box>{children}</Box>
            </Grid>
        </Grid>
    );
}