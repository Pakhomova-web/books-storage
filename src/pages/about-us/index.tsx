import { Box, Button } from '@mui/material';
import Head from 'next/head';
import React from 'react';
import { useRouter } from 'next/router';

import SocialMediaBox from '@/components/social-media-box';
import { MAIN_NAME } from '@/constants/main-name';
import DeliveriesBox from '@/components/deliveries-box';

export default function AboutUsPage() {
    const router = useRouter();

    return (
        <Box>
            <Head>
                <title>Про {MAIN_NAME}</title>
            </Head>
            <Box display="flex" width="100%" my={1}>
                Ласкаво просимо до сімейного інтернет магазину дитячої літератури.
            </Box>

            <b>{MAIN_NAME}</b> – це магазин дитячої літератури, заснований у 2020 році у м. Харків.

            <Box display="flex" alignItems="center" gap={1} my={1} flexWrap="wrap" justifyContent="center">
                У нас зібрані найкращі книги від різних видавництв.

                <Button variant="outlined" onClick={() => router.push('/publishing-houses')}>
                    Подивитися усі видавництва
                </Button>
            </Box>

            <Box display="flex" alignItems="center" my={1}>
                Тут ви зможете знайти казки, енциклопедії, інтерактивні книги, вірші, розмальовки, наліпки, детективи,
                оповідання, пізнавальну та захоплюючу літературу для дітей віком від 0 до 10 років.
                А також великий вибір різних книг для підготовки до школи: для читання, письма, розвитку логіки і
                мислення і т.д.
            </Box>

            <Box display="flex" alignItems="center" my={1}>
                Ми додаємо відеоогляди та намагаємося проводити регулярно Акції, тому слідкуйте за нашими новинами на
                сайті та на сторінках у соціальних мережах.
            </Box>

            <SocialMediaBox showAboutUsLink={false}/>

            <Box display="flex" alignItems="center" my={1}>
                Для вашої зручності ми пропонуємо різні варіанти способів оплати
                (повна оплата або післяплата з передплатою у 100 грн) та доставки у ваш регіон.
            </Box>

            <DeliveriesBox/>

            <Box display="flex" alignItems="center" my={3} justifyContent="center" textAlign="center"
                 fontWeight="bold">
                З найкращими побажаннями - команда {MAIN_NAME}
            </Box>
        </Box>
    );
}