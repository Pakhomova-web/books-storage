import { styled } from '@mui/material/styles';
import { Box, Grid, IconButton, Tooltip } from '@mui/material';
import { styleVariables } from '@/constants/styles-variables';
import InstagramIcon from '@mui/icons-material/Instagram';
import React from 'react';
import CustomImage from '@/components/custom-image';
import CustomLink from '@/components/custom-link';
import { useRouter } from 'next/router';

const StyledSocialsGrid = styled(Grid)(() => ({
    backgroundColor: 'white',
    borderTop: `1px solid ${styleVariables.gray}`,
    borderBottom: `1px solid ${styleVariables.gray}`
}));

export default function SocialMediaBox({ showAboutUsLink = true }) {
    const router = useRouter();

    function onInstagramClick() {
        window.open('https://instagram.com/ph_smart_kids', "_blank")
    }

    function onTikTokClick() {
        window.open('https://www.tiktok.com/@ph_smart_kids', "_blank")
    }

    return (
        <StyledSocialsGrid container display="flex" alignItems="center" width="100%" p={1}
                           justifyContent="space-between">
            <Grid item xs={12} sm={6} display="flex" justifyContent="center" flexDirection="column" alignItems="center">
                <Box display="flex" alignItems="center" flexWrap="wrap" justifyContent="center">
                    При замовленні до&nbsp;<b>18:00</b>&nbsp;
                    <Box sx={{ width: '15px' }} display="flex">
                        <CustomImage imageLink="/nova_poshta_icon.png"/>
                    </Box>,&nbsp;
                    <b>15:00</b>&nbsp;
                    <Box sx={{ width: '15px' }} display="flex">
                        <CustomImage imageLink="/ukr_poshta_icon.png"/>
                    </Box>&nbsp;-&nbsp;
                    <b>відправка в той же день</b>.
                </Box>
            </Grid>

            <Grid item xs={12} sm={6} display="flex" alignItems="center" justifyContent="center">
                <Box mr={1}>Соц. мережі:</Box>
                <Tooltip title="Instagram">
                    <IconButton onClick={onInstagramClick}>
                        <InstagramIcon color="primary" fontSize="medium"/>
                    </IconButton>
                </Tooltip>

                <Tooltip title="Tik Tok">
                    <IconButton onClick={onTikTokClick} sx={{ fontSize: '18px' }}>
                        <Box sx={{ width: '18px', height: '18px' }}>
                            <CustomImage imageLink="/tiktok_icon.png"></CustomImage>
                        </Box>
                    </IconButton>
                </Tooltip>

                {showAboutUsLink &&
                  <Box ml={1}>
                    <CustomLink onClick={() => router.push('/about-us')}>Про нас</CustomLink>
                  </Box>}
            </Grid>
        </StyledSocialsGrid>
    );
}