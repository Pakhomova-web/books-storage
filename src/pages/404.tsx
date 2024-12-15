import { Box, Button } from '@mui/material';
import CustomImage from '@/components/custom-image';
import { styleVariables } from '@/constants/styles-variables';
import React from 'react';
import { useRouter } from 'next/router';
import SocialMediaBox from '@/components/social-media-box';
import DeliveriesBox from '@/components/deliveries-box';

const imageBoxStyles = {
    width: '150px',
    height: '150px',
    opacity: 0.5
};

export default function ErrorPage() {
    const router = useRouter();

    return (
        <>
            <SocialMediaBox/>

            <DeliveriesBox/>

            <Box display="flex" gap={2} flexDirection="column" justifyContent="center" alignItems="center" mt={2}>
                <Box sx={imageBoxStyles}>
                    <CustomImage imageLink="/404_page.png"></CustomImage>
                </Box>
                <Box sx={styleVariables.titleFontSize}>Ой, такої сторінки немає</Box>

                <Box display="flex">
                    <Button variant="outlined" onClick={() => router.push('/')}>До вибору книг</Button>
                </Box>
            </Box>
        </>
    );
}