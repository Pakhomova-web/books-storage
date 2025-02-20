import { Box, IconButton } from '@mui/material';
import Head from 'next/head';
import React from 'react';
import { useRouter } from 'next/router';
import HomeIcon from '@mui/icons-material/Home';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import { MAIN_DESC, MAIN_NAME } from '@/constants/main-name';
import DeliveriesBox from '@/components/deliveries-box';
import SocialMediaBox from '@/components/social-media-box';

export default function AboutUsPage() {
    const router = useRouter();

    return (
        <Box textAlign="center">
            <Head>
                <title>{`Оплата та доставка ${MAIN_NAME}`}</title>
                <meta name="description" content={MAIN_DESC}/>
                <meta name="og:title" content={`Оплата та доставка ${MAIN_NAME}`}/>
                <meta name="og:description" content={MAIN_DESC}/>
            </Head>

            <SocialMediaBox activeLink="delivery"/>

            <Box display="flex" alignItems="center" my={1}>
                <IconButton onClick={() => router.push('/')}><HomeIcon/></IconButton>
                <Box display="flex" alignItems="center" gap={1} mr={1}>
                    <KeyboardArrowRightIcon/>
                    Оплата та доставка
                </Box>
            </Box>

            <Box display="flex" alignItems="center" my={2} justifyContent="center">
                Для вашої зручності ми пропонуємо різні варіанти способів оплати
                (повна оплата або післяплата з передплатою у 100 грн) та доставки у ваш регіон.
            </Box>

            <DeliveriesBox/>

            <Box display="flex" alignItems="center" my={3} justifyContent="center" textAlign="center"
                 fontWeight="bold">
                З найкращими побажаннями - команда {MAIN_NAME}!
            </Box>
        </Box>
    );
}