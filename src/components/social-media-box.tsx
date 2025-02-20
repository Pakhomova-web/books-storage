import { styled } from '@mui/material/styles';
import { Box, Grid, Tooltip } from '@mui/material';
import { styleVariables } from '@/constants/styles-variables';
import InstagramIcon from '@mui/icons-material/Instagram';
import React from 'react';
import CustomImage from '@/components/custom-image';
import CustomLink from '@/components/custom-link';

const StyledSocialsGrid = styled(Grid)(() => ({
    backgroundColor: 'white',
    borderTop: `1px solid ${styleVariables.gray}`,
    borderBottom: `1px solid ${styleVariables.gray}`
}));

export default function SocialMediaBox({ activeLink = null }: { activeLink?: 'aboutUs' | 'delivery' | null }) {
    return (
        <StyledSocialsGrid container display="flex" alignItems="center" width="100%" p={1} spacing={1}
                           justifyContent="space-between">
            <Grid item xs={12} sm={5} display="flex" justifyContent="center" flexDirection="column" alignItems="center">
                <b>Відправка в день замовлення</b>
                Замовлення приймаємо пн-нд з 9 до 20
            </Grid>

            <Grid item xs={12} sm={4} gap={2} display="flex" alignItems="center" justifyContent="space-around"
                  flexWrap="wrap">
                <CustomLink href="/about-us" selected={activeLink === 'aboutUs'}>Про нас</CustomLink>

                <CustomLink href="/delivery" selected={activeLink === 'delivery'}>Оплата та доставка</CustomLink>
            </Grid>

            <Grid item xs={12} sm={3} display="flex" flexWrap="wrap" gap={1} alignItems="center"
                  justifyContent="center">
                <Box mr={1}>Соц. мережі:</Box>

                <Box display="flex" flexWrap="nowrap" gap={1} alignItems="center">
                    <Tooltip title="Instagram">
                        <a href="https://instagram.com/ph_smart_kids" target="_blank">
                            <Box width="24px" height="24px">
                                <InstagramIcon fontSize="medium"/>
                            </Box>
                        </a>
                    </Tooltip>

                    <Tooltip title="Tik Tok">
                        <a href="https://www.tiktok.com/@ph_smart_kids" target="_blank">
                            <Box width="24px" height="24px">
                                <CustomImage imageLink="/social-media/tiktok.svg"></CustomImage>
                            </Box>
                        </a>
                    </Tooltip>
                </Box>
            </Grid>
        </StyledSocialsGrid>
    );
}