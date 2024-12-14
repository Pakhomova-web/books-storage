import { GraphQLResolveInfo } from 'graphql';
import { LanguageEntity, PublishingHouseEntity, PageTypeEntity, BookTypeEntity, CoverTypeEntity, BookSeriesEntity, BookEntity, AuthorEntity, UserEntity, DeliveryEntity, OrderEntity, GroupDiscountEntity } from '../data/types';
import { gql } from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Author = {
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name: Scalars['String']['output'];
};

export type AuthorCreateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type AuthorSubList = {
  items: Array<Author>;
  totalCount: Scalars['Int']['output'];
};

export type AuthorUpdateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type BasketGroupDiscountItem = {
  count: Scalars['Int']['output'];
  groupDiscountId: Scalars['ID']['output'];
};

export type BasketItem = {
  bookId: Scalars['ID']['output'];
  count: Scalars['Int']['output'];
};

export type Book = {
  ages?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  archived?: Maybe<Scalars['Boolean']['output']>;
  authors?: Maybe<Array<Maybe<Author>>>;
  bookSeries: BookSeries;
  bookTypes?: Maybe<Array<BookType>>;
  comments?: Maybe<Array<Maybe<Comment>>>;
  coverType: CoverType;
  description?: Maybe<Scalars['String']['output']>;
  discount?: Maybe<Scalars['Float']['output']>;
  format?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  illustrators?: Maybe<Array<Maybe<Author>>>;
  imageIds?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  isbn?: Maybe<Scalars['String']['output']>;
  languageBooks?: Maybe<Array<Book>>;
  languages: Array<Language>;
  name: Scalars['String']['output'];
  numberInStock?: Maybe<Scalars['Int']['output']>;
  numberOfPages: Scalars['Int']['output'];
  pageType: PageType;
  price: Scalars['Float']['output'];
  purchasePrice?: Maybe<Scalars['Float']['output']>;
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type BookCreateInput = {
  ages?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  authorIds?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  bookSeriesId: Scalars['ID']['input'];
  bookTypeIds: Array<Scalars['ID']['input']>;
  coverTypeId: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  discount?: InputMaybe<Scalars['Float']['input']>;
  format?: InputMaybe<Scalars['String']['input']>;
  illustratorIds?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  imageIds?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  isbn?: InputMaybe<Scalars['String']['input']>;
  languageBookIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  languageIds: Array<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  numberInStock?: InputMaybe<Scalars['Int']['input']>;
  numberOfPages: Scalars['Int']['input'];
  pageTypeId: Scalars['ID']['input'];
  price: Scalars['Float']['input'];
  purchasePrice?: InputMaybe<Scalars['Float']['input']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type BookLanguageItem = {
  id: Scalars['ID']['output'];
  languages: Array<Scalars['String']['output']>;
};

export type BookSearchInput = {
  ages?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  authors?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  bookSeries?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  bookTypes?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  coverType?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  isInStock?: InputMaybe<Scalars['Boolean']['input']>;
  isbn?: InputMaybe<Scalars['String']['input']>;
  languages?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  pageType?: InputMaybe<Scalars['ID']['input']>;
  priceMax?: InputMaybe<Scalars['Float']['input']>;
  priceMin?: InputMaybe<Scalars['Float']['input']>;
  publishingHouse?: InputMaybe<Scalars['ID']['input']>;
  quickSearch?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  withDiscount?: InputMaybe<Scalars['Boolean']['input']>;
};

export type BookSeries = {
  default?: Maybe<Scalars['Boolean']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name: Scalars['String']['output'];
  publishingHouse: PublishingHouse;
};

export type BookSeriesCreateInput = {
  default?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  publishingHouseId: Scalars['ID']['input'];
};

export type BookSeriesSearchInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  publishingHouse?: InputMaybe<Scalars['ID']['input']>;
};

export type BookSeriesSubList = {
  items: Array<BookSeries>;
  totalCount: Scalars['Int']['output'];
};

export type BookSeriesUpdateInput = {
  default?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  publishingHouseId: Scalars['ID']['input'];
};

export type BookSubList = {
  items: Array<Book>;
  totalCount: Scalars['Int']['output'];
};

export type BookType = {
  id?: Maybe<Scalars['ID']['output']>;
  imageId?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export type BookTypeCreateInput = {
  imageId?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type BookTypeSubList = {
  items: Array<BookType>;
  totalCount: Scalars['Int']['output'];
};

export type BookTypeUpdateInput = {
  id: Scalars['ID']['input'];
  imageId?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type BookUpdateInput = {
  ages?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  authorIds?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  bookSeriesId: Scalars['ID']['input'];
  bookTypeIds: Array<Scalars['ID']['input']>;
  coverTypeId: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  discount?: InputMaybe<Scalars['Float']['input']>;
  format?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  illustratorIds?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  imageIds?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  isbn?: InputMaybe<Scalars['String']['input']>;
  languageBookIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  languageIds: Array<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  numberInStock?: InputMaybe<Scalars['Int']['input']>;
  numberOfPages: Scalars['Int']['input'];
  pageTypeId: Scalars['ID']['input'];
  price?: InputMaybe<Scalars['Float']['input']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type BookUpdateNumberInStockUpdateInput = {
  id: Scalars['ID']['input'];
  purchasePrice: Scalars['Float']['input'];
  receivedNumber: Scalars['Int']['input'];
};

export type Comment = {
  approved?: Maybe<Scalars['Boolean']['output']>;
  date: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  username: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type CommentInput = {
  date: Scalars['String']['input'];
  email: Scalars['String']['input'];
  username: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type CoverType = {
  id?: Maybe<Scalars['ID']['output']>;
  name: Scalars['String']['output'];
};

export type CoverTypeCreateInput = {
  name: Scalars['String']['input'];
};

export type CoverTypeSubList = {
  items: Array<CoverType>;
  totalCount: Scalars['Int']['output'];
};

export type CoverTypeUpdateInput = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type Delivery = {
  id?: Maybe<Scalars['ID']['output']>;
  imageId?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export type DeliveryCreateInput = {
  imageId?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type DeliverySubList = {
  items: Array<Delivery>;
  totalCount: Scalars['Int']['output'];
};

export type DeliveryUpdateInput = {
  id: Scalars['ID']['input'];
  imageId?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type GroupDiscount = {
  books: Array<Book>;
  discount: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
};

export type GroupDiscountCreateInput = {
  bookIds: Array<Scalars['ID']['input']>;
  discount: Scalars['Float']['input'];
};

export type GroupDiscountSearchInput = {
  books?: InputMaybe<Array<Scalars['ID']['input']>>;
  isInStock?: InputMaybe<Scalars['Boolean']['input']>;
};

export type GroupDiscountSubList = {
  items: Array<GroupDiscount>;
  totalCount: Scalars['Int']['output'];
};

export type GroupDiscountUpdateInput = {
  bookIds: Array<Scalars['ID']['input']>;
  discount: Scalars['Float']['input'];
  id: Scalars['ID']['input'];
};

export type IOption = {
  description?: Maybe<Scalars['String']['output']>;
  fullDescription?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  label: Scalars['String']['output'];
};

export type Language = {
  id?: Maybe<Scalars['ID']['output']>;
  name: Scalars['String']['output'];
};

export type LanguageCreateInput = {
  name: Scalars['String']['input'];
};

export type LanguageSubList = {
  items: Array<Language>;
  totalCount: Scalars['Int']['output'];
};

export type LanguageUpdateInput = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type Mutation = {
  activateUser: Scalars['ID']['output'];
  addBookComment: Book;
  addBookInBasket?: Maybe<Array<BasketItem>>;
  addGroupDiscountInBasket?: Maybe<Array<BasketGroupDiscountItem>>;
  approveComment: Book;
  cancelOrder?: Maybe<Order>;
  changePassword?: Maybe<Scalars['String']['output']>;
  changePasswordByToken?: Maybe<Scalars['String']['output']>;
  changeRecentlyViewedBooks?: Maybe<Array<Book>>;
  createAuthor?: Maybe<Author>;
  createBook?: Maybe<Book>;
  createBookSeries?: Maybe<BookSeries>;
  createBookType?: Maybe<BookType>;
  createCoverType?: Maybe<CoverType>;
  createDelivery?: Maybe<Delivery>;
  createGroupDiscount?: Maybe<GroupDiscount>;
  createLanguage?: Maybe<Language>;
  createOrder?: Maybe<Order>;
  createPageType?: Maybe<PageType>;
  createPublishingHouse?: Maybe<PublishingHouse>;
  createUser?: Maybe<User>;
  deleteAuthor?: Maybe<Author>;
  deleteBookSeries?: Maybe<BookSeries>;
  deleteBookType?: Maybe<BookType>;
  deleteCoverType?: Maybe<CoverType>;
  deleteDelivery?: Maybe<Delivery>;
  deleteGroupDiscount?: Maybe<GroupDiscount>;
  deleteLanguage?: Maybe<Language>;
  deletePageType?: Maybe<PageType>;
  deletePublishingHouse?: Maybe<PublishingHouse>;
  likeBook?: Maybe<Array<Scalars['ID']['output']>>;
  login: UserToken;
  removeBookInBasket?: Maybe<Array<BasketItem>>;
  removeComment: Book;
  removeGroupDiscountFromBasket?: Maybe<Array<BasketGroupDiscountItem>>;
  sendUpdatePasswordLink?: Maybe<Scalars['String']['output']>;
  unlikeBook?: Maybe<Array<Scalars['ID']['output']>>;
  updateAuthor?: Maybe<Author>;
  updateBook?: Maybe<Book>;
  updateBookCountInBasket?: Maybe<Array<BasketItem>>;
  updateBookNumberInStock: Book;
  updateBookSeries?: Maybe<BookSeries>;
  updateBookType?: Maybe<BookType>;
  updateCoverType?: Maybe<CoverType>;
  updateDelivery?: Maybe<Delivery>;
  updateGroupDiscount?: Maybe<GroupDiscount>;
  updateGroupDiscountCountInBasket?: Maybe<Array<BasketGroupDiscountItem>>;
  updateLanguage?: Maybe<Language>;
  updateOrder?: Maybe<Order>;
  updatePageType?: Maybe<PageType>;
  updatePublishingHouse?: Maybe<PublishingHouse>;
  updateUser: User;
  user?: Maybe<User>;
};


export type MutationActivateUserArgs = {
  email: Scalars['String']['input'];
};


export type MutationAddBookCommentArgs = {
  id: Scalars['ID']['input'];
  input: CommentInput;
};


export type MutationAddBookInBasketArgs = {
  id: Scalars['ID']['input'];
};


export type MutationAddGroupDiscountInBasketArgs = {
  id: Scalars['ID']['input'];
};


export type MutationApproveCommentArgs = {
  input: UpdateCommentInput;
};


export type MutationCancelOrderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationChangePasswordByTokenArgs = {
  password: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type MutationChangeRecentlyViewedBooksArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCreateAuthorArgs = {
  input: AuthorCreateInput;
};


export type MutationCreateBookArgs = {
  input: BookCreateInput;
};


export type MutationCreateBookSeriesArgs = {
  input: BookSeriesCreateInput;
};


export type MutationCreateBookTypeArgs = {
  input: BookTypeCreateInput;
};


export type MutationCreateCoverTypeArgs = {
  input: CoverTypeCreateInput;
};


export type MutationCreateDeliveryArgs = {
  input: DeliveryCreateInput;
};


export type MutationCreateGroupDiscountArgs = {
  input: GroupDiscountCreateInput;
};


export type MutationCreateLanguageArgs = {
  input: LanguageCreateInput;
};


export type MutationCreateOrderArgs = {
  input: OrderCreateInput;
};


export type MutationCreatePageTypeArgs = {
  input: PageTypeCreateInput;
};


export type MutationCreatePublishingHouseArgs = {
  input: PublishingHouseCreateInput;
};


export type MutationCreateUserArgs = {
  input: UserCreateInput;
};


export type MutationDeleteAuthorArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteBookSeriesArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteBookTypeArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCoverTypeArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteDeliveryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteGroupDiscountArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteLanguageArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePageTypeArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePublishingHouseArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLikeBookArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationRemoveBookInBasketArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveCommentArgs = {
  input: UpdateCommentInput;
};


export type MutationRemoveGroupDiscountFromBasketArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSendUpdatePasswordLinkArgs = {
  email: Scalars['String']['input'];
};


export type MutationUnlikeBookArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateAuthorArgs = {
  input: AuthorUpdateInput;
};


export type MutationUpdateBookArgs = {
  input: BookUpdateInput;
  updateAllBooksInSeries?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationUpdateBookCountInBasketArgs = {
  count: Scalars['Int']['input'];
  id: Scalars['ID']['input'];
};


export type MutationUpdateBookNumberInStockArgs = {
  input: BookUpdateNumberInStockUpdateInput;
};


export type MutationUpdateBookSeriesArgs = {
  input: BookSeriesUpdateInput;
};


export type MutationUpdateBookTypeArgs = {
  input: BookTypeUpdateInput;
};


export type MutationUpdateCoverTypeArgs = {
  input: CoverTypeUpdateInput;
};


export type MutationUpdateDeliveryArgs = {
  input: DeliveryUpdateInput;
};


export type MutationUpdateGroupDiscountArgs = {
  input: GroupDiscountUpdateInput;
};


export type MutationUpdateGroupDiscountCountInBasketArgs = {
  count: Scalars['Int']['input'];
  id: Scalars['ID']['input'];
};


export type MutationUpdateLanguageArgs = {
  input: LanguageUpdateInput;
};


export type MutationUpdateOrderArgs = {
  input: OrderUpdateInput;
};


export type MutationUpdatePageTypeArgs = {
  input: PageTypeUpdateInput;
};


export type MutationUpdatePublishingHouseArgs = {
  input: PublishingHouseUpdateInput;
};


export type MutationUpdateUserArgs = {
  input: UserUpdateInput;
};

export type Order = {
  adminComment?: Maybe<Scalars['String']['output']>;
  books: Array<OrderBook>;
  city: Scalars['String']['output'];
  comment?: Maybe<Scalars['String']['output']>;
  date?: Maybe<Scalars['String']['output']>;
  delivery?: Maybe<Delivery>;
  district?: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  id?: Maybe<Scalars['ID']['output']>;
  instagramUsername?: Maybe<Scalars['String']['output']>;
  isCanceled?: Maybe<Scalars['Boolean']['output']>;
  isConfirmed?: Maybe<Scalars['Boolean']['output']>;
  isDone?: Maybe<Scalars['Boolean']['output']>;
  isPaid?: Maybe<Scalars['Boolean']['output']>;
  isPartlyPaid?: Maybe<Scalars['Boolean']['output']>;
  isSent?: Maybe<Scalars['Boolean']['output']>;
  lastName: Scalars['String']['output'];
  novaPostOffice?: Maybe<Scalars['Int']['output']>;
  orderNumber: Scalars['Int']['output'];
  phoneNumber: Scalars['String']['output'];
  postcode?: Maybe<Scalars['Int']['output']>;
  region: Scalars['String']['output'];
  trackingNumber?: Maybe<Scalars['String']['output']>;
  user: User;
};

export type OrderBook = {
  book: Book;
  count: Scalars['Int']['output'];
  discount?: Maybe<Scalars['Float']['output']>;
  groupDiscountId?: Maybe<Scalars['ID']['output']>;
  price: Scalars['Float']['output'];
};

export type OrderBookInput = {
  bookId: Scalars['ID']['input'];
  count: Scalars['Int']['input'];
  discount?: InputMaybe<Scalars['Float']['input']>;
  groupDiscountId?: InputMaybe<Scalars['String']['input']>;
  price: Scalars['Float']['input'];
};

export type OrderCreateInput = {
  adminComment?: InputMaybe<Scalars['String']['input']>;
  books: Array<OrderBookInput>;
  city: Scalars['String']['input'];
  comment?: InputMaybe<Scalars['String']['input']>;
  deliveryId: Scalars['ID']['input'];
  district?: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  instagramUsername?: InputMaybe<Scalars['String']['input']>;
  isDone?: InputMaybe<Scalars['Boolean']['input']>;
  isPaid?: InputMaybe<Scalars['Boolean']['input']>;
  isPartlyPaid?: InputMaybe<Scalars['Boolean']['input']>;
  isSent?: InputMaybe<Scalars['Boolean']['input']>;
  lastName: Scalars['String']['input'];
  novaPostOffice?: InputMaybe<Scalars['Int']['input']>;
  phoneNumber: Scalars['String']['input'];
  postcode?: InputMaybe<Scalars['Int']['input']>;
  region: Scalars['String']['input'];
  trackingNumber?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['ID']['input'];
};

export type OrderSearchInput = {
  firstName?: InputMaybe<Scalars['String']['input']>;
  instagramUsername?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  orderNumber?: InputMaybe<Scalars['Int']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  quickSearch?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<Scalars['ID']['input']>;
};

export type OrderSubList = {
  items: Array<Order>;
  totalCount: Scalars['Int']['output'];
};

export type OrderUpdateInput = {
  adminComment?: InputMaybe<Scalars['String']['input']>;
  books: Array<OrderBookInput>;
  city: Scalars['String']['input'];
  comment?: InputMaybe<Scalars['String']['input']>;
  deliveryId: Scalars['ID']['input'];
  district?: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  instagramUsername?: InputMaybe<Scalars['String']['input']>;
  isConfirmed?: InputMaybe<Scalars['Boolean']['input']>;
  isDone?: InputMaybe<Scalars['Boolean']['input']>;
  isPaid?: InputMaybe<Scalars['Boolean']['input']>;
  isPartlyPaid?: InputMaybe<Scalars['Boolean']['input']>;
  isSent?: InputMaybe<Scalars['Boolean']['input']>;
  lastName: Scalars['String']['input'];
  novaPostOffice?: InputMaybe<Scalars['Int']['input']>;
  phoneNumber: Scalars['String']['input'];
  postcode?: InputMaybe<Scalars['Int']['input']>;
  region: Scalars['String']['input'];
  trackingNumber?: InputMaybe<Scalars['String']['input']>;
};

export type PageType = {
  id?: Maybe<Scalars['ID']['output']>;
  name: Scalars['String']['output'];
};

export type PageTypeCreateInput = {
  name: Scalars['String']['input'];
};

export type PageTypeSubList = {
  items: Array<PageType>;
  totalCount: Scalars['Int']['output'];
};

export type PageTypeUpdateInput = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type PageableInput = {
  order?: InputMaybe<Scalars['String']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  rowsPerPage?: InputMaybe<Scalars['Int']['input']>;
};

export type PublishingHouse = {
  id?: Maybe<Scalars['ID']['output']>;
  imageId?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  tags?: Maybe<Scalars['String']['output']>;
};

export type PublishingHouseCreateInput = {
  imageId?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  tags?: InputMaybe<Scalars['String']['input']>;
};

export type PublishingHouseSubList = {
  items: Array<PublishingHouse>;
  totalCount: Scalars['Int']['output'];
};

export type PublishingHouseUpdateInput = {
  id: Scalars['ID']['input'];
  imageId?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  tags?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  authorById?: Maybe<Author>;
  authors?: Maybe<AuthorSubList>;
  balance?: Maybe<Scalars['Float']['output']>;
  bookById?: Maybe<Book>;
  bookComments?: Maybe<Array<Comment>>;
  bookSeries?: Maybe<BookSeriesSubList>;
  bookSeriesByIdQuery?: Maybe<BookSeries>;
  bookSeriesOptions?: Maybe<Array<IOption>>;
  bookTypeById?: Maybe<BookType>;
  bookTypes?: Maybe<BookTypeSubList>;
  books?: Maybe<BookSubList>;
  booksByAuthor?: Maybe<Array<Book>>;
  booksByIds?: Maybe<BookSubList>;
  booksFromSeries?: Maybe<Array<Book>>;
  booksNameByQuickSearch?: Maybe<Array<IOption>>;
  booksWithDiscount?: Maybe<Array<Book>>;
  booksWithNotApprovedComments?: Maybe<BookSubList>;
  checkResetPasswordToken?: Maybe<Scalars['String']['output']>;
  coverTypes?: Maybe<CoverTypeSubList>;
  deliveries?: Maybe<DeliverySubList>;
  deliveryOptions?: Maybe<Array<Delivery>>;
  groupDiscounts?: Maybe<GroupDiscountSubList>;
  groupDiscountsByIds?: Maybe<GroupDiscountSubList>;
  languageById?: Maybe<Language>;
  languages?: Maybe<LanguageSubList>;
  orders?: Maybe<OrderSubList>;
  pageTypes?: Maybe<PageTypeSubList>;
  publishingHouseById?: Maybe<PublishingHouse>;
  publishingHouses?: Maybe<PublishingHouseSubList>;
  refreshToken: UserToken;
  topOfSoldBooks?: Maybe<Array<Book>>;
};


export type QueryAuthorByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAuthorsArgs = {
  filters?: InputMaybe<SearchByNameInput>;
  pageSettings?: InputMaybe<PageableInput>;
};


export type QueryBookByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBookCommentsArgs = {
  id: Scalars['ID']['input'];
  page: Scalars['Int']['input'];
  rowsPerPage: Scalars['Int']['input'];
};


export type QueryBookSeriesArgs = {
  filters?: InputMaybe<BookSeriesSearchInput>;
  pageSettings?: InputMaybe<PageableInput>;
};


export type QueryBookSeriesByIdQueryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBookSeriesOptionsArgs = {
  filters?: InputMaybe<BookSeriesSearchInput>;
};


export type QueryBookTypeByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBookTypesArgs = {
  filters?: InputMaybe<SearchByNameInput>;
  pageSettings?: InputMaybe<PageableInput>;
};


export type QueryBooksArgs = {
  filters?: InputMaybe<BookSearchInput>;
  pageSettings?: InputMaybe<PageableInput>;
};


export type QueryBooksByAuthorArgs = {
  authorId: Scalars['ID']['input'];
  excludeBookSeriesId?: InputMaybe<Scalars['ID']['input']>;
  rowsPerPage: Scalars['Int']['input'];
};


export type QueryBooksByIdsArgs = {
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  pageSettings?: InputMaybe<PageableInput>;
};


export type QueryBooksFromSeriesArgs = {
  bookId: Scalars['ID']['input'];
  rowsPerPage: Scalars['Int']['input'];
};


export type QueryBooksNameByQuickSearchArgs = {
  quickSearch: Scalars['String']['input'];
};


export type QueryBooksWithDiscountArgs = {
  rowsPerPage: Scalars['Int']['input'];
};


export type QueryBooksWithNotApprovedCommentsArgs = {
  pageSettings?: InputMaybe<PageableInput>;
};


export type QueryCheckResetPasswordTokenArgs = {
  token: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type QueryCoverTypesArgs = {
  filters?: InputMaybe<SearchByNameInput>;
  pageSettings?: InputMaybe<PageableInput>;
};


export type QueryDeliveriesArgs = {
  filters?: InputMaybe<SearchByNameInput>;
  pageSettings?: InputMaybe<PageableInput>;
};


export type QueryGroupDiscountsArgs = {
  filters?: InputMaybe<GroupDiscountSearchInput>;
  pageSettings?: InputMaybe<PageableInput>;
};


export type QueryGroupDiscountsByIdsArgs = {
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  pageSettings?: InputMaybe<PageableInput>;
};


export type QueryLanguageByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLanguagesArgs = {
  filters?: InputMaybe<SearchByNameInput>;
  pageSettings?: InputMaybe<PageableInput>;
};


export type QueryOrdersArgs = {
  filters?: InputMaybe<OrderSearchInput>;
  pageSettings?: InputMaybe<PageableInput>;
};


export type QueryPageTypesArgs = {
  filters?: InputMaybe<SearchByNameInput>;
  pageSettings?: InputMaybe<PageableInput>;
};


export type QueryPublishingHouseByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPublishingHousesArgs = {
  filters?: InputMaybe<SearchByNameInput>;
  pageSettings?: InputMaybe<PageableInput>;
};


export type QueryRefreshTokenArgs = {
  refreshToken: Scalars['String']['input'];
};


export type QueryTopOfSoldBooksArgs = {
  rowsPerPage: Scalars['Int']['input'];
};

export type SearchByNameInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCommentInput = {
  bookId: Scalars['ID']['input'];
  commentId: Scalars['ID']['input'];
};

export type User = {
  basketGroupDiscounts?: Maybe<Array<BasketGroupDiscountItem>>;
  basketItems?: Maybe<Array<BasketItem>>;
  city?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  instagramUsername?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  likedBookIds?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  novaPostOffice?: Maybe<Scalars['Int']['output']>;
  password?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  postcode?: Maybe<Scalars['Int']['output']>;
  preferredDeliveryId?: Maybe<Scalars['ID']['output']>;
  recentlyViewedBookIds?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  recentlyViewedBooks?: Maybe<Array<Book>>;
  region?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
};

export type UserCreateInput = {
  city?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  firstName?: InputMaybe<Scalars['String']['input']>;
  instagramUsername?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  novaPostOffice?: InputMaybe<Scalars['Int']['input']>;
  password: Scalars['String']['input'];
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  postcode?: InputMaybe<Scalars['Int']['input']>;
  preferredDeliveryId?: InputMaybe<Scalars['ID']['input']>;
  region?: InputMaybe<Scalars['String']['input']>;
};

export type UserToken = {
  refreshToken: Scalars['String']['output'];
  token: Scalars['String']['output'];
  user: User;
};

export type UserUpdateInput = {
  city?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  instagramUsername?: InputMaybe<Scalars['String']['input']>;
  isConfirmed?: InputMaybe<Scalars['Boolean']['input']>;
  isDone?: InputMaybe<Scalars['Boolean']['input']>;
  isPaid?: InputMaybe<Scalars['Boolean']['input']>;
  isPartlyPaid?: InputMaybe<Scalars['Boolean']['input']>;
  isSent?: InputMaybe<Scalars['Boolean']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  novaPostOffice?: InputMaybe<Scalars['Int']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  postcode?: InputMaybe<Scalars['Int']['input']>;
  preferredDeliveryId?: InputMaybe<Scalars['ID']['input']>;
  region?: InputMaybe<Scalars['String']['input']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Author: ResolverTypeWrapper<AuthorEntity>;
  AuthorCreateInput: AuthorCreateInput;
  AuthorSubList: ResolverTypeWrapper<Omit<AuthorSubList, 'items'> & { items: Array<ResolversTypes['Author']> }>;
  AuthorUpdateInput: AuthorUpdateInput;
  BasketGroupDiscountItem: ResolverTypeWrapper<BasketGroupDiscountItem>;
  BasketItem: ResolverTypeWrapper<BasketItem>;
  Book: ResolverTypeWrapper<BookEntity>;
  BookCreateInput: BookCreateInput;
  BookLanguageItem: ResolverTypeWrapper<BookLanguageItem>;
  BookSearchInput: BookSearchInput;
  BookSeries: ResolverTypeWrapper<BookSeriesEntity>;
  BookSeriesCreateInput: BookSeriesCreateInput;
  BookSeriesSearchInput: BookSeriesSearchInput;
  BookSeriesSubList: ResolverTypeWrapper<Omit<BookSeriesSubList, 'items'> & { items: Array<ResolversTypes['BookSeries']> }>;
  BookSeriesUpdateInput: BookSeriesUpdateInput;
  BookSubList: ResolverTypeWrapper<Omit<BookSubList, 'items'> & { items: Array<ResolversTypes['Book']> }>;
  BookType: ResolverTypeWrapper<BookTypeEntity>;
  BookTypeCreateInput: BookTypeCreateInput;
  BookTypeSubList: ResolverTypeWrapper<Omit<BookTypeSubList, 'items'> & { items: Array<ResolversTypes['BookType']> }>;
  BookTypeUpdateInput: BookTypeUpdateInput;
  BookUpdateInput: BookUpdateInput;
  BookUpdateNumberInStockUpdateInput: BookUpdateNumberInStockUpdateInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Comment: ResolverTypeWrapper<Comment>;
  CommentInput: CommentInput;
  CoverType: ResolverTypeWrapper<CoverTypeEntity>;
  CoverTypeCreateInput: CoverTypeCreateInput;
  CoverTypeSubList: ResolverTypeWrapper<Omit<CoverTypeSubList, 'items'> & { items: Array<ResolversTypes['CoverType']> }>;
  CoverTypeUpdateInput: CoverTypeUpdateInput;
  Delivery: ResolverTypeWrapper<DeliveryEntity>;
  DeliveryCreateInput: DeliveryCreateInput;
  DeliverySubList: ResolverTypeWrapper<Omit<DeliverySubList, 'items'> & { items: Array<ResolversTypes['Delivery']> }>;
  DeliveryUpdateInput: DeliveryUpdateInput;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  GroupDiscount: ResolverTypeWrapper<GroupDiscountEntity>;
  GroupDiscountCreateInput: GroupDiscountCreateInput;
  GroupDiscountSearchInput: GroupDiscountSearchInput;
  GroupDiscountSubList: ResolverTypeWrapper<Omit<GroupDiscountSubList, 'items'> & { items: Array<ResolversTypes['GroupDiscount']> }>;
  GroupDiscountUpdateInput: GroupDiscountUpdateInput;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  IOption: ResolverTypeWrapper<IOption>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Language: ResolverTypeWrapper<LanguageEntity>;
  LanguageCreateInput: LanguageCreateInput;
  LanguageSubList: ResolverTypeWrapper<Omit<LanguageSubList, 'items'> & { items: Array<ResolversTypes['Language']> }>;
  LanguageUpdateInput: LanguageUpdateInput;
  Mutation: ResolverTypeWrapper<{}>;
  Order: ResolverTypeWrapper<OrderEntity>;
  OrderBook: ResolverTypeWrapper<Omit<OrderBook, 'book'> & { book: ResolversTypes['Book'] }>;
  OrderBookInput: OrderBookInput;
  OrderCreateInput: OrderCreateInput;
  OrderSearchInput: OrderSearchInput;
  OrderSubList: ResolverTypeWrapper<Omit<OrderSubList, 'items'> & { items: Array<ResolversTypes['Order']> }>;
  OrderUpdateInput: OrderUpdateInput;
  PageType: ResolverTypeWrapper<PageTypeEntity>;
  PageTypeCreateInput: PageTypeCreateInput;
  PageTypeSubList: ResolverTypeWrapper<Omit<PageTypeSubList, 'items'> & { items: Array<ResolversTypes['PageType']> }>;
  PageTypeUpdateInput: PageTypeUpdateInput;
  PageableInput: PageableInput;
  PublishingHouse: ResolverTypeWrapper<PublishingHouseEntity>;
  PublishingHouseCreateInput: PublishingHouseCreateInput;
  PublishingHouseSubList: ResolverTypeWrapper<Omit<PublishingHouseSubList, 'items'> & { items: Array<ResolversTypes['PublishingHouse']> }>;
  PublishingHouseUpdateInput: PublishingHouseUpdateInput;
  Query: ResolverTypeWrapper<{}>;
  SearchByNameInput: SearchByNameInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  UpdateCommentInput: UpdateCommentInput;
  User: ResolverTypeWrapper<UserEntity>;
  UserCreateInput: UserCreateInput;
  UserToken: ResolverTypeWrapper<Omit<UserToken, 'user'> & { user: ResolversTypes['User'] }>;
  UserUpdateInput: UserUpdateInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Author: AuthorEntity;
  AuthorCreateInput: AuthorCreateInput;
  AuthorSubList: Omit<AuthorSubList, 'items'> & { items: Array<ResolversParentTypes['Author']> };
  AuthorUpdateInput: AuthorUpdateInput;
  BasketGroupDiscountItem: BasketGroupDiscountItem;
  BasketItem: BasketItem;
  Book: BookEntity;
  BookCreateInput: BookCreateInput;
  BookLanguageItem: BookLanguageItem;
  BookSearchInput: BookSearchInput;
  BookSeries: BookSeriesEntity;
  BookSeriesCreateInput: BookSeriesCreateInput;
  BookSeriesSearchInput: BookSeriesSearchInput;
  BookSeriesSubList: Omit<BookSeriesSubList, 'items'> & { items: Array<ResolversParentTypes['BookSeries']> };
  BookSeriesUpdateInput: BookSeriesUpdateInput;
  BookSubList: Omit<BookSubList, 'items'> & { items: Array<ResolversParentTypes['Book']> };
  BookType: BookTypeEntity;
  BookTypeCreateInput: BookTypeCreateInput;
  BookTypeSubList: Omit<BookTypeSubList, 'items'> & { items: Array<ResolversParentTypes['BookType']> };
  BookTypeUpdateInput: BookTypeUpdateInput;
  BookUpdateInput: BookUpdateInput;
  BookUpdateNumberInStockUpdateInput: BookUpdateNumberInStockUpdateInput;
  Boolean: Scalars['Boolean']['output'];
  Comment: Comment;
  CommentInput: CommentInput;
  CoverType: CoverTypeEntity;
  CoverTypeCreateInput: CoverTypeCreateInput;
  CoverTypeSubList: Omit<CoverTypeSubList, 'items'> & { items: Array<ResolversParentTypes['CoverType']> };
  CoverTypeUpdateInput: CoverTypeUpdateInput;
  Delivery: DeliveryEntity;
  DeliveryCreateInput: DeliveryCreateInput;
  DeliverySubList: Omit<DeliverySubList, 'items'> & { items: Array<ResolversParentTypes['Delivery']> };
  DeliveryUpdateInput: DeliveryUpdateInput;
  Float: Scalars['Float']['output'];
  GroupDiscount: GroupDiscountEntity;
  GroupDiscountCreateInput: GroupDiscountCreateInput;
  GroupDiscountSearchInput: GroupDiscountSearchInput;
  GroupDiscountSubList: Omit<GroupDiscountSubList, 'items'> & { items: Array<ResolversParentTypes['GroupDiscount']> };
  GroupDiscountUpdateInput: GroupDiscountUpdateInput;
  ID: Scalars['ID']['output'];
  IOption: IOption;
  Int: Scalars['Int']['output'];
  Language: LanguageEntity;
  LanguageCreateInput: LanguageCreateInput;
  LanguageSubList: Omit<LanguageSubList, 'items'> & { items: Array<ResolversParentTypes['Language']> };
  LanguageUpdateInput: LanguageUpdateInput;
  Mutation: {};
  Order: OrderEntity;
  OrderBook: Omit<OrderBook, 'book'> & { book: ResolversParentTypes['Book'] };
  OrderBookInput: OrderBookInput;
  OrderCreateInput: OrderCreateInput;
  OrderSearchInput: OrderSearchInput;
  OrderSubList: Omit<OrderSubList, 'items'> & { items: Array<ResolversParentTypes['Order']> };
  OrderUpdateInput: OrderUpdateInput;
  PageType: PageTypeEntity;
  PageTypeCreateInput: PageTypeCreateInput;
  PageTypeSubList: Omit<PageTypeSubList, 'items'> & { items: Array<ResolversParentTypes['PageType']> };
  PageTypeUpdateInput: PageTypeUpdateInput;
  PageableInput: PageableInput;
  PublishingHouse: PublishingHouseEntity;
  PublishingHouseCreateInput: PublishingHouseCreateInput;
  PublishingHouseSubList: Omit<PublishingHouseSubList, 'items'> & { items: Array<ResolversParentTypes['PublishingHouse']> };
  PublishingHouseUpdateInput: PublishingHouseUpdateInput;
  Query: {};
  SearchByNameInput: SearchByNameInput;
  String: Scalars['String']['output'];
  UpdateCommentInput: UpdateCommentInput;
  User: UserEntity;
  UserCreateInput: UserCreateInput;
  UserToken: Omit<UserToken, 'user'> & { user: ResolversParentTypes['User'] };
  UserUpdateInput: UserUpdateInput;
};

export type AuthorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Author'] = ResolversParentTypes['Author']> = {
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AuthorSubListResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthorSubList'] = ResolversParentTypes['AuthorSubList']> = {
  items?: Resolver<Array<ResolversTypes['Author']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BasketGroupDiscountItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['BasketGroupDiscountItem'] = ResolversParentTypes['BasketGroupDiscountItem']> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  groupDiscountId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BasketItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['BasketItem'] = ResolversParentTypes['BasketItem']> = {
  bookId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookResolvers<ContextType = any, ParentType extends ResolversParentTypes['Book'] = ResolversParentTypes['Book']> = {
  ages?: Resolver<Maybe<Array<Maybe<ResolversTypes['Int']>>>, ParentType, ContextType>;
  archived?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  authors?: Resolver<Maybe<Array<Maybe<ResolversTypes['Author']>>>, ParentType, ContextType>;
  bookSeries?: Resolver<ResolversTypes['BookSeries'], ParentType, ContextType>;
  bookTypes?: Resolver<Maybe<Array<ResolversTypes['BookType']>>, ParentType, ContextType>;
  comments?: Resolver<Maybe<Array<Maybe<ResolversTypes['Comment']>>>, ParentType, ContextType>;
  coverType?: Resolver<ResolversTypes['CoverType'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  discount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  format?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  illustrators?: Resolver<Maybe<Array<Maybe<ResolversTypes['Author']>>>, ParentType, ContextType>;
  imageIds?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  isbn?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  languageBooks?: Resolver<Maybe<Array<ResolversTypes['Book']>>, ParentType, ContextType>;
  languages?: Resolver<Array<ResolversTypes['Language']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  numberInStock?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  numberOfPages?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pageType?: Resolver<ResolversTypes['PageType'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  purchasePrice?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  tags?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookLanguageItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['BookLanguageItem'] = ResolversParentTypes['BookLanguageItem']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  languages?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookSeriesResolvers<ContextType = any, ParentType extends ResolversParentTypes['BookSeries'] = ResolversParentTypes['BookSeries']> = {
  default?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  publishingHouse?: Resolver<ResolversTypes['PublishingHouse'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookSeriesSubListResolvers<ContextType = any, ParentType extends ResolversParentTypes['BookSeriesSubList'] = ResolversParentTypes['BookSeriesSubList']> = {
  items?: Resolver<Array<ResolversTypes['BookSeries']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookSubListResolvers<ContextType = any, ParentType extends ResolversParentTypes['BookSubList'] = ResolversParentTypes['BookSubList']> = {
  items?: Resolver<Array<ResolversTypes['Book']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['BookType'] = ResolversParentTypes['BookType']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  imageId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookTypeSubListResolvers<ContextType = any, ParentType extends ResolversParentTypes['BookTypeSubList'] = ResolversParentTypes['BookTypeSubList']> = {
  items?: Resolver<Array<ResolversTypes['BookType']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CommentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Comment'] = ResolversParentTypes['Comment']> = {
  approved?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CoverTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['CoverType'] = ResolversParentTypes['CoverType']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CoverTypeSubListResolvers<ContextType = any, ParentType extends ResolversParentTypes['CoverTypeSubList'] = ResolversParentTypes['CoverTypeSubList']> = {
  items?: Resolver<Array<ResolversTypes['CoverType']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeliveryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Delivery'] = ResolversParentTypes['Delivery']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  imageId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeliverySubListResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeliverySubList'] = ResolversParentTypes['DeliverySubList']> = {
  items?: Resolver<Array<ResolversTypes['Delivery']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GroupDiscountResolvers<ContextType = any, ParentType extends ResolversParentTypes['GroupDiscount'] = ResolversParentTypes['GroupDiscount']> = {
  books?: Resolver<Array<ResolversTypes['Book']>, ParentType, ContextType>;
  discount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GroupDiscountSubListResolvers<ContextType = any, ParentType extends ResolversParentTypes['GroupDiscountSubList'] = ResolversParentTypes['GroupDiscountSubList']> = {
  items?: Resolver<Array<ResolversTypes['GroupDiscount']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IOptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['IOption'] = ResolversParentTypes['IOption']> = {
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fullDescription?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LanguageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Language'] = ResolversParentTypes['Language']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LanguageSubListResolvers<ContextType = any, ParentType extends ResolversParentTypes['LanguageSubList'] = ResolversParentTypes['LanguageSubList']> = {
  items?: Resolver<Array<ResolversTypes['Language']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  activateUser?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<MutationActivateUserArgs, 'email'>>;
  addBookComment?: Resolver<ResolversTypes['Book'], ParentType, ContextType, RequireFields<MutationAddBookCommentArgs, 'id' | 'input'>>;
  addBookInBasket?: Resolver<Maybe<Array<ResolversTypes['BasketItem']>>, ParentType, ContextType, RequireFields<MutationAddBookInBasketArgs, 'id'>>;
  addGroupDiscountInBasket?: Resolver<Maybe<Array<ResolversTypes['BasketGroupDiscountItem']>>, ParentType, ContextType, RequireFields<MutationAddGroupDiscountInBasketArgs, 'id'>>;
  approveComment?: Resolver<ResolversTypes['Book'], ParentType, ContextType, RequireFields<MutationApproveCommentArgs, 'input'>>;
  cancelOrder?: Resolver<Maybe<ResolversTypes['Order']>, ParentType, ContextType, RequireFields<MutationCancelOrderArgs, 'id'>>;
  changePassword?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationChangePasswordArgs, 'newPassword' | 'password'>>;
  changePasswordByToken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationChangePasswordByTokenArgs, 'password' | 'userId'>>;
  changeRecentlyViewedBooks?: Resolver<Maybe<Array<ResolversTypes['Book']>>, ParentType, ContextType, RequireFields<MutationChangeRecentlyViewedBooksArgs, 'id'>>;
  createAuthor?: Resolver<Maybe<ResolversTypes['Author']>, ParentType, ContextType, RequireFields<MutationCreateAuthorArgs, 'input'>>;
  createBook?: Resolver<Maybe<ResolversTypes['Book']>, ParentType, ContextType, RequireFields<MutationCreateBookArgs, 'input'>>;
  createBookSeries?: Resolver<Maybe<ResolversTypes['BookSeries']>, ParentType, ContextType, RequireFields<MutationCreateBookSeriesArgs, 'input'>>;
  createBookType?: Resolver<Maybe<ResolversTypes['BookType']>, ParentType, ContextType, RequireFields<MutationCreateBookTypeArgs, 'input'>>;
  createCoverType?: Resolver<Maybe<ResolversTypes['CoverType']>, ParentType, ContextType, RequireFields<MutationCreateCoverTypeArgs, 'input'>>;
  createDelivery?: Resolver<Maybe<ResolversTypes['Delivery']>, ParentType, ContextType, RequireFields<MutationCreateDeliveryArgs, 'input'>>;
  createGroupDiscount?: Resolver<Maybe<ResolversTypes['GroupDiscount']>, ParentType, ContextType, RequireFields<MutationCreateGroupDiscountArgs, 'input'>>;
  createLanguage?: Resolver<Maybe<ResolversTypes['Language']>, ParentType, ContextType, RequireFields<MutationCreateLanguageArgs, 'input'>>;
  createOrder?: Resolver<Maybe<ResolversTypes['Order']>, ParentType, ContextType, RequireFields<MutationCreateOrderArgs, 'input'>>;
  createPageType?: Resolver<Maybe<ResolversTypes['PageType']>, ParentType, ContextType, RequireFields<MutationCreatePageTypeArgs, 'input'>>;
  createPublishingHouse?: Resolver<Maybe<ResolversTypes['PublishingHouse']>, ParentType, ContextType, RequireFields<MutationCreatePublishingHouseArgs, 'input'>>;
  createUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'input'>>;
  deleteAuthor?: Resolver<Maybe<ResolversTypes['Author']>, ParentType, ContextType, RequireFields<MutationDeleteAuthorArgs, 'id'>>;
  deleteBookSeries?: Resolver<Maybe<ResolversTypes['BookSeries']>, ParentType, ContextType, RequireFields<MutationDeleteBookSeriesArgs, 'id'>>;
  deleteBookType?: Resolver<Maybe<ResolversTypes['BookType']>, ParentType, ContextType, RequireFields<MutationDeleteBookTypeArgs, 'id'>>;
  deleteCoverType?: Resolver<Maybe<ResolversTypes['CoverType']>, ParentType, ContextType, RequireFields<MutationDeleteCoverTypeArgs, 'id'>>;
  deleteDelivery?: Resolver<Maybe<ResolversTypes['Delivery']>, ParentType, ContextType, RequireFields<MutationDeleteDeliveryArgs, 'id'>>;
  deleteGroupDiscount?: Resolver<Maybe<ResolversTypes['GroupDiscount']>, ParentType, ContextType, RequireFields<MutationDeleteGroupDiscountArgs, 'id'>>;
  deleteLanguage?: Resolver<Maybe<ResolversTypes['Language']>, ParentType, ContextType, RequireFields<MutationDeleteLanguageArgs, 'id'>>;
  deletePageType?: Resolver<Maybe<ResolversTypes['PageType']>, ParentType, ContextType, RequireFields<MutationDeletePageTypeArgs, 'id'>>;
  deletePublishingHouse?: Resolver<Maybe<ResolversTypes['PublishingHouse']>, ParentType, ContextType, RequireFields<MutationDeletePublishingHouseArgs, 'id'>>;
  likeBook?: Resolver<Maybe<Array<ResolversTypes['ID']>>, ParentType, ContextType, RequireFields<MutationLikeBookArgs, 'id'>>;
  login?: Resolver<ResolversTypes['UserToken'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'email' | 'password'>>;
  removeBookInBasket?: Resolver<Maybe<Array<ResolversTypes['BasketItem']>>, ParentType, ContextType, RequireFields<MutationRemoveBookInBasketArgs, 'id'>>;
  removeComment?: Resolver<ResolversTypes['Book'], ParentType, ContextType, RequireFields<MutationRemoveCommentArgs, 'input'>>;
  removeGroupDiscountFromBasket?: Resolver<Maybe<Array<ResolversTypes['BasketGroupDiscountItem']>>, ParentType, ContextType, RequireFields<MutationRemoveGroupDiscountFromBasketArgs, 'id'>>;
  sendUpdatePasswordLink?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationSendUpdatePasswordLinkArgs, 'email'>>;
  unlikeBook?: Resolver<Maybe<Array<ResolversTypes['ID']>>, ParentType, ContextType, RequireFields<MutationUnlikeBookArgs, 'id'>>;
  updateAuthor?: Resolver<Maybe<ResolversTypes['Author']>, ParentType, ContextType, RequireFields<MutationUpdateAuthorArgs, 'input'>>;
  updateBook?: Resolver<Maybe<ResolversTypes['Book']>, ParentType, ContextType, RequireFields<MutationUpdateBookArgs, 'input'>>;
  updateBookCountInBasket?: Resolver<Maybe<Array<ResolversTypes['BasketItem']>>, ParentType, ContextType, RequireFields<MutationUpdateBookCountInBasketArgs, 'count' | 'id'>>;
  updateBookNumberInStock?: Resolver<ResolversTypes['Book'], ParentType, ContextType, RequireFields<MutationUpdateBookNumberInStockArgs, 'input'>>;
  updateBookSeries?: Resolver<Maybe<ResolversTypes['BookSeries']>, ParentType, ContextType, RequireFields<MutationUpdateBookSeriesArgs, 'input'>>;
  updateBookType?: Resolver<Maybe<ResolversTypes['BookType']>, ParentType, ContextType, RequireFields<MutationUpdateBookTypeArgs, 'input'>>;
  updateCoverType?: Resolver<Maybe<ResolversTypes['CoverType']>, ParentType, ContextType, RequireFields<MutationUpdateCoverTypeArgs, 'input'>>;
  updateDelivery?: Resolver<Maybe<ResolversTypes['Delivery']>, ParentType, ContextType, RequireFields<MutationUpdateDeliveryArgs, 'input'>>;
  updateGroupDiscount?: Resolver<Maybe<ResolversTypes['GroupDiscount']>, ParentType, ContextType, RequireFields<MutationUpdateGroupDiscountArgs, 'input'>>;
  updateGroupDiscountCountInBasket?: Resolver<Maybe<Array<ResolversTypes['BasketGroupDiscountItem']>>, ParentType, ContextType, RequireFields<MutationUpdateGroupDiscountCountInBasketArgs, 'count' | 'id'>>;
  updateLanguage?: Resolver<Maybe<ResolversTypes['Language']>, ParentType, ContextType, RequireFields<MutationUpdateLanguageArgs, 'input'>>;
  updateOrder?: Resolver<Maybe<ResolversTypes['Order']>, ParentType, ContextType, RequireFields<MutationUpdateOrderArgs, 'input'>>;
  updatePageType?: Resolver<Maybe<ResolversTypes['PageType']>, ParentType, ContextType, RequireFields<MutationUpdatePageTypeArgs, 'input'>>;
  updatePublishingHouse?: Resolver<Maybe<ResolversTypes['PublishingHouse']>, ParentType, ContextType, RequireFields<MutationUpdatePublishingHouseArgs, 'input'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'input'>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
};

export type OrderResolvers<ContextType = any, ParentType extends ResolversParentTypes['Order'] = ResolversParentTypes['Order']> = {
  adminComment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  books?: Resolver<Array<ResolversTypes['OrderBook']>, ParentType, ContextType>;
  city?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  comment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  date?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  delivery?: Resolver<Maybe<ResolversTypes['Delivery']>, ParentType, ContextType>;
  district?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  instagramUsername?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isCanceled?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isConfirmed?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isDone?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isPaid?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isPartlyPaid?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isSent?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  novaPostOffice?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  orderNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  phoneNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  postcode?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  region?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trackingNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrderBookResolvers<ContextType = any, ParentType extends ResolversParentTypes['OrderBook'] = ResolversParentTypes['OrderBook']> = {
  book?: Resolver<ResolversTypes['Book'], ParentType, ContextType>;
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  discount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  groupDiscountId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrderSubListResolvers<ContextType = any, ParentType extends ResolversParentTypes['OrderSubList'] = ResolversParentTypes['OrderSubList']> = {
  items?: Resolver<Array<ResolversTypes['Order']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['PageType'] = ResolversParentTypes['PageType']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageTypeSubListResolvers<ContextType = any, ParentType extends ResolversParentTypes['PageTypeSubList'] = ResolversParentTypes['PageTypeSubList']> = {
  items?: Resolver<Array<ResolversTypes['PageType']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PublishingHouseResolvers<ContextType = any, ParentType extends ResolversParentTypes['PublishingHouse'] = ResolversParentTypes['PublishingHouse']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  imageId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tags?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PublishingHouseSubListResolvers<ContextType = any, ParentType extends ResolversParentTypes['PublishingHouseSubList'] = ResolversParentTypes['PublishingHouseSubList']> = {
  items?: Resolver<Array<ResolversTypes['PublishingHouse']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  authorById?: Resolver<Maybe<ResolversTypes['Author']>, ParentType, ContextType, RequireFields<QueryAuthorByIdArgs, 'id'>>;
  authors?: Resolver<Maybe<ResolversTypes['AuthorSubList']>, ParentType, ContextType, Partial<QueryAuthorsArgs>>;
  balance?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  bookById?: Resolver<Maybe<ResolversTypes['Book']>, ParentType, ContextType, RequireFields<QueryBookByIdArgs, 'id'>>;
  bookComments?: Resolver<Maybe<Array<ResolversTypes['Comment']>>, ParentType, ContextType, RequireFields<QueryBookCommentsArgs, 'id' | 'page' | 'rowsPerPage'>>;
  bookSeries?: Resolver<Maybe<ResolversTypes['BookSeriesSubList']>, ParentType, ContextType, Partial<QueryBookSeriesArgs>>;
  bookSeriesByIdQuery?: Resolver<Maybe<ResolversTypes['BookSeries']>, ParentType, ContextType, RequireFields<QueryBookSeriesByIdQueryArgs, 'id'>>;
  bookSeriesOptions?: Resolver<Maybe<Array<ResolversTypes['IOption']>>, ParentType, ContextType, Partial<QueryBookSeriesOptionsArgs>>;
  bookTypeById?: Resolver<Maybe<ResolversTypes['BookType']>, ParentType, ContextType, RequireFields<QueryBookTypeByIdArgs, 'id'>>;
  bookTypes?: Resolver<Maybe<ResolversTypes['BookTypeSubList']>, ParentType, ContextType, Partial<QueryBookTypesArgs>>;
  books?: Resolver<Maybe<ResolversTypes['BookSubList']>, ParentType, ContextType, Partial<QueryBooksArgs>>;
  booksByAuthor?: Resolver<Maybe<Array<ResolversTypes['Book']>>, ParentType, ContextType, RequireFields<QueryBooksByAuthorArgs, 'authorId' | 'rowsPerPage'>>;
  booksByIds?: Resolver<Maybe<ResolversTypes['BookSubList']>, ParentType, ContextType, Partial<QueryBooksByIdsArgs>>;
  booksFromSeries?: Resolver<Maybe<Array<ResolversTypes['Book']>>, ParentType, ContextType, RequireFields<QueryBooksFromSeriesArgs, 'bookId' | 'rowsPerPage'>>;
  booksNameByQuickSearch?: Resolver<Maybe<Array<ResolversTypes['IOption']>>, ParentType, ContextType, RequireFields<QueryBooksNameByQuickSearchArgs, 'quickSearch'>>;
  booksWithDiscount?: Resolver<Maybe<Array<ResolversTypes['Book']>>, ParentType, ContextType, RequireFields<QueryBooksWithDiscountArgs, 'rowsPerPage'>>;
  booksWithNotApprovedComments?: Resolver<Maybe<ResolversTypes['BookSubList']>, ParentType, ContextType, Partial<QueryBooksWithNotApprovedCommentsArgs>>;
  checkResetPasswordToken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<QueryCheckResetPasswordTokenArgs, 'token' | 'userId'>>;
  coverTypes?: Resolver<Maybe<ResolversTypes['CoverTypeSubList']>, ParentType, ContextType, Partial<QueryCoverTypesArgs>>;
  deliveries?: Resolver<Maybe<ResolversTypes['DeliverySubList']>, ParentType, ContextType, Partial<QueryDeliveriesArgs>>;
  deliveryOptions?: Resolver<Maybe<Array<ResolversTypes['Delivery']>>, ParentType, ContextType>;
  groupDiscounts?: Resolver<Maybe<ResolversTypes['GroupDiscountSubList']>, ParentType, ContextType, Partial<QueryGroupDiscountsArgs>>;
  groupDiscountsByIds?: Resolver<Maybe<ResolversTypes['GroupDiscountSubList']>, ParentType, ContextType, Partial<QueryGroupDiscountsByIdsArgs>>;
  languageById?: Resolver<Maybe<ResolversTypes['Language']>, ParentType, ContextType, RequireFields<QueryLanguageByIdArgs, 'id'>>;
  languages?: Resolver<Maybe<ResolversTypes['LanguageSubList']>, ParentType, ContextType, Partial<QueryLanguagesArgs>>;
  orders?: Resolver<Maybe<ResolversTypes['OrderSubList']>, ParentType, ContextType, Partial<QueryOrdersArgs>>;
  pageTypes?: Resolver<Maybe<ResolversTypes['PageTypeSubList']>, ParentType, ContextType, Partial<QueryPageTypesArgs>>;
  publishingHouseById?: Resolver<Maybe<ResolversTypes['PublishingHouse']>, ParentType, ContextType, RequireFields<QueryPublishingHouseByIdArgs, 'id'>>;
  publishingHouses?: Resolver<Maybe<ResolversTypes['PublishingHouseSubList']>, ParentType, ContextType, Partial<QueryPublishingHousesArgs>>;
  refreshToken?: Resolver<ResolversTypes['UserToken'], ParentType, ContextType, RequireFields<QueryRefreshTokenArgs, 'refreshToken'>>;
  topOfSoldBooks?: Resolver<Maybe<Array<ResolversTypes['Book']>>, ParentType, ContextType, RequireFields<QueryTopOfSoldBooksArgs, 'rowsPerPage'>>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  basketGroupDiscounts?: Resolver<Maybe<Array<ResolversTypes['BasketGroupDiscountItem']>>, ParentType, ContextType>;
  basketItems?: Resolver<Maybe<Array<ResolversTypes['BasketItem']>>, ParentType, ContextType>;
  city?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  instagramUsername?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  likedBookIds?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  novaPostOffice?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  password?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phoneNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  postcode?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  preferredDeliveryId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  recentlyViewedBookIds?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  recentlyViewedBooks?: Resolver<Maybe<Array<ResolversTypes['Book']>>, ParentType, ContextType>;
  region?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  role?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserTokenResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserToken'] = ResolversParentTypes['UserToken']> = {
  refreshToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Author?: AuthorResolvers<ContextType>;
  AuthorSubList?: AuthorSubListResolvers<ContextType>;
  BasketGroupDiscountItem?: BasketGroupDiscountItemResolvers<ContextType>;
  BasketItem?: BasketItemResolvers<ContextType>;
  Book?: BookResolvers<ContextType>;
  BookLanguageItem?: BookLanguageItemResolvers<ContextType>;
  BookSeries?: BookSeriesResolvers<ContextType>;
  BookSeriesSubList?: BookSeriesSubListResolvers<ContextType>;
  BookSubList?: BookSubListResolvers<ContextType>;
  BookType?: BookTypeResolvers<ContextType>;
  BookTypeSubList?: BookTypeSubListResolvers<ContextType>;
  Comment?: CommentResolvers<ContextType>;
  CoverType?: CoverTypeResolvers<ContextType>;
  CoverTypeSubList?: CoverTypeSubListResolvers<ContextType>;
  Delivery?: DeliveryResolvers<ContextType>;
  DeliverySubList?: DeliverySubListResolvers<ContextType>;
  GroupDiscount?: GroupDiscountResolvers<ContextType>;
  GroupDiscountSubList?: GroupDiscountSubListResolvers<ContextType>;
  IOption?: IOptionResolvers<ContextType>;
  Language?: LanguageResolvers<ContextType>;
  LanguageSubList?: LanguageSubListResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Order?: OrderResolvers<ContextType>;
  OrderBook?: OrderBookResolvers<ContextType>;
  OrderSubList?: OrderSubListResolvers<ContextType>;
  PageType?: PageTypeResolvers<ContextType>;
  PageTypeSubList?: PageTypeSubListResolvers<ContextType>;
  PublishingHouse?: PublishingHouseResolvers<ContextType>;
  PublishingHouseSubList?: PublishingHouseSubListResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserToken?: UserTokenResolvers<ContextType>;
};

