import { Box, Grid } from '@mui/material';
import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import Loading from '@/components/loading';
import { borderRadius, styleVariables } from '@/constants/styles-variables';
import CustomImage from '@/components/custom-image';
import { usePublishingHouses } from '@/lib/graphql/queries/publishing-house/hook';
import SocialMediaBox from '@/components/social-media-box';
import DeliveriesBox from '@/components/deliveries-box';
import { MAIN_NAME } from '@/constants/main-name';
import DiscountBooks from '@/components/books/discount-books';
import Catalogue from '@/components/catalogue';

const mobileImageBoxStyles = {
    height: '70px',
    width: '70px',
    overflow: 'hidden'
};

const boxStyles = {
    borderRadius,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: styleVariables.gray
};

export default function PublishingHouses() {
    const { loading: loadingPublishingHouses, items: publishingHouses } = usePublishingHouses({
        orderBy: 'name',
        order: 'asc'
    });
    const router = useRouter();

    return (
        <>
            <Head>
                <title>{`Видавництва ${MAIN_NAME}`}</title>
                <meta name="description"
                      content={`Магазин дитячої літератури ${MAIN_NAME} - це великий вибір книг для дитячого розвитку, читання на ніч, самостійного читання та підготовки до школи. Видавництва. Віммельбухи. Книги з пазлами. Для вивчення англійської. Для підготовки руки до письма. Прописи. Енциклопедії. Наліпки. Розмальовки. Доставка книг поштою та кур'єром.`}/>
                <meta name="og:title" content={`Видавництва ${MAIN_NAME}`}/>
                <meta name="og:description"
                      content={`Магазин дитячої літератури ${MAIN_NAME} - це великий вибір книг для дитячого розвитку, читання на ніч, самостійного читання та підготовки до школи. Видавництва. Віммельбухи. Книги з пазлами. Для вивчення англійської. Для підготовки руки до письма. Прописи. Енциклопедії. Наліпки. Розмальовки. Доставка книг поштою та кур'єром.`}/>
            </Head>

            <SocialMediaBox/>

            <Catalogue/>

            <Grid container position="relative" mb={1}>
                <Loading show={loadingPublishingHouses} isSmall={true}></Loading>

                <Grid item xs={12} sx={styleVariables.sectionTitle} mb={1}>Видавництва</Grid>

                <Grid container spacing={1}>
                    {!!publishingHouses?.length && publishingHouses.map((publishingHouse, index) =>
                        <Grid xs={12} sm={6} md={4} lg={3} key={index} item
                              onClick={() => router.push(`/books?publishingHouse=${publishingHouse.id}`)}>
                            <Box sx={boxStyles} gap={1} p={1}>
                                <Box sx={mobileImageBoxStyles}>
                                    <CustomImage imageId={publishingHouse.imageId}></CustomImage>
                                </Box>
                                {publishingHouse.name}
                            </Box>
                        </Grid>)}
                </Grid>
            </Grid>

            <DiscountBooks/>

            <DeliveriesBox/>
        </>
    );
}