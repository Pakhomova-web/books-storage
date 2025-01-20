import { Box, Button, Grid, IconButton, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { styled } from '@mui/material/styles';
import ProfileIcon from '@mui/icons-material/AccountCircle';
import { ApolloError } from '@apollo/client';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import useMediaQuery from '@mui/material/useMediaQuery';
import EditIcon from '@mui/icons-material/Edit';

import { priceStyles, primaryLightColor, styleVariables } from '@/constants/styles-variables';
import Loading from '@/components/loading';
import {
    getBookComments,
    getBooksByAuthors,
    getBooksFromSeries,
    useBook
} from '@/lib/graphql/queries/book/hook';
import ErrorNotification from '@/components/error-notification';
import { TableKey } from '@/components/table/table-key';
import { BookEntity, CommentEntity } from '@/lib/data/types';
import { isAdmin, renderPrice } from '@/utils/utils';
import CustomImage from '@/components/custom-image';
import Tag from '@/components/tag';
import CustomLink from '@/components/custom-link';
import Ages from '@/components/ages';
import ImagesModal from '@/components/modals/images-modal';
import CommentForm from '@/components/form-fields/comment-form';
import SocialMediaBox from '@/components/social-media-box';
import { useAuth } from '@/components/auth-context';
import BooksList from '@/components/books/books-list';
import DeliveriesBox from '@/components/deliveries-box';
import DiscountBooks from '@/components/books/discount-books';
import RecentlyViewedBooks from '@/components/books/recently-viewed-books';
import IconWithText from '@/components/icon-with-text';
import BookModal from '@/components/modals/book-modal';
import Catalogue from '@/components/catalogue';
import GroupDiscountBooks from '@/components/books/group-discount-section';
import ClickableOption from '@/components/clickable-option';
import { MAIN_DESC, MAIN_NAME } from '@/constants/main-name';
import Head from 'next/head';
import { getBookPartById } from '@/lib/data/books';

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
    display: 'flex',
    alignItems: 'center',
    'h1': {
        ...styleVariables.bigTitleFontSize(theme)
    }
}));


export async function getServerSideProps(context) {
    const { id } = context.params;

    console.log(context);
    const bookPart = await getBookPartById(id);

    return {
        props: {
            bookPart
        }
    };
}

