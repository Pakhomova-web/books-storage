import { Box, Button, Grid } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { styled } from '@mui/material/styles';
import ProfileIcon from '@mui/icons-material/AccountCircle';
import { ApolloError } from '@apollo/client';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { priceStyles, primaryLightColor, styleVariables } from '@/constants/styles-variables';
import Loading from '@/components/loading';
import { getBookComments, getBooksByAuthors, getBooksFromSeries, useBook } from '@/lib/graphql/queries/book/hook';
import ErrorNotification from '@/components/error-notification';
import { TableKey } from '@/components/table/table-key';
import { BookEntity, CommentEntity } from '@/lib/data/types';
import { isAdmin, renderPrice } from '@/utils/utils';
import CustomImage from '@/components/custom-image';
import Tag from '@/components/tag';
import CustomLink from '@/components/custom-link';
import Ages from '@/components/ages';
import ImagesModal from '@/components/modals/images-modal';
import CommentForm from '@/components/comment-form';
import SocialMediaBox from '@/components/social-media-box';
import { useAuth } from '@/components/auth-context';
import BooksList from '@/components/books-list';
import DeliveriesBox from '@/components/deliveries-box';

const StyledPublishingHouseImageBox = styled(Box)(() => ({
    height: '40px',
    width: '80px',
    maxHeight: '20vh'
}));

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

