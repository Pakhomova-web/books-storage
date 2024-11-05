import { Box, Button, Grid } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { styled } from '@mui/material/styles';
import ProfileIcon from '@mui/icons-material/AccountCircle';
import { ApolloError } from '@apollo/client';

import {
    borderRadius,
    boxPadding,
    greenLightColor,
    pageStyles,
    primaryLightColor,
    styleVariables,
    warnColor
} from '@/constants/styles-variables';
import Loading from '@/components/loading';
import { getBookComments, getBooksFromSeries, useBook } from '@/lib/graphql/queries/book/hook';
import ErrorNotification from '@/components/error-notification';
import { TableKey } from '@/components/table/table-key';
import { BookEntity, CommentEntity } from '@/lib/data/types';
import { getParamsQueryString, isAdmin, renderPrice } from '@/utils/utils';
import CustomImage from '@/components/custom-image';
import Tag from '@/components/tag';
import CustomLink from '@/components/custom-link';
import Ages from '@/components/ages';
import ImagesModal from '@/components/modals/images-modal';
import CommentForm from '@/components/comment-form';
import SocialMediaBox from '@/components/social-media-box';
import { useAuth } from '@/components/auth-context';
import BooksList from '@/components/books-list';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const StyledSmallImageBox = styled(Box)(() => ({
    height: '120px',
    maxHeight: '30vh',
    cursor: 'pointer'
}));

const imageBoxStyles = (clickable = false) => ({
    height: '400px',
    maxHeight: '50vh',
    ...(clickable ? { cursor: 'pointer' } : {})
});

const StyledTitleGrid = styled(Grid)(({ theme }) => ({
    ...styleVariables.bigTitleFontSize(theme),
    display: 'flex',
    alignItems: 'center'
}));

const inStockStyles = (inStock = true) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: inStock ? greenLightColor : warnColor,
    borderRadius: `0 0 ${borderRadius} 0`,
    color: 'white',
    padding: boxPadding,
    display: 'flex',
    alignItems: 'center'
});

const priceStyles = (theme) => ({
    color: 'var(--background)',
    fontSize: styleVariables.bigTitleFontSize(theme),
    borderRadius,
    padding: boxPadding,
    border: `1px solid ${primaryLightColor}`
});

