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
import Tag from '@/components/tag';
import CustomLink from '@/components/custom-link';

const StyledSmallImageBox = styled(Box)(() => ({
    height: '120px',
    maxHeight: '30vh'
}));

const StyledImageBox = styled(Box)(() => ({
    height: '400px',
    maxHeight: '50vh'
}));

const StyledTitleGrid = styled(Grid)(({ theme }) => ({
    ...styleVariables.bigTitleFontSize(theme),
    display: 'flex',
    alignItems: 'center'
}));

const StyledStripedGrid = styled(Grid)(() => ({
    '&:nth-of-type(even)': {
        backgroundColor: styleVariables.gray,
        borderRadius: styleVariables.borderRadius
    }
}));

export default function BookDetails() {
    const router = useRouter();
    const { loading, error, item: book } = useBook(router.query.id as string);
    const [keys, setKeys] = useState<TableKey<BookEntity>[]>([]);

    useEffect(() => {
        if (book) {
            const keys = [
                {
                    title: 'Видавництво',
                    type: 'text',
                    renderValue: (book: BookEntity) => book.bookSeries.publishingHouse.name,
                    onValueClick: () => {
                        router.push(`/books?publishingHouse=${book.bookSeries.publishingHouse.id}`);
                    }
                },
                {
                    title: 'Серія',
                    type: 'text',
                    renderValue: (book: BookEntity) => book.bookSeries.name === '-' ? '' : book.bookSeries.name,
                    onValueClick: () => {
                        router.push(`/books?bookSeries=${book.bookSeries.id}`);
                    }
                },
                {
                    title: 'Тип',
                    type: 'text',
                    renderValue: (book: BookEntity) => book.bookType.name,
                    onValueClick: () => {
                        router.push(`/books?bookType=${book.bookType.id}`);
                    }
                },
                { title: 'Тип сторінок', type: 'text', renderValue: (book: BookEntity) => book.pageType?.name },
                { title: 'Тип обкладинки', type: 'text', renderValue: (book: BookEntity) => book.coverType?.name },
                { title: 'Кількість сторінок', type: 'text', renderValue: (book: BookEntity) => book.numberOfPages }
            ];
            book.authors?.forEach((author, i) => {
                keys.push(
                    {
                        title: i === 0 ? 'Автор' : '',
                        type: 'text',
                        renderValue: () => author.name,
                        onValueClick: () => {
                            router.push(`/books?authors=${author.id}`);
                        }
                    }
                );
            });
            keys.push(...[
                {
                    title: 'Мова',
                    type: 'text',
                    renderValue: (book: BookEntity) => book.language?.name,
                    onValueClick: () => {
                        router.push(`/books?language=${book.language.id}`);
                    }
                },
                { title: 'ISBN', type: 'text', renderValue: (book: BookEntity) => book.isbn },
                { title: 'Формат, мм', type: 'text', renderValue: (book: BookEntity) => book.format }
            ]);
            setKeys((keys as TableKey<BookEntity>[]).filter(key => !!key.renderValue(book)));
        }
    }, [book]);

    function onBackClick() {
        router.push(`/books${router.query.filters ? `?${router.query.filters}` : ''}`);
    }

    function onTagClick(tag: string) {
        router.push(`/books?tags=${tag}`);
    }

    return (
        <Box sx={styleVariables.positionRelative}>
            <Loading show={loading}></Loading>

            <Box sx={pageStyles}>
                <Grid container>
                    <Grid item sm={6} p={1}>
                        <Button variant="outlined" onClick={onBackClick}>
                            <ArrowBackIcon/>Назад
                        </Button>
                    </Grid>

                    {book && <StyledTitleGrid item sm={6} p={1}>{book.name}</StyledTitleGrid>}
                </Grid>

                {book &&
                  <Grid container>
                    <Grid item p={1} sm={6} xs={12}>
                      <Grid container>
                        <Grid item md={book.imageIds.length > 1 ? 9 : 12} xs={book.imageIds.length > 1 ? 7 : 12}>
                          <StyledImageBox mb={1}>
                            <CustomImage isBookDetails={true} imageId={book.imageIds[0]}></CustomImage>
                          </StyledImageBox>
                        </Grid>

                        <Grid item md={3} xs={5}>
                            {book.imageIds.map((imageId, index) =>
                                (index !== 0 &&
                                  <StyledSmallImageBox key={index} mb={1}>
                                    <CustomImage isBookDetails={true} imageId={imageId}></CustomImage>
                                  </StyledSmallImageBox>
                                )
                            )}
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item p={1} sm={6} xs={12}>
                      <Grid container mb={3}>
                        <Grid item xs={6} px={1} display="flex" alignItems="center">
                          <Box display="flex" alignItems="center" gap={1}>
                              {book.numberInStock ?
                                  <><HdrStrongIcon style={{ color: "green" }}/>В наявності</> :
                                  <><HdrWeakIcon style={{ color: styleVariables.warnColor }}/>Відсутня</>
                              }
                          </Box>
                        </Grid>

                        <StyledTitleGrid item xs={6} px={1} sx={!!book.numberInStock ? styleVariables.boldFont : {}}>
                            {renderPrice(book.price)} грн
                        </StyledTitleGrid>
                      </Grid>

                        {!!book.tags?.length &&
                          <Grid container mb={2} pl={1} alignItems="center" gap={1}>
                            Tags:
                              {book.tags.map((tag, index) =>
                                  <Tag key={index} tag={tag} onClick={() => onTagClick(tag)}/>)}
                          </Grid>
                        }

                        {keys.map((key, index) =>
                            <StyledStripedGrid key={index} container>
                                <Grid item pr={1} xs={6} my={1} px={1}>{key.title}</Grid>
                                <Grid item xs={6} my={1} px={1}>
                                    {key.onValueClick ?
                                        <CustomLink onClick={key.onValueClick}>{key.renderValue(book)}</CustomLink> :
                                        key.renderValue(book)}
                                </Grid>
                            </StyledStripedGrid>
                        )}

                        {!!book.description &&
                          <Box m={1}>
                            <Box mb={1}><b>Опис</b></Box>
                            <Box>{book.description}</Box>
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