export default function BookDetails({ bookPart }) {
    const router = useRouter();
    const theme = useTheme();
    const mobileMatches = useMediaQuery(theme.breakpoints.down('md'));
    const { loading, error, item: book, refetch } = useBook(router.query.id as string);
    const [commentsPage, setCommentsPage] = useState<number>(0);
    const { user, setLikedBook, setBookInBasket, setRecentlyViewedBooks } = useAuth();
    const [commentsRowsPerPage] = useState<number>(3);
    const [keys, setKeys] = useState<TableKey<BookEntity>[]>([]);
    const [authorsKeys, setAuthorsKeys] = useState<TableKey<BookEntity>[]>([]);
    const [mainDetailsKeys, setMainDetailsKeys] = useState<TableKey<BookEntity>[]>([]);
    const [comments, setComments] = useState<CommentEntity[]>([]);
    const [booksFromSeries, setBooksFromSeries] = useState<BookEntity[]>([]);
    const [loadingBooksFromSeries, setLoadingBooksFromSeries] = useState<boolean>(false);
    const [booksByAuthor, setBooksByAuthor] = useState<BookEntity[]>([]);
    const [loadingBooksByAuthor, setLoadingBooksByAuthor] = useState<boolean>(false);
    const [loadingComments, setLoadingComments] = useState<boolean>(false);
    const [commentsError, setCommentsError] = useState<ApolloError>();
    const [imageIds, setImageIds] = useState<string[] | null>();
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [refetching, setRefetching] = useState<boolean>(false);

    useEffect(() => {
        if (book) {
            setRecentlyViewedBooks(book.id);
            refetchComments(true);
            setBooksByAuthor([]);
            if (book.authors.length === 1) {
                setLoadingBooksByAuthor(true);
                getBooksByAuthors(book.authors[0].id, mobileMatches ? 2 : 5, !book.bookSeries.default ? book.bookSeries.id : null)
                    .then(books => {
                        setLoadingBooksByAuthor(false);
                        setBooksByAuthor(books.filter(b => b.id !== book.id));
                    });
            }
            setBooksFromSeries([]);
            if (!book.bookSeries.default) {
                setLoadingBooksFromSeries(true);
                getBooksFromSeries(book.id, mobileMatches ? 2 : 5).then(books => {
                    setLoadingBooksFromSeries(false);
                    setBooksFromSeries(books);
                });
            }
            const keys = [
                { title: 'Тип сторінок', type: 'text', renderValue: (book: BookEntity) => book.pageType?.name },
                { title: 'Обкладинка', type: 'text', renderValue: (book: BookEntity) => book.coverType?.name },
                { title: 'ISBN', type: 'text', renderValue: (book: BookEntity) => book.isbn },
                { title: 'Формат, мм', type: 'text', renderValue: (book: BookEntity) => book.format }
            ];
            setKeys((keys as TableKey<BookEntity>[]).filter(key => !!key.renderValue(book)));
            setAuthorsKeys((book.authors || []).map((author, i) => ({
                title: i === 0 ? 'Автор' : '',
                type: 'text',
                renderValue: () => author.name,
                onValueClick: () => {
                    router.push(`/books?authors=${author.id}`);
                }
            } as TableKey<BookEntity>)));
            setMainDetailsKeys([
                {
                    title: 'Серія',
                    type: 'text',
                    renderValue: (book: BookEntity) => book.bookSeries.default ? '' : book.bookSeries.name,
                    onValueClick: () => {
                        router.push(`/books?bookSeries=${book.bookSeries.id}`);
                    }
                },
                ...(book.illustrators || []).map((illustrator, i) => ({
                    title: i === 0 ? 'Іллюстратор' : '',
                    type: 'text',
                    renderValue: () => illustrator.name,
                    onValueClick: () => {
                        router.push(`/books?authors=${illustrator.id}`);
                    }
                } as TableKey<BookEntity>)),
                ...(book.bookTypes || []).map((bookType, i) => ({
                    title: i === 0 ? 'Тип' : '',
                    type: 'text',
                    renderValue: () => bookType.name,
                    onValueClick: () => {
                        router.push(`/books?bookTypes=${bookType.id}`);
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

    function onGroupDiscountBookClick(bookId: string) {
        router.push(`/books/${bookId}${router.query.pageUrl ? `&pageUrl=${router.query.pageUrl}` : ''}${router.query.filters ? router.query.filters : ''}`);
    }

    function onBackClick() {
        router.push(`${router.query.pageUrl ? router.query.pageUrl : '/'}${router.query.filters ? `?${router.query.filters}` : ''}`);
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

    function renderDetailsRow(index: number, key: TableKey<BookEntity>, fullWidth = false) {
        return (
            !!key.renderValue(book) &&
            <Grid item key={index} xs={12} md={fullWidth ? 12 : 6} display="flex" alignItems="center">
              <Grid container borderBottom={1} borderColor={primaryLightColor}>
                <Grid item pr={1} xs={6} my={1} px={1}>{key.title}</Grid>
                <Grid item xs={6} my={1} px={1}>
                    {key.onValueClick ?
                        <CustomLink onClick={key.onValueClick}>{key.renderValue(book)}</CustomLink> :
                        key.renderValue(book)}
                </Grid>
              </Grid>
            </Grid>
        );
    }

    function onCloseEditModal(updated: boolean) {
        setShowEditModal(false);
        if (updated) {
            setRefetching(true)
            refetch().then(() => setRefetching(false));
        }
    }

    function onCopyDetails() {
        let res = '';

        if (book.format) {
            res = `${res}\nФормат: ${book.format} мм.`;
        }
        res = `${res}\nОбкладинка: ${book.coverType.name}.`;
        res = `${res}\nСтр: ${book.numberOfPages}. ${book.pageType.name}.`;
        res = `${res}\nЦіна: ${renderPrice(book.price)}.`;
        navigator.clipboard.writeText(res);
    }

    function onCopyDescriptionClick(description: string) {
        navigator.clipboard.writeText(description.replaceAll('</br>', '').replaceAll('<li>', '').replaceAll('</li>', ''));
    }

    function onLanguageBookClick(id: string) {
        router.push(`/books/${id}`);
    }

    return (
        <>
            {bookPart &&
              <Head>
                <title>{bookPart.name + '- купити в ' + MAIN_NAME}</title>,
                <meta name="description"
                      content={`Ціна: ${renderPrice(bookPart.price, bookPart.discount)}. Відеоогляди в нашому інстаграм. Відправка кожного дня.`}/>
                <meta name="og:title" content={`${bookPart.name} - купити в ${MAIN_NAME}`}/>
                <meta name="og:description"
                      content={`Ціна: ${renderPrice(bookPart.price, bookPart.discount)}. Відеоогляди в нашому інстаграм. Відправка кожного дня.`}/>
                  {!!bookPart.imageId && <>
                    <meta name="image" content={`https://drive.google.com/thumbnail?id=${bookPart.imageId}&sz=w1000`}/>
                    <meta name="og:image"
                          content={`https://drive.google.com/thumbnail?id=${bookPart.imageId}&sz=w1000`}/>
                  </>}
              </Head>
            }
            <Loading show={loading || refetching}></Loading>

            <Catalogue/>

            <Grid container display="flex" alignItems="center" mb={!book ? 1 : 0}>
                <Grid item sm={6}>
                    <Button variant="outlined" onClick={onBackClick}><ArrowBackIcon/>Назад</Button>
                </Grid>

                {book &&
                  <StyledTitleGrid item sm={6} p={1} display="flex" gap={1}>
                    <h1>{book.name}</h1>
                      {isAdmin(user) && <IconButton onClick={() => setShowEditModal(true)}><EditIcon/></IconButton>}
                  </StyledTitleGrid>}
            </Grid>

            {book && <>
              <Grid container spacing={2} mb={1}>
                <Grid item sm={6} xs={12}>
                  <Grid container>
                    <Grid item
                          md={book.imageIds?.length > 1 ? 9 : 12}
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

                      <Box sx={imageBoxStyles(!!book.imageIds?.length)} mb={1}
                           onClick={() => setImageIds(book.imageIds)}>
                        <CustomImage isBookDetails={true}
                                     imageId={book.imageIds ? book.imageIds[0] : null}></CustomImage>
                      </Box>
                    </Grid>

                    <Grid item md={3} xs={12} display="flex" flexDirection={{ xs: 'row', md: 'column' }} gap={1}
                          justifyContent="center">
                        {book.imageIds?.map((imageId, index) =>
                            (index !== 0 &&
                              <StyledSmallImageBox key={index} onClick={() => setImageIds(book.imageIds)}>
                                <CustomImage isBookDetails={true} imageId={imageId}></CustomImage>
                              </StyledSmallImageBox>
                            )
                        )}
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item sm={6} xs={12}>
                  <Box display="flex" gap={1} alignItems="center"
                       justifyContent={{ xs: 'center', md: 'flex-start' }} mb={1}>
                    <Box sx={priceStyles}><b>{renderPrice(book.price, book.discount)}</b></Box>
                      {!!book.discount && <Box><s>{renderPrice(book.price)}</s></Box>}
                  </Box>

                  <Grid container spacing={2} display="flex">
                    <Grid item xs={12} md={6} textAlign="center" display="flex" gap={1} flexDirection="column">
                        {isBookInBasket(book) ?
                            <Button variant="outlined" fullWidth disabled={true}>В кошику</Button> :
                            <Button variant="outlined" fullWidth
                                    onClick={() => setBookInBasket(book.id)}
                                    disabled={!book.numberInStock || book.archived}>
                                {book.archived ? 'Відсутня' : (!!book.numberInStock ? 'Купити' : 'Очікується')}
                            </Button>}

                      <Button onClick={() => setLikedBook(book.id)} color="warning" fullWidth disabled={book.archived}>
                        <Box gap={1} display="flex" alignItems="center">{isLiked(book) ?
                            <><FavoriteIcon/>В обраному</> :
                            <><FavoriteBorderIcon/>Додати в обране</>}
                        </Box>
                      </Button>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Box sx={styleVariables.sectionTitle}>Видавництво</Box>

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
                      <Grid container pl={1} alignItems="center" gap={1}>
                        Теги:
                          {book.tags.map((tag, index) =>
                              <Tag key={index} tag={tag} onClick={() => onTagClick(tag)}/>)}
                      </Grid>}

                  <Grid container pl={1} alignItems="center" gap={1}>
                    Мова:
                    <ClickableOption selected={true}>{book.languages.map(l => l.name).join(', ')}</ClickableOption>

                      {book.languageBooks.map((item, index) =>
                          <Box key={index}>
                              <ClickableOption onClick={() => onLanguageBookClick(item.id)}>
                                  {item.languages.map(l => l.name).join(', ')}
                              </ClickableOption>
                          </Box>)}
                  </Grid>

                    {!!book.ages?.length &&
                      <Box pl={1}>
                        <Ages selected={book.ages} showOnlySelected={true} onOptionClick={onAgeClick}></Ages>
                      </Box>}


                  <Box sx={styleVariables.sectionTitle} mb={1}>Характеристики</Box>

                    {[...mainDetailsKeys, ...(authorsKeys.length > 5 ? [] : authorsKeys)]
                        .map((key, index) => renderDetailsRow(index, key, true))}
                </Grid>
              </Grid>

                {authorsKeys.length > 5 &&
                  <Grid container columnSpacing={1} mb={1}>
                      {authorsKeys.map((key, index) => renderDetailsRow(index, key))}
                  </Grid>}

              <Box sx={styleVariables.sectionTitle} mb={1}>Додаткові деталі</Box>

              <Grid container mb={1} columnSpacing={1}>
                  {keys.map((key, index) => renderDetailsRow(index, key))}
              </Grid>

                {isAdmin(user) && <Button fullWidth onClick={() => onCopyDetails()}>
                  Скопіювати додаткові деталі
                </Button>}

              <Grid container spacing={2}>
                <Grid item xs={12}>
                    {(!!book.description || !!book.bookSeries.description) &&
                      <Box sx={styleVariables.sectionTitle} mb={2}>Опис</Box>}

                    {!!book.bookSeries.description && <>
                      <Box px={1} mb={!!book.description ? 1 : 0}
                           dangerouslySetInnerHTML={{ __html: book.bookSeries.description }}></Box>

                        {isAdmin(user) &&
                          <Button fullWidth onClick={() => onCopyDescriptionClick(book.bookSeries.description)}>
                            Скопіювати опис серії
                          </Button>}
                    </>}

                    {!!book.description && <>
                      <Box px={1} dangerouslySetInnerHTML={{ __html: book.description }} mb={1}></Box>

                        {isAdmin(user) && <Button fullWidth onClick={() => onCopyDescriptionClick(book.description)}>
                          Скопіювати опис
                        </Button>}
                    </>}
                </Grid>
              </Grid>

              <GroupDiscountBooks bookId={book.id} onBookClick={onGroupDiscountBookClick}/>

                {/*comment*/}
              <Grid container spacing={2} position="relative">
                <Loading show={!loading && loadingComments} isSmall={true}></Loading>

                <Grid item xs={12}>
                  <Box sx={styleVariables.sectionTitle} mb={loadingComments ? 1 : 0}>Відгуки покупців</Box>
                </Grid>

                <Grid item xs={12} md={7} lg={8} display="flex" justifyContent="center"
                      alignItems={!comments?.length ? 'center' : 'flex-start'}>
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
                            <IconWithText imageLink="/no_comments.svg" text="На даний момент список відгуків порожній"/>
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

                {!book.bookSeries.default &&
                  <Grid container position="relative" display="flex" justifyContent="center" alignItems="center"
                        spacing={2}>
                    <Loading show={loadingBooksFromSeries} isSmall={true}></Loading>

                    <Grid item xs={12}>
                      <Box sx={styleVariables.sectionTitle}>
                        Інші книги із цієї серії

                          {booksFromSeries?.length === (mobileMatches ? 2 : 5) &&
                            <Button variant="outlined"
                                    onClick={() => router.push(`/books?bookSeries=${book.bookSeries.id}`)}>
                              Дивитися усі<ArrowForwardIcon/>
                            </Button>}
                      </Box>
                    </Grid>

                    <BooksList items={booksFromSeries} pageUrl={router.query.pageUrl as string}></BooksList>

                      {!booksFromSeries?.length &&
                        <Grid item xs={12} mb={2} display="flex" justifyContent="center">
                          В цій серії більше немає книг
                        </Grid>}
                  </Grid>}

              <DiscountBooks/>

                {book.authors.filter(a => !!a.description).map((author, index) => (
                    <Grid key={index} container spacing={2} mb={2}>
                        {!index && <Grid item xs={12}>
                          <Box sx={styleVariables.sectionTitle}>Про автора</Box>
                        </Grid>}

                        <Grid item xs={12}>
                            <Box px={1} dangerouslySetInnerHTML={{ __html: author.description }}></Box>
                        </Grid>
                    </Grid>
                ))}

                {book.authors.length === 1 && !!booksByAuthor?.length &&
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box sx={styleVariables.sectionTitle} mb={2}>
                        Інші книги цього автора

                          {booksByAuthor?.length === (mobileMatches ? 2 : 5) &&
                            <Button variant="outlined"
                                    onClick={() => router.push(`/books?authors=${book.authors[0].id}`)}>
                              Дивитися усі<ArrowForwardIcon/></Button>}
                      </Box>

                      <Grid container spacing={2} position="relative" px={1} display="flex"
                            justifyContent="center">
                        <Loading show={loadingBooksByAuthor} isSmall={true}></Loading>

                        <BooksList items={booksByAuthor} pageUrl={router.query.pageUrl as string}></BooksList>
                      </Grid>
                    </Grid>
                  </Grid>}
            </>}

            {!!imageIds?.length &&
              <ImagesModal open={true} imageIds={imageIds} onClose={() => setImageIds(null)}></ImagesModal>}

            {error && <ErrorNotification error={error}></ErrorNotification>}

            <RecentlyViewedBooks/>

            <DeliveriesBox/>

            <SocialMediaBox/>

            {showEditModal &&
              <BookModal open={true} isAdmin={true} item={book} onClose={(updated) => onCloseEditModal(updated)}/>}
        </>);
}