export default function BookDetails() {
    const router = useRouter();
    const { loading, error, item: book } = useBook(router.query.id as string);
    const [commentsPage, setCommentsPage] = useState<number>(0);
    const { user, setLikedBook, setBookInBasket } = useAuth();
    const [commentsRowsPerPage] = useState<number>(3);
    const [keys, setKeys] = useState<TableKey<BookEntity>[]>([]);
    const [mainDetailsKeys, setMainDetailsKeys] = useState<TableKey<BookEntity>[]>([]);
    const [comments, setComments] = useState<CommentEntity[]>([]);
    const [booksFromSeries, setBooksFromSeries] = useState<BookEntity[]>([]);
    const [loadingBooksFromSeries, setLoadingBooksFromSeries] = useState<boolean>(false);
    const [loadingComments, setLoadingComments] = useState<boolean>(false);
    const [commentsError, setCommentsError] = useState<ApolloError>();
    const [imageIds, setImageIds] = useState<string[] | null>();

    useEffect(() => {
        if (book) {
            refetchComments(true);
            setBooksFromSeries([]);
            setLoadingBooksFromSeries(true);
            getBooksFromSeries(book.bookSeries.id).then(books => {
                setLoadingBooksFromSeries(false);
                setBooksFromSeries(books.filter(b => b.id !== book.id));
            });
            const keys = [
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
                { title: 'Кількість сторінок', type: 'text', renderValue: (book: BookEntity) => book.numberOfPages },
                { title: 'ISBN', type: 'text', renderValue: (book: BookEntity) => book.isbn },
                { title: 'Формат, мм', type: 'text', renderValue: (book: BookEntity) => book.format }
            ];
            setKeys((keys as TableKey<BookEntity>[]).filter(key => !!key.renderValue(book)));
            setMainDetailsKeys([
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
                ...(book.authors || []).map((author, i) => ({
                    title: i === 0 ? 'Автор' : '',
                    type: 'text',
                    renderValue: () => author.name,
                    onValueClick: () => {
                        router.push(`/books?authors=${author.id}`);
                    }
                } as TableKey<BookEntity>)),
                {
                    title: 'Мова',
                    type: 'text',
                    renderValue: (book: BookEntity) => book.language?.name,
                    onValueClick: () => {
                        router.push(`/books?language=${book.language.id}`);
                    }
                }
            ]);
        }
    }, [book]);

    function refetchComments(refresh?: boolean) {
        setCommentsError(null);
        setLoadingComments(true);
        if (refresh) {
            setCommentsPage(0);
        }
        getBookComments(book.id, refresh ? 0 : commentsPage, commentsRowsPerPage)
            .then(items => {
                if (items.length < commentsRowsPerPage) {
                    setCommentsPage(-1);
                } else {
                    setCommentsPage(commentsPage + 1);
                }
                setComments(refresh ? items : [...comments, ...items]);
                setLoadingComments(false);
            })
            .catch(error => {
                setLoadingComments(false);
                setCommentsError(error);
            });
    }

    function onBackClick() {
        router.push(`/books${router.query.filters ? `?${router.query.filters}` : ''}`);
    }

    function onTagClick(tag: string) {
        router.push(`/books?tags=${tag}`);
    }

    function onAgeClick(age: number) {
        router.push(`/books?ages=${age}`);
    }

    function onBookClick(book: BookEntity) {
        router.push(`/books/details?${getParamsQueryString({ id: book.id, filters: router.query.filters })}`);
    }

    function isLiked(book: BookEntity) {
        return user?.likedBookIds?.some(id => id === book.id);
    }

    function isBookInBasket(book: BookEntity) {
        return user?.bookIdsInBasket?.some(id => id === book.id);
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
                        <Grid item
                              md={book.imageIds.length > 1 ? 9 : 12}
                              xs={book.imageIds.length > 1 ? 7 : 12}
                              position="relative">
                            {book.numberInStock ?
                                <Box sx={inStockStyles(true)}>
                                    В наявності{isAdmin(user) && ` (${book.numberInStock})`}
                                </Box> :
                                <Box sx={inStockStyles(false)}>Немає в наявності</Box>
                            }

                            {!!book.discount &&
                              <Box
                                sx={styleVariables.discountBoxStyles(!!book.numberInStock)}>Знижка: {book.discount}%</Box>}

                          <Box sx={imageBoxStyles(!!book.imageIds.length)} mb={1}
                               onClick={() => setImageIds(book.imageIds)}>
                            <CustomImage isBookDetails={true} imageId={book.imageIds[0]}></CustomImage>
                          </Box>
                        </Grid>

                        <Grid item md={3} xs={5}>
                            {book.imageIds.map((imageId, index) =>
                                (index !== 0 &&
                                  <StyledSmallImageBox key={index} mb={1} onClick={() => setImageIds(book.imageIds)}>
                                    <CustomImage isBookDetails={true} imageId={imageId}></CustomImage>
                                  </StyledSmallImageBox>
                                )
                            )}
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item p={1} sm={6} xs={12}>
                      <Grid container mb={1} gap={1} display="flex" alignItems="flex-start" flexWrap="wrap"
                            justifyContent="space-between">
                        <Grid item display="flex" gap={2} alignItems="center">
                          <Box sx={priceStyles}><b>{renderPrice(book.price, book.discount)}</b></Box>
                            {!!book.discount && <Box><s>{renderPrice(book.price)}</s></Box>}
                        </Grid>
                      </Grid>

                      <Grid container mb={2} spacing={1} display="flex" alignItems="center">
                        <Grid item xs={12} sm={6} lg={4}>
                            {isBookInBasket(book) ?
                                <Button variant="outlined" fullWidth disabled={true}>В кошику</Button> :
                                <Button variant="outlined" fullWidth
                                        onClick={() => setBookInBasket(book.id)}
                                        disabled={!book.numberInStock}>
                                    {!!book.numberInStock ? 'Купити' : 'Очікується'}
                                </Button>}
                        </Grid>

                        <Grid item xs={12} sm={6} lg={4} textAlign="center">
                          <Button onClick={() => setLikedBook(book.id)} color="warning" fullWidth>
                            <Box gap={1} display="flex" alignItems="center">{isLiked(book) ?
                                <><FavoriteIcon/>В обраному</> :
                                <><FavoriteBorderIcon/>Додати в обране</>}
                            </Box>
                          </Button>
                        </Grid>
                      </Grid>

                        {!!book.tags?.length &&
                          <Grid container mb={2} pl={1} alignItems="center" gap={1}>
                            Теги:
                              {book.tags.map((tag, index) =>
                                  <Tag key={index} tag={tag} onClick={() => onTagClick(tag)}/>)}
                          </Grid>
                        }

                        {!!book.ages?.length && <Box pl={1}>
                          <Ages selected={book.ages} showOnlySelected={true} onOptionClick={onAgeClick}></Ages>
                        </Box>}

                      <Box sx={styleVariables.sectionTitle} p={1} mb={1}>Характеристики</Box>

                        {mainDetailsKeys.map((key, index) =>
                            <Grid key={index} container borderBottom={1} borderColor={primaryLightColor}>
                                <Grid item pr={1} xs={6} my={1} px={1}>{key.title}</Grid>
                                <Grid item xs={6} my={1} px={1}>
                                    {key.onValueClick ?
                                        <CustomLink onClick={key.onValueClick}>{key.renderValue(book)}</CustomLink> :
                                        key.renderValue(book)}
                                </Grid>
                            </Grid>
                        )}
                    </Grid>

                    <Grid item xs={12} p={1}>
                      <Box sx={styleVariables.sectionTitle} p={1} mb={1}>Додаткові деталі</Box>

                      <Grid container columnSpacing={1}>
                          {keys.map((key, index) =>
                              <Grid item key={index} xs={12} md={6}>
                                  <Grid container borderBottom={1} borderColor={primaryLightColor}>
                                      <Grid item xs={6} my={1} px={1}>{key.title}</Grid>
                                      <Grid item xs={6} my={1} px={1}>
                                          {key.onValueClick ?
                                              <CustomLink
                                                  onClick={key.onValueClick}>{key.renderValue(book)}</CustomLink> :
                                              key.renderValue(book)}
                                      </Grid>
                                  </Grid>
                              </Grid>
                          )}
                      </Grid>
                    </Grid>

                      {!!book.description &&
                        <Grid item xs={12} p={1}>
                          <Box sx={styleVariables.sectionTitle} p={1} mb={1}>Опис</Box>
                          <Box px={1} dangerouslySetInnerHTML={{ __html: book.description }}></Box>
                        </Grid>
                      }

                    <Grid item xs={12} p={1}>
                      <Box sx={styleVariables.sectionTitle} p={1} mb={1}>
                        Відгуки покупців
                      </Box>

                      <Grid container spacing={2} sx={styleVariables.positionRelative} px={1}>
                        <Loading show={!loading && loadingComments}></Loading>

                        <Grid item xs={12} md={7} lg={8} display="flex" alignItems="center" justifyContent="center">
                            {!!comments?.length ?
                                <Box>
                                    {comments.map((comment, index) => (
                                        <Box key={index} borderBottom={1} pb={2}
                                             borderColor={primaryLightColor}>
                                            <Box mb={1} display="flex" justifyContent="space-between">
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <ProfileIcon fontSize="large"/><b>{comment.username}</b>
                                                </Box>
                                                <Box sx={styleVariables.hintFontSize}>
                                                    {new Date(comment.date).toLocaleDateString()}
                                                </Box>
                                            </Box>
                                            <Box>{comment.value}</Box>
                                        </Box>
                                    ))}

                                    <Box display="flex" justifyContent="center" mt={1}>
                                        {commentsPage !== -1 &&
                                          <Button variant="outlined" onClick={() => refetchComments()}>
                                            Показате ще
                                          </Button>}
                                    </Box>
                                </Box> :
                                <Box display="flex" alignItems="center" flexDirection="column" gap={1}>
                                    <Box sx={{ width: '100px' }}>
                                        <CustomImage isNoComments={true}></CustomImage>
                                    </Box>
                                    <Box>
                                        На даний момент список відгуків порожній
                                    </Box>
                                    <Box sx={styleVariables.hintFontSize}>Додайте свій відгук про товар</Box>
                                </Box>}
                        </Grid>

                        <Grid item xs={12} md={5} lg={4}>
                          <Box py={2} pl={2}>
                            <CommentForm bookId={book.id}></CommentForm>
                          </Box>
                        </Grid>

                          {commentsError && <ErrorNotification error={commentsError}></ErrorNotification>}
                      </Grid>
                    </Grid>

                    <Grid item xs={12} px={1}>
                      <Box sx={styleVariables.sectionTitle} p={1} mb={2}>
                        Інші книги із цієї серії
                      </Box>

                      <Grid container spacing={2} sx={styleVariables.positionRelative} px={1} display="flex"
                            justifyContent="center">
                        <Loading show={loadingBooksFromSeries}></Loading>

                        <BooksList items={booksFromSeries} onClick={onBookClick}></BooksList>
                          {!booksFromSeries?.length &&
                            <Grid item xs={12} display="flex" justifyContent="center">
                              В цій серії більше немає книг
                            </Grid>}
                      </Grid>
                    </Grid>
                  </Grid>
                }

                {!!imageIds?.length &&
                  <ImagesModal open={true} imageIds={imageIds} onClose={() => setImageIds(null)}></ImagesModal>}

                {error && <ErrorNotification error={error}></ErrorNotification>}

                <SocialMediaBox></SocialMediaBox>
            </Box>
        </Box>
    );
}
