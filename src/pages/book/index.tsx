import { Box, Button, Grid } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import HdrStrongIcon from '@mui/icons-material/HdrStrong';
import HdrWeakIcon from '@mui/icons-material/HdrWeak';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { pageStyles, styleVariables } from '@/constants/styles-variables';
import Loading from '@/components/loading';
import { useBook } from '@/lib/graphql/queries/book/hook';
import ErrorNotification from '@/components/error-notification';
import { TableKey } from '@/components/table/table-key';
import { BookEntity } from '@/lib/data/types';
import { renderPrice } from '@/utils/utils';
import { styled } from '@mui/material/styles';
import CustomImage from '@/components/custom-image';

const bookBoxStyles = { height: '300px', maxHeight: '60vw' };

const titleStyles = (bold: boolean) => ({
    ...styleVariables.titleFontSize,
    display: 'flex',
    alignItems: 'center',
    ...(bold ? styleVariables.boldFont : {})
});

const StyledGrid = styled(Grid)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover
    }
}));

export default function Book() {
    const router = useRouter();
    const { loading, error, item } = useBook(router.query.id as string);
    const [keys, setKeys] = useState<TableKey<BookEntity>[]>([]);

    useEffect(() => {
        if (item) {
            setKeys(([
                {
                    title: 'Publishing house',
                    type: 'text',
                    renderValue: (book: BookEntity) => book.bookSeries.publishingHouse.name
                },
                { title: 'Series', type: 'text', renderValue: (book: BookEntity) => book.bookSeries.name },
                { title: 'Type', type: 'text', renderValue: (book: BookEntity) => book.bookType.name },
                { title: 'Page type', type: 'text', renderValue: (book: BookEntity) => book.pageType?.name },
                { title: 'Cover type', type: 'text', renderValue: (book: BookEntity) => book.coverType?.name },
                { title: '# of pages', type: 'text', renderValue: (book: BookEntity) => book.numberOfPages },
                { title: 'Author', type: 'text', renderValue: (book: BookEntity) => book.author?.name },
                { title: 'Language', type: 'text', renderValue: (book: BookEntity) => book.language?.name },
                { title: 'ISBN', type: 'text', renderValue: (book: BookEntity) => book.isbn },
                { title: 'Format', type: 'text', renderValue: (book: BookEntity) => book.format }
            ] as TableKey<BookEntity>[]).filter(key => !!key.renderValue(item)));
        }
    }, [item]);
    return (
        <Box sx={styleVariables.positionRelative}>
            <Loading show={loading}></Loading>

            <Box sx={pageStyles}>
                <Grid container>
                    <Grid item sm={6} p={1}>
                        <Button variant="outlined" onClick={() => router.push('/')}>
                            <ArrowBackIcon/>Back
                        </Button>
                    </Grid>

                    {item &&
                      <Grid item sm={6} p={1} sx={titleStyles(true)}>{item.name}</Grid>
                    }
                </Grid>

                {item &&
                  <Grid container>
                    <Grid item p={1} sm={6} xs={12}>
                      <Box sx={bookBoxStyles} mb={1}>
                        <CustomImage imageId={item.imageId}></CustomImage>
                      </Box>
                    </Grid>

                    <Grid item p={1} sm={6} xs={12}>
                      <Grid container mb={3}>
                        <Grid item xs={6} px={1}>
                          <Box display="flex" alignItems="center" gap={1}>
                              {item.numberInStock ?
                                  <><HdrStrongIcon style={{ color: "green" }}/>In stock</> :
                                  <><HdrWeakIcon style={{ color: styleVariables.warnColor }}/>Out of stock</>
                              }
                          </Box>
                        </Grid>

                        <Grid item xs={6} px={1} sx={titleStyles(!!item.numberInStock)}>
                            {renderPrice(item.price)} грн
                        </Grid>
                      </Grid>

                        {keys.map((key, index) =>
                            <StyledGrid key={index} container>
                                <Grid item pr={1} xs={6} my={1} px={1}>{key.title}</Grid>
                                <Grid item xs={6} my={1} px={1}>{key.renderValue(item)}</Grid>
                            </StyledGrid>
                        )}

                        {!!item.description &&
                          <Box m={1}>
                            <Box mb={1}><b>Description</b></Box>
                            <Box>{item.description}</Box>
                          </Box>
                        }
                    </Grid>
                  </Grid>
                }

                {error && <ErrorNotification error={error}></ErrorNotification>}
            </Box>
        </Box>
    );
}
