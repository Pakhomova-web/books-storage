import { styled } from '@mui/material/styles';
import { Box, Grid, IconButton, Tooltip } from '@mui/material';
import { styleVariables } from '@/constants/styles-variables';
import InstagramIcon from '@mui/icons-material/Instagram';
import React from 'react';
import CustomImage from '@/components/custom-image';
import { Instagram } from '@mui/icons-material';

const StyledSocialsGrid = styled(Grid)(() => ({
    backgroundColor: 'white',
    borderBottom: `1px solid ${styleVariables.gray}`
}));

export default function SocialMediaBox() {

    function onInstagramClick() {
        window.open('https://instagram.com/ph_smart_kids', "_blank")
    }

    function onTikTokClick() {
        window.open('https://www.tiktok.com/@ph_smart_kids', "_blank")
    }

    return (
        <StyledSocialsGrid container display="flex" alignItems="center" width="100%" p={1}
                           justifyContent="space-between">
            <Grid item xs={12} sm={6} display="flex" justifyContent="center">
                Графік роботи: 9:00 - 21:00. Без вихідних
            </Grid>

            <Grid item xs={12} sm={6} display="flex" alignItems="center" justifyContent="center">
                <Box mr={1}>Соц. мережі:</Box>
                <Tooltip title="Instagram">
                    <IconButton onClick={onInstagramClick}>
                        <InstagramIcon color="primary" fontSize="medium"/>
                    </IconButton>
                </Tooltip>

                <Tooltip title="Tik Tok">
                    <IconButton onClick={onTikTokClick}>
                        <Box sx={{ width: '22px', height: '22px' }}>
                            <CustomImage imageLink="/tiktok_icon.png"></CustomImage>
                        </Box>
                    </IconButton>
                </Tooltip>
            </Grid>
        </StyledSocialsGrid>
    );
}