const numberBooksByAuthor = 4;

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
    const [booksByAuthor, setBooksByAuthor] = useState<BookEntity[]>([]);
    const [loadingBooksByAuthor, setLoadingBooksByAuthor] = useState<boolean>(false);
    const [loadingComments, setLoadingComments] = useState<boolean>(false);
    const [commentsError, setCommentsError] = useState<ApolloError>();
    const [imageIds, setImageIds] = useState<string[] | null>();

    useEffect(() => {
        if (book) {
            refetchComments(true);
            setBooksByAuthor([]);
            if (book.authors.length === 1) {
                setLoadingBooksByAuthor(true);
                getBooksByAuthors(book.authors[0].id, numberBooksByAuthor, !book.bookSeries.default ? book.bookSeries.id : null)
                    .then(books => {
                        setLoadingBooksByAuthor(false);
                        setBooksByAuthor(books.filter(b => b.id !== book.id));
                    });
            }
            setBooksFromSeries([]);
            if (!book.bookSeries.default) {
                setLoadingBooksFromSeries(true);
                getBooksFromSeries(book.bookSeries.id).then(books => {
                    setLoadingBooksFromSeries(false);
                    setBooksFromSeries(books.filter(b => b.id !== book.id));
                });
            }
            const keys = [
                {
                    title: 'Мова',
                    type: 'text',
                    renderValue: (book: BookEntity) => book.language?.name,
                    onValueClick: () => {
                        router.push(`/books?language=${book.language.id}`);
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
                { title: 'ISBN', type: 'text', renderValue: (book: BookEntity) => book.isbn },
                { title: 'Формат, мм', type: 'text', renderValue: (book: BookEntity) => book.format }
            ];
            setKeys((keys as TableKey<BookEntity>[]).filter(key => !!key.renderValue(book)));
            setMainDetailsKeys([
                {
                    title: 'Серія',
                    type: 'text',
                    renderValue: (book: BookEntity) => book.bookSeries.default ? '' : book.bookSeries.name,
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
                { title: 'Кількість сторінок', type: 'text', renderValue: (book: BookEntity) => book.numberOfPages }
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
        router.push(`${router.query.pageUrl ? router.query.pageUrl : '/books'}${router.query.filters ? `?${router.query.filters}` : ''}`);
    }

    function onTagClick(tag: string) {
        router.push(`/books?tags=${tag}`);
    }

    function onAgeClick(age: number) {
        router.push(`/books?ages=${age}`);
    }

    function onPublishingHouseClick() {
        router.push(`/books?publishingHouse=${book.bookSeries.publishingHouse.id}`);
    }

    function isLiked(book: BookEntity) {
        return user?.likedBookIds?.some(id => id === book.id);
    }

    function isBookInBasket(book: BookEntity) {
        return user?.basketItems?.some(item => item.bookId === book.id);
    }

    return (
        <>
            <Loading show={loading}></Loading>

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
                          xs={12}
                          display="flex" justifyContent="center" alignItems="center"
                          position="relative">
                        {book.numberInStock ?
                            <Box sx={styleVariables.fixedInStockBox(true)}>
                                В наявності{isAdmin(user) && ` (${book.numberInStock})`}
                            </Box> :
                            <Box sx={styleVariables.fixedInStockBox(false)}>Немає в наявності</Box>
                        }

                        {!!book.discount &&
                          <Box sx={styleVariables.fixedDiscountBox(true)}>
                            Знижка: {book.discount}%
                          </Box>}

                      <Box sx={imageBoxStyles(!!book.imageIds.length)} mb={1}
                           onClick={() => setImageIds(book.imageIds)}>
                        <CustomImage isBookDetails={true} imageId={book.imageIds[0]}></CustomImage>
                      </Box>
                    </Grid>

                    <Grid item md={3} xs={12} display="flex" flexDirection={{ xs: 'row', md: 'column' }} gap={1}
                          justifyContent="center">
                        {book.imageIds.map((imageId, index) =>
                            (index !== 0 &&
                              <StyledSmallImageBox key={index} onClick={() => setImageIds(book.imageIds)}>
                                <CustomImage isBookDetails={true} imageId={imageId}></CustomImage>
                              </StyledSmallImageBox>
                            )
                        )}
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item p={1} sm={6} xs={12}>
                  <Box display="flex" gap={1} alignItems="center"
                       justifyContent={{ xs: 'center', md: 'flex-start' }} mb={1}>
                    <Box sx={priceStyles}><b>{renderPrice(book.price, book.discount)}</b></Box>
                      {!!book.discount && <Box><s>{renderPrice(book.price)}</s></Box>}
                  </Box>

                  <Grid container mb={2} spacing={1} display="flex">
                    <Grid item xs={12} md={6} textAlign="center" display="flex" gap={1} flexDirection="column">
                        {isBookInBasket(book) ?
                            <Button variant="outlined" fullWidth disabled={true}>В кошику</Button> :
                            <Button variant="outlined" fullWidth
                                    onClick={() => setBookInBasket(book.id)}
                                    disabled={!book.numberInStock}>
                                {!!book.numberInStock ? 'Купити' : 'Очікується'}
                            </Button>}

                      <Button onClick={() => setLikedBook(book.id)} color="warning" fullWidth>
                        <Box gap={1} display="flex" alignItems="center">{isLiked(book) ?
                            <><FavoriteIcon/>В обраному</> :
                            <><FavoriteBorderIcon/>Додати в обране</>}
                        </Box>
                      </Button>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Box sx={styleVariables.sectionTitle}>
                        Видавництво
                      </Box>

                      <Box gap={1} display="flex" flexWrap="nowrap" sx={styleVariables.cursorPointer}
                           justifyContent="space-between" p={1} onClick={onPublishingHouseClick}>
                        <Box>{book.bookSeries.publishingHouse.name}</Box>
                          {!!book.bookSeries.publishingHouse.imageId &&
                            <StyledPublishingHouseImageBox>
                              <CustomImage imageId={book.bookSeries.publishingHouse.imageId}></CustomImage>
                            </StyledPublishingHouseImageBox>}
                      </Box>
                    </Grid>
                  </Grid>

                    {!!book.tags?.length &&
                      <Grid container mb={2} pl={1} alignItems="center" gap={1}>
                        Теги:
                          {book.tags.map((tag, index) =>
                              <Tag key={index} tag={tag} onClick={() => onTagClick(tag)}/>)}
                      </Grid>
                    }

                    {!!book.ages?.length &&
                      <Box pl={1}>
                        <Ages selected={book.ages} showOnlySelected={true} onOptionClick={onAgeClick}></Ages>
                      </Box>}


                  <Box sx={styleVariables.sectionTitle} mb={1}>Характеристики</Box>

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
                  <Box sx={styleVariables.sectionTitle} mb={1}>Додаткові деталі</Box>

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

                  {(!!book.description || !!book.bookSeries.description) &&
                    <Grid item xs={12} p={1}>
                      <Box sx={styleVariables.sectionTitle}>Опис</Box>
                    </Grid>}

                  {!!book.bookSeries.description &&
                    <Grid item xs={12} p={1}>
                      <Box px={1} dangerouslySetInnerHTML={{ __html: book.bookSeries.description }}></Box>
                    </Grid>}

                  {!!book.description &&
                    <Grid item xs={12} p={1}>
                      <Box px={1} dangerouslySetInnerHTML={{ __html: book.description }}></Box>
                    </Grid>}

                <Grid item xs={12} p={1}>
                  <Box sx={styleVariables.sectionTitle} mb={1}>
                    Відгуки покупців
                  </Box>

                  <Grid container spacing={2} position="relative" px={1}>
                    <Loading show={!loading && loadingComments}></Loading>

                    <Grid item xs={12} md={7} lg={8} display="flex" alignItems="center" justifyContent="center">
                        {!!comments?.length ?
                            <Box width="100%">
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
                                <Box width="100px">
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

                  {!book.bookSeries.default && <Grid item xs={12} px={1}>
                    <Box sx={styleVariables.sectionTitle} mb={2}>
                      Інші книги із цієї серії
                    </Box>

                    <Grid container spacing={2} position="relative" px={1} display="flex"
                          justifyContent="center">
                      <Loading show={loadingBooksFromSeries}></Loading>

                      <BooksList items={booksFromSeries} pageUrl={router.query.pageUrl as string}></BooksList>
                        {!booksFromSeries?.length &&
                          <Grid item xs={12} mb={2} display="flex" justifyContent="center">
                            В цій серії більше немає книг
                          </Grid>}
                    </Grid>
                  </Grid>}

                  {book.authors.length === 1 && !!booksByAuthor?.length && <Grid item xs={12} px={1}>
                    <Box sx={styleVariables.sectionTitle} mb={2}>
                      Інші книги цього автора
                    </Box>

                    <Grid container spacing={2} position="relative" px={1} display="flex"
                          justifyContent="center">
                      <Loading show={loadingBooksByAuthor}></Loading>

                      <BooksList items={booksByAuthor} pageUrl={router.query.pageUrl as string}></BooksList>

                        {booksByAuthor.length === numberBooksByAuthor && <Grid item xs={12} textAlign="center" mb={2}>
                          <Button variant="outlined"
                                  onClick={() => router.push(`/books?authors=${book.authors[0].id}`)}>
                            Дивитися усі<ArrowForwardIcon/></Button>
                        </Grid>}
                    </Grid>
                  </Grid>}
              </Grid>
            }

            {!!imageIds?.length &&
              <ImagesModal open={true} imageIds={imageIds} onClose={() => setImageIds(null)}></ImagesModal>}

            {error && <ErrorNotification error={error}></ErrorNotification>}

            <DeliveriesBox/>

            <SocialMediaBox/>
        </>
    );
}
