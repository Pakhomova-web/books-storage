import { Box, Button, IconButton } from '@mui/material';
import Head from 'next/head';
import React from 'react';
import { useRouter } from 'next/router';

import SocialMediaBox from '@/components/social-media-box';
import { MAIN_DESC, MAIN_NAME } from '@/constants/main-name';
import DeliveriesBox from '@/components/deliveries-box';
import { styleVariables } from '@/constants/styles-variables';
import HomeIcon from '@mui/icons-material/Home';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

export default function AboutUsPage() {
    const router = useRouter();

    return (
        <Box textAlign="center">
            <Head>
                <title>{`Про ${MAIN_NAME}`}</title>
                <meta name="description" content={MAIN_DESC}/>
                <meta name="og:title" content={`Про ${MAIN_NAME}`}/>
                <meta name="og:description" content={MAIN_DESC}/>
            </Head>

            <SocialMediaBox activeLink="aboutUs"/>

            <Box display="flex" alignItems="center" my={1}>
                <IconButton onClick={() => router.push('/')}><HomeIcon/></IconButton>
                <Box display="flex" alignItems="center" gap={1} mr={1}>
                    <KeyboardArrowRightIcon/>
                    Про нас
                </Box>
            </Box>

            <Box display="flex" width="100%" my={3} justifyContent="center" sx={styleVariables.titleFontSize}>
                Ласкаво просимо до сімейного інтернет магазину дитячої літератури.
            </Box>

            <b>{MAIN_NAME}</b> – це магазин дитячої літератури, заснований у 2020 році у м. Харків.

            <Box display="flex" alignItems="center" flexDirection="column" gap={1} my={1}
                 justifyContent="center">
                У нас зібрані найкращі книги від різних видавництв.

                <Box mb={3}>
                    <Button variant="outlined" onClick={() => router.push('/publishing-houses')}>
                        Подивитися усі видавництва
                    </Button>
                </Box>
            </Box>

            <Box display="flex" alignItems="center" my={1}>
                Тут ви зможете знайти казки, енциклопедії, інтерактивні книги, вірші, розмальовки, наліпки, детективи,
                оповідання, пізнавальну та захоплюючу літературу для дітей віком від 0 до 10 років.
                А також великий вибір різних книг для підготовки до школи: для читання, письма, розвитку логіки і
                мислення і т.д.
            </Box>

            <Box display="flex" alignItems="center" my={1} justifyContent="center">
                Ми додаємо відеоогляди та намагаємося проводити регулярно Акції, тому слідкуйте за нашими новинами на
                сайті та на сторінках у соціальних мережах.
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